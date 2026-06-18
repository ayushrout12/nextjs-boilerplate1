import React, { useState, useEffect } from 'react';
import { Eye, Code, ExternalLink, RefreshCw } from 'lucide-react';

export default function LotusPreviewEngine({ files, activeFile = 'index.html' }) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'files'
  const [blobUrl, setBlobUrl] = useState('');

  // 1. Compile files into a single standalone HTML document containing tailwind + code
  const generateHTMLContent = () => {
    // Assuming multi-file structure. Get main HTML or assemble React/HTML blocks.
    const mainHtml = files?.[activeFile] || files?.['index.html'] || '<h1>No content found</h1>';
    
    // Inject scripts, styling, or Tailwind play CDN seamlessly if missing
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; font-family: sans-serif; }
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
    // Force recreate preview content trigger
    const currentUrl = blobUrl;
    setBlobUrl('');
    setTimeout(() => setBlobUrl(currentUrl), 50);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
      {/* Top Preview Control Header MenuBar matched to dihsign */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#F3F4F6] bg-white">
        <div className="flex items-center gap-2 bg-[#F3F4F6] p-0.5 rounded-md">
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

        {viewMode === 'preview' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-[#E5E7EB] rounded-md hover:bg-gray-50 font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in new tab
            </button>
            <button 
              onClick={handleRefresh}
              className="p-1.5 text-gray-400 hover:text-gray-600 border border-[#E5E7EB] rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content Rendering Container View */}
      <div className="flex-1 bg-[#F9FAFB] relative h-full">
        {viewMode === 'preview' ? (
          blobUrl ? (
            <iframe
              src={blobUrl}
              title="Lotus Render Shell"
              className="w-full h-full bg-white border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
              Ready to render...
            </div>
          )
        ) : (
          /* File viewer fallback window layout */
          <div className="p-4 font-mono text-xs text-gray-700 overflow-auto h-full bg-white">
            <pre>{files?.[activeFile] || ''}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
