import React, { useState, useEffect } from 'react';

export default function Preview({ code }) {
  const [blobUrl, setBlobUrl] = useState('');

  useEffect(() => {
    if (!code) return;

    // Clean up markdown block wraps if the AI outputs them
    let cleanCode = code.replace(/```jsx|```javascript|```html|```/g, '').trim();

    // Wrap the raw React/JSX code inside a valid HTML document with browser CDNs
    const documentTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lotus Preview</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-white m-0 p-0">
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        
        // Safety Fallbacks for common routing components used by the AI
        const BrowserRouter = ({ children }) => <div>{children}</div>;
        const Routes = ({ children }) => <div>{children}</div>;
        const Route = ({ element }) => element || null;
        const ScrollToTop = () => null;

        ${cleanCode}
    </script>
</body>
</html>
    `;

    const blob = new Blob([documentTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [code]);

  if (!code) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Ready to render...
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      className="w-full h-full border-0 min-h-[500px]"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
