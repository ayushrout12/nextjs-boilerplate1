import React, { useState, useEffect, useMemo } from 'react';
import { getHtmlPages, getHtmlPreviewContent } from '../api';

/**
 * Runtime shim injected into every preview document.
 *
 * The generated index.html relies on CDN globals that are frequently broken:
 *   - lucide-react has NO browser UMD build (the CDN URL 404s) -> LucideReact undefined
 *   - framer-motion's UMD global is `Motion`, not `FramerMotion`
 * Either one being undefined throws during render and leaves a BLANK preview.
 *
 * This shim runs after the page's own CDN <script> tags but before the
 * compiled `text/babel` app code, and guarantees those globals always exist
 * with safe, render-only fallbacks. It also shows a visible error overlay so
 * the preview never silently blanks.
 */
const PREVIEW_RUNTIME = `
<script>
(function () {
  function showOverlay(msg) {
    try {
      var el = document.getElementById('__lotus_err');
      if (!el) {
        el = document.createElement('div');
        el.id = '__lotus_err';
        el.style.cssText = 'position:fixed;left:0;right:0;bottom:0;max-height:45%;overflow:auto;background:#7f1d1d;color:#fff;font:12px/1.5 ui-monospace,Menlo,monospace;padding:12px 16px;z-index:2147483647;white-space:pre-wrap;box-shadow:0 -2px 12px rgba(0,0,0,.3)';
        (document.body || document.documentElement).appendChild(el);
      }
      el.textContent = 'Preview error:\\n' + msg;
    } catch (e) {}
  }
  window.addEventListener('error', function (e) {
    showOverlay((e.message || 'Unknown error') + (e.filename ? ('\\n' + e.filename + ':' + (e.lineno||0)) : ''));
  });
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason;
    showOverlay('Unhandled rejection: ' + ((r && r.message) || r));
  });

  var R = window.React;

  // ---- framer-motion: ensure window.FramerMotion exists ----
  if (typeof window.FramerMotion === 'undefined') {
    var real = window.Motion || window.framerMotion || null;
    if (real && (real.motion || real.m)) {
      window.FramerMotion = real;
    } else if (R) {
      var ANIM_PROPS = ['initial','animate','exit','transition','variants','whileHover','whileTap','whileFocus','whileDrag','whileInView','viewport','layout','layoutId','layoutScroll','drag','dragConstraints','dragElastic','dragMomentum','onAnimationComplete','onAnimationStart','custom'];
      function strip(props) {
        var out = {};
        for (var k in props) { if (ANIM_PROPS.indexOf(k) === -1) out[k] = props[k]; }
        return out;
      }
      function makeMotionComponent(tag) {
        var Comp = R.forwardRef(function (props, ref) {
          var t = (typeof tag === 'string') ? tag : (tag || 'div');
          return R.createElement(t, Object.assign({ ref: ref }, strip(props || {})), props && props.children);
        });
        Comp.displayName = 'motion.' + (typeof tag === 'string' ? tag : 'component');
        return Comp;
      }
      var motionFn = function (component) { return makeMotionComponent(component); };
      var motionProxy = new Proxy(motionFn, {
        get: function (_t, tag) { return makeMotionComponent(tag); },
        apply: function (_t, _this, args) { return makeMotionComponent(args[0]); }
      });
      var motionValue = function (v) { var cur = v; return { get: function(){return cur;}, set: function(x){cur=x;}, onChange: function(){return function(){};}, current: cur }; };
      window.FramerMotion = {
        motion: motionProxy,
        m: motionProxy,
        AnimatePresence: function (p) { return R.createElement(R.Fragment, null, p && p.children); },
        LazyMotion: function (p) { return R.createElement(R.Fragment, null, p && p.children); },
        MotionConfig: function (p) { return R.createElement(R.Fragment, null, p && p.children); },
        domAnimation: {}, domMax: {},
        useInView: function () { return true; },
        useScroll: function () { return { scrollY: motionValue(0), scrollYProgress: motionValue(0), scrollX: motionValue(0), scrollXProgress: motionValue(0) }; },
        useTransform: function () { return motionValue(0); },
        useMotionValue: function (v) { return motionValue(v); },
        useMotionValueEvent: function () {},
        useSpring: function (v) { return motionValue(typeof v === 'number' ? v : 0); },
        useAnimation: function () { return { start: function(){return Promise.resolve();}, stop: function(){}, set: function(){} }; },
        useAnimationControls: function () { return { start: function(){return Promise.resolve();}, stop: function(){}, set: function(){} }; },
        useReducedMotion: function () { return false; }
      };
    }
  }

  // ---- lucide-react: ensure window.LucideReact exists ----
  if (typeof window.LucideReact === 'undefined' && R) {
    var GenericIcon = R.forwardRef(function (props, ref) {
      var p = Object.assign({}, props);
      var size = p.size || 24; delete p.size;
      return R.createElement('svg', Object.assign({
        ref: ref, xmlns: 'http://www.w3.org/2000/svg', width: size, height: size,
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        strokeWidth: p.strokeWidth || 2, strokeLinecap: 'round', strokeLinejoin: 'round'
      }, p),
        R.createElement('path', { d: 'M5 12h14M12 5v14' })
      );
    });
    window.LucideReact = new Proxy({}, {
      get: function (_t, name) {
        if (name === '__esModule') return false;
        if (name === 'default') return window.LucideReact;
        if (name === 'createLucideIcon') return function () { return GenericIcon; };
        return GenericIcon;
      }
    });
  }
})();
</script>
`;

