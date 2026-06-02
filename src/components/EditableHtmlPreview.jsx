import { useState, useCallback, useEffect, useRef } from 'react';
import { getHtmlPages, getHtmlPreviewContent } from '../api';

// Normalizes generated CDN-based previews so they render reliably in the iframe:
// 1. Aliases the framer-motion UMD global so both `Motion` and `FramerMotion` work.
// 2. Provides a `LucideReact` global (built from the vanilla `lucide` icon data),
//    since the lucide-react CDN bundle does not expose that global.
// 3. Re-runs Babel's JSX transform on load, since the auto-run is unreliable
//    when the document is injected via doc.write().
const RUNTIME_SHIM = `<script>(function(){
  function aliasMotion(){try{var m=window.Motion||window.FramerMotion||window.framerMotion;if(m){window.Motion=m;window.FramerMotion=m;window.framerMotion=m;}}catch(e){}}
  function makeIcon(name){return function(props){props=props||{};var R=window.React;if(!R)return null;var data=(window.lucide&&((window.lucide.icons&&window.lucide.icons[name])||window.lucide[name]))||[];var size=props.size!=null?props.size:24;var kids=(Array.isArray(data)?data:[]).map(function(n,i){return R.createElement(n[0],Object.assign({key:i},n[1]));});return R.createElement('svg',{xmlns:'http://www.w3.org/2000/svg',width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:props.strokeWidth!=null?props.strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',className:props.className,style:props.style,'aria-hidden':true},kids);};}
  function aliasLucide(){try{if(typeof window.LucideReact==='undefined'&&typeof Proxy!=='undefined'){var p=new Proxy({},{get:function(_,name){if(typeof name!=='string'||name==='__esModule'||name==='default')return undefined;return makeIcon(name);}});window.LucideReact=p;window.lucideReact=p;}}catch(e){}}
  aliasMotion();aliasLucide();
  window.addEventListener('load',function(){try{aliasMotion();aliasLucide();if(window.Babel&&window.Babel.transformScriptTags){window.Babel.transformScriptTags();}}catch(e){console.error('[preview]',e);}});
})();</script>`;

function withPreviewRuntimeFixes(html) {
  if (!html || typeof html !== 'string') return html;
  // Inject the shim at the end of <head> so it runs after the CDN scripts load.
  if (html.includes('</head>')) return html.replace('</head>', `${RUNTIME_SHIM}</head>`);
  return RUNTIME_SHIM + html;
}

/**
 * HTML preview: displays generated HTML with Open in new tab and Refresh.
 * Uses doc.write (like lotus-studio) for reliable rendering.
 */
export default function EditableHtmlPreview({ html: htmlProp, project, theme }) {
  const [injectKey, setInjectKey] = useState(0);
  const [selectedPage, setSelectedPage] = useState('index.html');
  const iframeRef = useRef(null);
  const pages = project ? getHtmlPages(project) : [];

  useEffect(() => {
    if (pages.length > 0 && !pages.includes(selectedPage)) {
      setSelectedPage(pages[0]);
    }
  }, [pages.join(','), selectedPage]);

  const rawHtml = project ? getHtmlPreviewContent(project, selectedPage) : htmlProp || '';
  const html = withPreviewRuntimeFixes(rawHtml);

  useEffect(() => {
    if (!html || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [html, selectedPage, injectKey]);

  const isLight = theme === 'light';
  const borderCl = isLight ? 'border-[rgba(220,211,195,0.9)]' : 'border-white/[0.06]';
  const btnCl = isLight
    ? 'bg-[#f6f4ec] hover:bg-[#e9dfcf] border-[rgba(220,211,195,0.9)] text-text-primary'
    : 'bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.08] text-text-primary';

  const openInNewTab = useCallback(() => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, [html]);

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${isLight ? 'bg-[#f9f8f6]' : 'bg-surface'}`}>
      <div className={`flex-none flex items-center justify-between px-4 py-2.5 border-b ${borderCl} gap-3 flex-wrap`}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary">HTML preview</span>
          {pages.length > 1 && (
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className={`text-xs px-2 py-1 rounded border ${btnCl}`}
            >
              {pages.map((p) => (
                <option key={p} value={p}>{p.replace('.html', '').replace('.htm', '')}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openInNewTab}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 transition-colors ${btnCl}`}
            title="Open in new tab"
          >
            <i className="ph ph-arrow-square-out text-sm" />
            Open in new tab
          </button>
          <button
            type="button"
            onClick={() => setInjectKey((k) => k + 1)}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border flex items-center gap-1 transition-colors ${btnCl}`}
            title="Refresh preview"
          >
            <i className="ph ph-arrow-clockwise text-sm" />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        <iframe
          ref={iframeRef}
          key={injectKey}
          title="HTML Preview"
          className={`absolute inset-0 w-full h-full border-0 ${isLight ? 'bg-white' : 'bg-white'}`}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
