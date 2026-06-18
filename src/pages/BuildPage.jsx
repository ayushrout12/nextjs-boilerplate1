import React, { useState, useEffect } from 'react';
import { Eye, Code, ExternalLink, RefreshCw, Coins, Folder, Plus, Send, Paperclip } from 'lucide-react';

export default function BuildPage() {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'files'
  const [blobUrl, setBlobUrl] = useState('');
  const [promptText, setPromptText] = useState('');

  // Replicating state matching your app context
  const [credits, setCredits] = useState(20);
  
  // Dummy starter multi-file bundle payload showing a custom tailwind sandbox structure
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

  // --- PREVIEW BLOB ENGINE PIPELINE ---
  
  // Compiles files into a unified standalone document shell
  const generateHTMLContent = () => {
    const rawContent = projectFiles[activeFile] || '<h1>No content found</h1>';
    
    // Automatically inject scripts or standard Tailwind CDN fallback if missing
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

  // Triggers updates to the safe isolated Blob URL window context
  useEffect(() => {
    const htmlContent = generateHTMLContent();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    setBlobUrl(url);

    // Memory lifecycle cleanup hook
    return () => URL.revokeObjectURL(url);
  }, [projectFiles, activeFile]);

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    }
  };

  const handleRefresh = () => {
    const currentUrl = blobUrl;
    setBlobUrl('');
    setTimeout(() => setBlobUrl(currentUrl), 40);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-white font-sans text-gray-900 antialiased selection:bg-purple-100">
      
      {/* 1. TOP GLOBAL NAVIGATION BAR */}
      <header className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-4 bg-white z-20 shrink-0 select-none">
        <div className="flex items-center gap-6">
          {/* Brand Logo Wrapper */}
          <div className="flex items-center gap-1.5 font-semibold text-sm tracking-tight text-gray-900 cursor-pointer">
            <span className="text-base">🌸</span>
            <span>lotus</span>
            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono font-medium">ai</span>
          </div>
          
          {/* Workspace Controls */}
          <nav className="flex items-center gap-1">
            <button className="px-3 py-1.5 bg-[#F3F4F6] text-gray-900 text-xs font-medium rounded-md">build</button>
            <button className="px-3 py-1.5 text-gray-500 hover:text-gray-900 text-xs font-medium transition-colors">blog</button>
            <button className="px-3 py-1.5 text-gray-500 hover:text-gray-900 text-xs font-medium transition-colors">docs</button>
          </nav>
        </div>

        {/* User Identity and Subscription Utility Profiles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] rounded-full text-xs font-medium shadow-sm">
            <Coins className="w-3.5 h-3.5 text-[#D97706]" />
            <span>{credits}/20 credits</span>
          </div>
          <div className="flex items-center gap-2 bg-[#F3F4F6] pl-2 pr-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              A
            </div>
            <span className="text-xs font-medium text-gray-700">Ayush Rout</span>
          </div>
        </div>
      </header>

      {/* 2. THE THREE-COLUMN DASHBOARD WORKSPACE GRID */}
      <div className="flex flex-1 w-full overflow-hidden relative">
        
        {/* PANEL A: HISTORICAL DIRECTORY LOGS DRAWER (LEFT SIDEBAR) */}
        <aside className="w-64 border-r border-[#E5E7EB] bg-[#FAFAFA] flex flex-col h-full shrink-0 select-none">
          <div className="p-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-gray-400" /> Projects
            </span>
            <button className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors">
              <Plus className="w-4 h-4" />
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

        {/* PANEL B: THE CHAT STREAM DIALOGUE FEED (CENTER WORKSPACE) */}
        <main className="flex-1 flex flex-col h-full bg-white border-r border-[#E5E7EB]">
          {/* Scrolling Conversational Context Window */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="text-xs text-gray-400 font-mono tracking-tight">chat</div>
            <div className="text-sm text-gray-400 font-serif italic antialiased tracking-wide">ask to edit your design</div>
            
            {/* Tag component mirroring the image overlay */}
            <div className="flex justify-end pt-2">
              <div className="bg-[#F3F4F6] text-gray-600 text-xs px-3 py-1.5 rounded-full font-mono tracking-wider shadow-sm border border-gray-100 select-none">
                3r4e
              </div>
            </div>
          </div>

          {/* Core Generative Control Terminal Input Bar */}
          <div className="p-4 border-t border-[#F3F4F6] bg-white shrink-0">
            <div className="max-w-2xl mx-auto relative flex items-center bg-[#FCFBF9] border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 transition-all shadow-sm">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Make the header darker..." 
                className="w-full bg-transparent mx-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
              <button className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Dynamic Model Dropdowns Controls */}
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

        {/* PANEL C: BLOB SANDBOXED PREVIEW ENGINE RUNTIME VIEWPORT (RIGHT WORKSPACE) */}
        <section className="w-[45%] h-full p-3 bg-white shrink-0 flex flex-col">
          <div className="w-full h-full flex flex-col bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm">
            
            {/* Viewport Control Tab Bar Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#F3F4F6] bg-white select-none shrink-0">
              <div className="flex items-center gap-1 bg-[#F3F4F6] p-0.5 rounded-lg">
                <button
                  onClick={() => setViewMode('files')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'files' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  Files
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
              </div>

              {/* Functional Preview Interactivity Control Tools */}
              {viewMode === 'preview' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleOpenNewTab}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-[#E5E7EB] bg-white rounded-md hover:bg-gray-50 font-medium transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in new tab
                  </button>
                  <button 
                    onClick={handleRefresh}
                    className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#E5E7EB] bg-white rounded-md hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Sandbox Render Box Frame or Multi-file Text Canvas Editor viewports */}
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
