import React, { useState, useEffect } from 'react';

export default function BuildPage() {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'files'
  const [blobUrl, setBlobUrl] = useState('');
  const [promptText, setPromptText] = useState('');
  const [credits, setCredits] = useState(20);
  
  const [projectFiles, setProjectFiles] = useState({
    'index.html': `
<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-50 via-white to-purple-50 p-6">
  <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-purple-100">
    <span class="text-5xl">🎮</span>
    <h1 class="text-2xl font-bold mt-4 text-gray-800 tracking-tight">Apex Gaming Studios</h1>
    <p class="text-gray-500 mt-2 text-sm leading-relaxed">
      Crafting next-generation immersive digital sandbox environments and narrative experiences.
    </p>
    <div class="mt-6 flex justify-center gap-3">
      <button class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-100">
        Explore Fleet
      </button>
      <button class="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-semibold transition-all">
        Documentation
      </button>
    </div>
  </div>
</div>`
  });
  const [activeFile, setActiveFile] = useState('index.html');

  const generateHTMLContent = () => {
    const rawContent = projectFiles[activeFile] || '<h1>No content found</h1>';
    if (!rawContent.includes('tailwind')) {
      return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
            </style>
          </head>
          <body class="bg-white">
            ${rawContent}
          </body>
        </html>
      `;
    }
    return rawContent;
  };

  useEffect(() => {
    const htmlContent = generateHTMLContent();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [projectFiles, activeFile]);

  const handleOpenNewTab = () => {
    if (blobUrl) window.open(blobUrl, '_blank');
  };

  const handleRefresh = () => {
    const currentUrl = blobUrl;
    setBlobUrl('');
    setTimeout(() => setBlobUrl(currentUrl), 40);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-white font-sans text-gray-900 antialiased selection:bg-purple-100">
      
      {/* GLOBAL NAVBAR */}
      <header className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-4 bg-white z-20 shrink-0 select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 font-semibold text-sm tracking-tight text-gray-900 cursor-pointer">
            <span className="text-base">🌸</span>
            <span>lotus</span>
            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono font-medium">ai</span>
          </div>
          <nav className="flex items-center gap-1">
            <button className="px-3 py-1.5 bg-[#F3F4F6] text-gray-900 text-xs font-medium rounded-md">build</button>
            <button className="px-3 py-1.5 text-gray-500 hover:text-gray-900 text-xs font-medium transition-colors">blog</button>
            <button className="px-3 py-1.5 text-gray-500 hover:text-gray-900 text-xs font-medium transition-colors">docs</button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] rounded-full text-xs font-medium shadow-sm">
            {/* Custom Coin SVG */}
            <svg className="w-3.5 h-3.5 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="8"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <span>{credits}/20 credits</span>
          </div>
          <div className="flex items-center gap-2 bg-[#F3F4F6] pl-2 pr-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">A</div>
            <span className="text-xs font-medium text-gray-700">Ayush Rout</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <div className="flex flex-1 w-full overflow-hidden relative">
        
        {/* LEFT SIDEBAR: PROJECTS */}
        <aside className="w-64 border-r border-[#E5E7EB] bg-[#FAFAFA] flex flex-col h-full shrink-0 select-none">
          <div className="p-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              {/* Folder SVG */}
              <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Projects
            </span>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors">
              {/* Plus SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-1">
            <div className="p-3 bg-white border border-[#E5E7EB] rounded-lg shadow-sm cursor-pointer hover:border-purple-300 transition-all">
              <h4 className="text-xs font-medium text-gray-900 truncate">Gaming studio site — home (hero, fe...</h4>
              <p className="text-[10px] text-gray-400 mt-1 truncate">Gaming studio site — home (hero, feature...</p>
              <span className="text-[9px] text-gray-400 block mt-2 font-mono">6/16/2026</span>
            </div>
          </div>
        </aside>

        {/* CENTER WORKSPACE: CHAT */}
        <main className="flex-1 flex flex-col h-full bg-white border-r border-[#E5E7EB]">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="text-xs text-gray-400 font-mono tracking-tight">chat</div>
            <div className="text-sm text-gray-400 font-serif italic tracking-wide">ask to edit your design</div>
            <div className="flex justify-end pt-2">
              <div className="bg-[#F3F4F6] text-gray-600 text-xs px-3 py-1.5 rounded-full font-mono tracking-wider shadow-sm border border-gray-100 select-none">3r4e</div>
            </div>
          </div>

          {/* INPUT BAR */}
          <div className="p-4 border-t border-[#F3F4F6] bg-white shrink-0">
            <div className="max-w-2xl mx-auto relative flex items-center bg-[#FCFBF9] border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 transition-all shadow-sm">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                {/* Paperclip SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <input 
                type="text" 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Make the header darker..." 
                className="w-full bg-transparent mx-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <button className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm">
                {/* Send SVG */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
            <div className="max-w-2xl mx-auto flex items-center gap-2 mt-2 px-1 select-none">
              <select className="text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                <option>Gemini 2.5 Flash</option>
              </select>
              <select className="text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none cursor-pointer hover:bg-gray-100 transition-colors">
                <option>Stripe</option>
              </select>
            </div>
          </div>
        </main>

        {/* RIGHT WORKSPACE: PREVIEW ENGINE */}
        <section className="w-[45%] h-full p-3 bg-white shrink-0 flex flex-col">
          <div className="w-full h-full flex flex-col bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm">
            
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#F3F4F6] bg-white select-none shrink-0">
              <div className="flex items-center gap-1 bg-[#F3F4F6] p-0.5 rounded-lg">
                <button
                  onClick={() => setViewMode('files')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'files' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {/* Code SVG */}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  Files
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {/* Eye SVG */}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Preview
                </button>
              </div>

              {viewMode === 'preview' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleOpenNewTab}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-[#E5E7EB] bg-white rounded-md hover:bg-gray-50 font-medium transition-colors shadow-sm"
                  >
                    {/* External Link SVG */}
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Open in new tab
                  </button>
                  <button 
                    onClick={handleRefresh}
                    className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#E5E7EB] bg-white rounded-md hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    {/* Refresh SVG */}
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-[#FAFAFA] relative h-full overflow-hidden">
              {viewMode === 'preview' ? (
                blobUrl ? (
                  <iframe
                    src={blobUrl}
                    title="Lotus Render Shell"
                    className="w-full h-full bg-white border-0"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-medium tracking-wide">
                    Ready to render...
                  </div>
                )
              ) : (
                <div className="p-4 font-mono text-xs text-gray-700 overflow-auto h-full bg-white leading-relaxed">
                  <pre className="whitespace-pre-wrap">{projectFiles[activeFile]}</pre>
                </div>
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
