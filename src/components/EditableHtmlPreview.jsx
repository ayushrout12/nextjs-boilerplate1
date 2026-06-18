import React, { useState, useEffect } from 'react';

export default function EditableHtmlPreview({ rawCode }) {
  const [activeTab, setActiveTab] = useState('preview'); // Default fallback if needed
  const [iframeUrl, setIframeUrl] = useState('');
  const [parsedFiles, setParsedFiles] = useState({});
  const [summaryMessage, setSummaryMessage] = useState('');

  useEffect(() => {
    if (!rawCode) return;

    // 1. EXTRACT JSON OR FILE BLOCKS FROM THE LLM RESPONSE
    let filesData = {};
    const jsonMatch = rawCode.match(/```json\n([\s\S]*?)\n```/);

    if (jsonMatch) {
      try {
        filesData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed parsing inline JSON block, attempting line fallback...", e);
      }
    }

    // Fallback: If it's not a direct JSON block, parse out ---FILE:filename--- blocks manually
    if (Object.keys(filesData).length === 0) {
      const fileParts = rawCode.split(/---FILE:\s*([^\s]+)\s*---/);
      for (let i = 1; i < fileParts.length; i += 2) {
        const filename = fileParts[i];
        const content = fileParts[i + 1];
        if (filename && content) {
          filesData[filename] = content.trim().replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
        }
      }
    }

    // If it's just raw HTML/JS text with no file markers, treat it as a single index.html
    if (Object.keys(filesData).length === 0) {
      filesData['index.html'] = rawCode;
    }

    setParsedFiles(filesData);
    const totalFiles = Object.keys(filesData).length;
    setSummaryMessage(`✅ Updated ${totalFiles} file${totalFiles > 1 ? 's' : ''} successfully.`);

    // 2. BUNDLE COMPLEX VITE/REACT ON THE FLY FOR THE BLOB PREVIEW
    // Extract key files or fall back to defaults
    const htmlContent = filesData['index.html'] || `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display&family=Inter:wght@300;400;500;600;700&display=swap">
        </head>
        <body class="bg-gray-50 text-gray-900">
          <div id="root"></div>
        </body>
      </html>
    `;

    // Extract styles or configurations
    const tailwindConfig = filesData['tailwind.config.js'] || '';
    const customCss = filesData['src/index.css'] || filesData['index.css'] || '';

    // Extract core logic files
    const mainAppCode = filesData['src/App.jsx'] || filesData['App.jsx'] || filesData['src/App.tsx'] || '';
    const mainJsCode = filesData['src/main.jsx'] || filesData['main.js'] || filesData['src/index.js'] || '';

    // Create a client-side unified preview that resolves modern standard browser modules via ESM
    const bundledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <style>
          ${customCss}
          body { font-family: 'Inter', sans-serif; }
        </style>
        <script type="importmap">
          {
            "imports": {
              "react": "https://esm.sh/react@18.2.0",
              "react-dom": "https://esm.sh/react-dom@18.2.0",
              "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
              "framer-motion": "https://esm.sh/framer-motion@10.16.4",
              "lucide-react": "https://esm.sh/lucide-react@0.263.1"
            }
          }
        </script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      </head>
      <body>
        <div id="root"></div>
        
        <script type="text/babel" data-type="module">
          import React from 'react';
          import { createRoot } from 'react-dom/client';

          // Inline child component dependencies if written by LLM
          ${Object.keys(filesData)
            .filter(f => f.includes('components/') || (f.endsWith('.jsx') && !f.includes('App') && !f.includes('main')))
            .map(f => `// File: ${f}\n${filesData[f]}`)
            .join('\n\n')
            .replace(/import.*?from.*/g, '') // Strip imports to prevent compilation crashes in inline babel
            .replace(/export default/g, 'const ' + 'ExportedComponent = ')
          }

          // Core Application Code
          ${mainAppCode ? mainAppCode.replace(/import.*?from.*/g, '') : `const App = () => <div>No App.jsx file specified.</div>;`}

          // Render Initialization
          try {
            const root = createRoot(document.getElementById('root'));
            // Look for whatever component was fallback or main exported
            const TargetApp = typeof App !== 'undefined' ? App : (typeof ExportedComponent !== 'undefined' ? ExportedComponent : null);
            if (TargetApp) {
              root.render(React.createElement(TargetApp));
            } else {
              document.getElementById('root').innerHTML = '<div style="padding:20px;color:red;">Error: Could not locate root App component interface.</div>';
            }
          } catch (err) {
            document.getElementById('root').innerHTML = '<div style="padding:20px;color:red;">Runtime Build Error: ' + err.message + '</div>';
          }
        </script>
      </body>
      </html>
    `;

    // Generate fresh execution blob URL
    const blob = new Blob([bundledHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeUrl(url);

    // Cleanup reference on unmount or updates
    return () => URL.revokeObjectURL(url);
  }, [rawCode]);

  return (
    <div className="w-full h-full flex flex-col bg-[#050812] text-white overflow-hidden relative">
      {/* CRITICAL HACKATHON FIX: Secondary inner navigation headers/tabs are REMOVED here. 
        It defers to the main layout application controls entirely.
      */}
      
      {/* Dynamic Compilation Status Indicator */}
      {summaryMessage && (
        <div className="bg-[#1A2B42]/80 border-b border-[#B89C5D]/30 px-4 py-2 text-xs font-mono text-[#F9F8F6] flex justify-between items-center tracking-wide">
          <span>{summaryMessage}</span>
          <span className="text-[10px] bg-[#B89C5D] text-[#0A1128] px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
            Live Sandbox
          </span>
        </div>
      )}

      {/* Main Execution Viewport */}
      <div className="flex-1 w-full h-full bg-white relative">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            title="Lotus Live Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-modals allow-same-origin"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050812] text-gray-400 p-6 text-center">
            <div className="w-8 h-8 border-4 border-[#B89C5D] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-mono text-sm tracking-wide">Compiling workspace and resolving dependencies...</p>
          </div>
        )}
      </div>
    </div>
  );
}
