import React, { useState, useEffect } from 'react';

export default function LotusPreviewEngine({ files, activeFile = 'index.html' }) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'files'
  const [blobUrl, setBlobUrl] = useState('');

  // 1. Compile files into a single standalone HTML document containing tailwind + code
  const generateHTMLContent = () => {
    const mainHtml = files?.[activeFile] || files?.['index.html'] || '<h1>No content found</h1>';
    
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
        <body>
          ${mainHtml}
        </body>
      </html>
    `;
  };

  // 2. Generate and rotate the local Blob URL whenever code changes
  useEffect(() => {
    const htmlContent = generateHTMLContent();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    setBlobUrl(url);

    // Clean up memory to avoid memory leaks
    return () => URL.revokeObjectURL(url);
  }, [files, activeFile]);

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    }
  };

  const handleRefresh = () => {
    const currentUrl = blobUrl;
    setBlobUrl('');
    setTimeout(() => setBlobUrl(currentUrl), 50);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
      {/* Top Preview Control Header MenuBar matched to dihsign */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#F3F4F6] bg-white select-none">
        <div className="flex items-center gap-1 bg-[#F3F4F6] p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode('files')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'files' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {/* Code SVG Icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Files
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {/* Eye SVG Icon */}
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
              {/* External Link SVG Icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Open in new tab
            </button>
            <button 
              onClick={handleRefresh}
              className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#E5E7EB] bg-white rounded-md hover:bg-gray-50 shadow-sm transition-colors"
            >
              {/* Refresh SVG Icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* Content Rendering Container View */}
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
          /* File viewer fallback window layout */
          <div className="p-4 font-mono text-xs text-gray-700 overflow-auto h-full bg-white leading-relaxed">
            <pre className="whitespace-pre-wrap">{files?.[activeFile] || ''}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
