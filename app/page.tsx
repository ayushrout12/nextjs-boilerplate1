'use client'

import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState<string>('')
  const [currentHTML, setCurrentHTML] = useState<string>(`<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: system-ui;"><div style="text-align: center;"><h1>🌸 TryLotus.dev</h1><p>Enter a prompt to generate your website</p></div></div>`)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const generateWebsite = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedHTML = generateTemplate(prompt)
      setCurrentHTML(generatedHTML)
      setIsGenerating(false)
    }, 2000)
  }

  const generateTemplate = (prompt: string): string => {
    const promptLower = prompt.toLowerCase()
    
    // Portfolio template
    if (promptLower.includes('portfolio')) {
      return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio | TryLotus</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        header {
            text-align: center;
            padding: 60px 0;
        }
        h1 {
            font-size: 48px;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #fff, #e0e7ff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        .projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 60px;
        }
        .project-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            transition: transform 0.3s;
        }
        .project-card:hover {
            transform: translateY(-10px);
        }
        footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 40px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        @media (max-width: 768px) {
            h1 { font-size: 32px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>✨ ${prompt.split(' ').slice(0, 3).join(' ') || 'Creative Portfolio'}</h1>
            <p>Bringing ideas to life through code and creativity</p>
        </header>
        <div class="projects">
            <div class="project-card">
                <h3>Project One</h3>
                <p>An innovative solution that solves real-world problems.</p>
            </div>
            <div class="project-card">
                <h3>Project Two</h3>
                <p>Pushing boundaries with modern technologies.</p>
            </div>
            <div class="project-card">
                <h3>Project Three</h3>
                <p>Creating memorable experiences through design.</p>
            </div>
        </div>
        <footer>
            <p>© 2024 Built with 🌸 TryLotus.dev</p>
        </footer>
    </div>
</body>
</html>`
    }
    
    // Business template
    if (promptLower.includes('business') || promptLower.includes('company')) {
      return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business | TryLotus</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, sans-serif;
            background: #f8f9fa;
            color: #333;
        }
        .navbar {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px 0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 100px 0;
            text-align: center;
        }
        .hero h1 {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .btn-primary {
            background: white;
            color: #667eea;
            padding: 12px 30px;
            border: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
        }
        .services {
            padding: 80px 0;
            background: white;
        }
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }
        .service-card {
            text-align: center;
            padding: 40px;
            background: #f8f9fa;
            border-radius: 20px;
            transition: transform 0.3s;
        }
        .service-card:hover {
            transform: translateY(-10px);
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 32px; }
        }
    </style>
</head>
<body>
    <div class="navbar">
        <div class="container">
            <h2>BusinessPro</h2>
        </div>
    </div>
    <div class="hero">
        <div class="container">
            <h1>${prompt.split(' ').slice(0, 4).join(' ') || 'Transform Your Business'}</h1>
            <p style="font-size: 18px; margin-top: 20px;">Innovative solutions for modern enterprises</p>
            <button class="btn-primary">Get Started</button>
        </div>
    </div>
    <div class="services">
        <div class="container">
            <h2 style="text-align: center;">Our Services</h2>
            <div class="services-grid">
                <div class="service-card">
                    <h3>Strategy</h3>
                    <p>Data-driven insights to guide your growth</p>
                </div>
                <div class="service-card">
                    <h3>Innovation</h3>
                    <p>Cutting-edge solutions for challenges</p>
                </div>
                <div class="service-card">
                    <h3>Support</h3>
                    <p>24/7 dedicated support for success</p>
                </div>
            </div>
        </div>
    </div>
    <footer style="background: #333; color: white; text-align: center; padding: 40px 0;">
        <p>© 2024 Built with 🌸 TryLotus.dev</p>
    </footer>
</body>
</html>`
    }
    
    // Default template
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TryLotus | Generated Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            animation: fadeIn 0.6s ease;
        }
        h1 {
            font-size: 32px;
            margin-bottom: 20px;
            color: #333;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
            .card { padding: 30px; }
            h1 { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="card">
        <div style="font-size: 60px; margin-bottom: 20px;">🌸</div>
        <h1>${prompt.split(' ').slice(0, 5).join(' ') || 'Your Generated Website'}</h1>
        <p>${prompt || 'This website was generated by TryLotus.dev AI Agent'}</p>
        <p style="font-size: 14px; margin-top: 20px;">Built with 🌸 TryLotus.dev</p>
    </div>
</body>
</html>`
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '350px', 
        background: '#1a1a2e', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '20px',
        borderRight: '1px solid #9b7bff'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <i className="fas fa-lotus" style={{ fontSize: '50px', color: '#9b7bff' }}></i>
          <h1 style={{ marginTop: '10px', fontSize: '28px' }}>TryLotus.dev</h1>
          <p style={{ fontSize: '12px', opacity: 0.7 }}>AI-Powered Website Builder</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
            What website do you want to build?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example:&#10;&#10;'Create a modern portfolio website with a dark theme, animations, and a contact form'&#10;&#10;or&#10;&#10;'Build a business landing page for a tech startup'"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #9b7bff',
              background: '#16213e',
              color: 'white',
              minHeight: '150px',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          onClick={generateWebsite}
          disabled={isGenerating}
          style={{
            background: 'linear-gradient(135deg, #9b7bff, #6b46c0)',
            color: 'white',
            padding: '14px',
            border: 'none',
            borderRadius: '8px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            opacity: isGenerating ? 0.5 : 1,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isGenerating) e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {isGenerating ? (
            <>
              <i className="fas fa-spinner fa-pulse"></i> Generating...
            </>
          ) : (
            <>
              <i className="fas fa-magic"></i> Generate with AI
            </>
          )}
        </button>

        <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(155, 123, 255, 0.1)', borderRadius: '8px', fontSize: '12px' }}>
          <i className="fas fa-info-circle"></i> Tip: Be specific about what you want!
        </div>
      </div>

      {/* Preview Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          background: '#16213e', 
          padding: '12px 20px', 
          borderBottom: '2px solid #9b7bff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ color: 'white', margin: 0 }}>
            <i className="fas fa-eye"></i> Live Preview
          </h3>
          <button
            onClick={() => {
              const newWindow = window.open()
              newWindow.document.write(currentHTML)
              newWindow.document.close()
            }}
            style={{
              background: 'rgba(155, 123, 255, 0.2)',
              border: '1px solid #9b7bff',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            <i className="fas fa-external-link-alt"></i> Open in New Tab
          </button>
        </div>
        <iframe
          srcDoc={currentHTML}
          title="Live Preview"
          style={{ flex: 1, border: 'none', background: 'white' }}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  )
}