/**
 * Inject the runtime shim right before the page's own scripts run. We place it
 * immediately before </head> when possible (after CDN <script> tags), otherwise
 * after <body>, otherwise prepend it.
 */
function withPreviewRuntime(html) {
  if (!html) return html;
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, PREVIEW_RUNTIME + '</head>');
  if (/<body[^>]*>/i.test(html)) return html.replace(/(<body[^>]*>)/i, '$1' + PREVIEW_RUNTIME);
  return PREVIEW_RUNTIME + html;
}

/**
 * Renders the generated, self-contained index.html in a sandboxed iframe via a
 * Blob URL, with a runtime shim that guarantees the preview never silently
 * blanks. Also supports opening the same document in a new tab.
 */
export default function EditableHtmlPreview({ project, theme }) {
  const pages = useMemo(() => getHtmlPages(project), [project]);
  const [activePage, setActivePage] = useState(null);
  const [iframeUrl, setIframeUrl] = useState('');

  const currentPage = activePage && pages.includes(activePage) ? activePage : pages[0] || null;

  const html = useMemo(
    () => withPreviewRuntime(getHtmlPreviewContent(project, currentPage)),
    [project, currentPage]
  );

  useEffect(() => {
    if (!html) {
      setIframeUrl('');
      return;
    }
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [html]);

  const openInNewTab = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const isLight = theme === 'light';

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden relative ${isLight ? 'bg-white' : 'bg-[#050812]'}`}>
      <div className={`flex-none flex items-center justify-between gap-2 px-3 py-2 border-b ${isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#0A1128]'}`}>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {pages.length > 1 ? (
            pages.map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                  p === currentPage
                    ? isLight ? 'bg-neutral-200 text-neutral-900' : 'bg-white/15 text-white'
                    : isLight ? 'text-neutral-500 hover:text-neutral-900' : 'text-white/50 hover:text-white'
                }`}
              >
                {p.replace(/\.html?$/i, '') || 'index'}
              </button>
            ))
          ) : (
            <span className={`text-xs font-mono tracking-wide ${isLight ? 'text-neutral-500' : 'text-white/50'}`}>
              Live preview
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={openInNewTab}
          disabled={!html}
          className={`flex-none flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors disabled:opacity-40 ${
            isLight ? 'text-neutral-600 hover:bg-black/5' : 'text-white/70 hover:bg-white/10'
          }`}
          title="Open preview in a new tab"
        >
          Open in new tab
          <i className="ph ph-arrow-square-out text-sm" />
        </button>
      </div>

      <div className="flex-1 w-full min-h-0 bg-white relative">
        {iframeUrl ? (
          <iframe
            key={iframeUrl}
            src={iframeUrl}
            title="Lotus Live Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-modals allow-popups allow-forms allow-same-origin"
          />
        ) : (
          <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${isLight ? 'bg-white text-neutral-400' : 'bg-[#050812] text-gray-400'}`}>
            <div className="w-8 h-8 border-4 border-[#B89C5D] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-mono text-sm tracking-wide">Preparing preview…</p>
          </div>
        )}
      </div>
    </div>
  );
}
