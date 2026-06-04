import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabase =
  SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Normalize generated CDN globals so published sites render standalone:
// aliases framer-motion (UMD global is `Motion`) and provides a `LucideReact`
// global built from the vanilla `lucide` icon data.
const RUNTIME_SHIM = `<script>(function(){
  function aliasMotion(){try{var m=window.Motion||window.FramerMotion||window.framerMotion;if(m){window.Motion=m;window.FramerMotion=m;window.framerMotion=m;}}catch(e){}}
  function makeIcon(name){return function(props){props=props||{};var R=window.React;if(!R)return null;var data=(window.lucide&&((window.lucide.icons&&window.lucide.icons[name])||window.lucide[name]))||[];var size=props.size!=null?props.size:24;var kids=(Array.isArray(data)?data:[]).map(function(n,i){return R.createElement(n[0],Object.assign({key:i},n[1]));});return R.createElement('svg',{xmlns:'http://www.w3.org/2000/svg',width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:props.strokeWidth!=null?props.strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',className:props.className,style:props.style,'aria-hidden':true},kids);};}
  function aliasLucide(){try{if(typeof window.LucideReact==='undefined'&&typeof Proxy!=='undefined'){var p=new Proxy({},{get:function(_,name){if(typeof name!=='string'||name==='__esModule'||name==='default')return undefined;return makeIcon(name);}});window.LucideReact=p;window.lucideReact=p;}}catch(e){}}
  aliasMotion();aliasLucide();
  window.addEventListener('load',function(){try{aliasMotion();aliasLucide();if(window.Babel&&window.Babel.transformScriptTags){window.Babel.transformScriptTags();}}catch(e){console.error('[preview]',e);}});
})();</script>`;

function withRuntimeFixes(html) {
  if (!html || typeof html !== "string") return html;
  if (html.includes("</head>")) return html.replace("</head>", `${RUNTIME_SHIM}</head>`);
  return RUNTIME_SHIM + html;
}

function notFoundPage() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Site not found</title><style>body{margin:0;font-family:Georgia,'Times New Roman',serif;background:#fdf2f6;color:#7a2942;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center}div{max-width:28rem;padding:2rem}h1{font-size:2rem;margin:0 0 .5rem}p{color:#a05673}</style></head><body><div><h1>Site not found</h1><p>This Lotus site doesn't exist or hasn't been published yet.</p></div></body></html>`;
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export default async (req) => {
  // Path is /s/:slug — pull the last non-empty segment.
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const slug = segments[segments.length - 1];

  if (!supabase || !slug || slug === "s") {
    return htmlResponse(notFoundPage(), 404);
  }

  try {
    const { data, error } = await supabase
      .from("published_sites")
      .select("html_content")
      .eq("subdomain", slug)
      .maybeSingle();

    if (error || !data) {
      return htmlResponse(notFoundPage(), 404);
    }

    return htmlResponse(withRuntimeFixes(data.html_content), 200);
  } catch {
    return htmlResponse(notFoundPage(), 404);
  }
};
