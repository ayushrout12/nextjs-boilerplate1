"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { 
  Send, 
  Loader2, 
  Monitor, 
  Smartphone, 
  Code,
  Eye,
  RefreshCw,
  Copy,
  Check,
  Download,
  AlertCircle,
  Globe,
  ArrowLeft,
  Moon,
  Sun,
  FileText,
  FileCode,
  FolderOpen,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PublishModal } from "@/components/publish-modal"

// ─── Types ───────────────────────────────────────────────
interface ParsedFile {
  name: string
  content: string
  language: string
}

// ─── Helpers ─────────────────────────────────────────────
function getUIMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
}

/**
 * Parse multi-file output from AI.
 * Supports:  ```filename.ext\n...\n```
 * Fallback:  ```html\n...\n```  (legacy single-file)
 */
function parseFiles(text: string, allowPartial: boolean = false): ParsedFile[] {
  const files: ParsedFile[] = []
  // Match ```filename\ncontent\n```
  const regex = /```(\S+)\n([\s\S]*?)```/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const label = match[1]
    const content = match[2].trim()
    
    // Determine if label is a filename or a language
    if (label.includes(".")) {
      // It's a filename like "index.html" or "styles.css"
      const ext = label.split(".").pop() || ""
      files.push({ name: label, content, language: ext })
    } else if (label === "html") {
      files.push({ name: "index.html", content, language: "html" })
    } else if (label === "css") {
      files.push({ name: "styles.css", content, language: "css" })
    } else if (label === "js" || label === "javascript") {
      files.push({ name: "script.js", content, language: "js" })
    }
  }

  // Partial streaming: try to capture an incomplete last block
  if (files.length === 0 && allowPartial) {
    const partialRegex = /```(\S+)\n([\s\S]+)$/
    const partialMatch = text.match(partialRegex)
    if (partialMatch && partialMatch[2].length > 50) {
      const label = partialMatch[1]
      let content = partialMatch[2].trim()
      if (label.includes(".")) {
        const ext = label.split(".").pop() || ""
        // Auto-close HTML if partial
        if (ext === "html") {
          if (!content.includes("</body>")) content += "\n</body>"
          if (!content.includes("</html>")) content += "\n</html>"
        }
        files.push({ name: label, content, language: ext })
      } else if (label === "html") {
        if (!content.includes("</body>")) content += "\n</body>"
        if (!content.includes("</html>")) content += "\n</html>"
        files.push({ name: "index.html", content, language: "html" })
      }
    }

    // Also try legacy: raw HTML without code fences
    if (files.length === 0) {
      if (text.includes("<!DOCTYPE html>") || text.includes("<html")) {
        const startIndex = text.indexOf("<!DOCTYPE html>") !== -1 
          ? text.indexOf("<!DOCTYPE html>") 
          : text.indexOf("<html")
        let content = text.slice(startIndex)
        const endIndex = content.lastIndexOf("</html>")
        if (endIndex !== -1) {
          content = content.slice(0, endIndex + 7)
        } else if (allowPartial) {
          if (!content.includes("</body>")) content += "\n</body>"
          if (!content.includes("</html>")) content += "\n</html>"
        } else {
          return files
        }
        files.push({ name: "index.html", content, language: "html" })
      }
    }
  }

  return files
}

/**
 * Build a full preview HTML by inlining CSS/JS from parsed files
 * into the index.html file.
 */
function buildPreviewHtml(files: ParsedFile[]): string | null {
  const indexFile = files.find(f => f.name === "index.html" || f.name.endsWith(".html"))
  if (!indexFile) return null

  let html = indexFile.content
  
  // Inline styles.css if present
  const cssFile = files.find(f => f.name === "styles.css" || f.language === "css")
  if (cssFile) {
    // Replace <link rel="stylesheet" href="styles.css"> with inline <style>
    html = html.replace(
      /<link[^>]*href=["']styles\.css["'][^>]*\/?>/gi,
      `<style>\n${cssFile.content}\n</style>`
    )
    // If no link tag found, inject before </head>
    if (!html.includes(cssFile.content)) {
      html = html.replace("</head>", `<style>\n${cssFile.content}\n</style>\n</head>`)
    }
  }

  // Inline script.js if present
  const jsFile = files.find(f => f.name === "script.js" || f.language === "js")
  if (jsFile) {
    html = html.replace(
      /<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi,
      `<script>\n${jsFile.content}\n</script>`
    )
    if (!html.includes(jsFile.content)) {
      html = html.replace("</body>", `<script>\n${jsFile.content}\n</script>\n</body>`)
    }
  }

  return html
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()
  switch (ext) {
    case "html": return <FileText className="w-4 h-4 text-orange-400" />
    case "css": return <FileCode className="w-4 h-4 text-blue-400" />
    case "js": return <FileCode className="w-4 h-4 text-yellow-400" />
    default: return <FileText className="w-4 h-4 text-muted-foreground" />
  }
}

// ─── Component ───────────────────────────────────────────
export default function BuilderClient() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") || ""
  const { theme, setTheme } = useTheme()
  
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<ParsedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<string>("index.html")
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [rawOutput, setRawOutput] = useState("")
  const [viewMode, setViewMode] = useState<"files" | "preview" | "html">("files")
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop")
  const [hasInitialized, setHasInitialized] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [publishModalOpen, setPublishModalOpen] = useState(false)

  const codeEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      if (err.message?.includes("credit card") || err.message?.includes("billing")) {
        setError("AI gateway requires billing setup. Please add a payment method.")
      } else {
        setError(err.message || "An unexpected error occurred")
      }
    }
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Auto-submit initial prompt
  useEffect(() => {
    if (initialPrompt && !hasInitialized && status === "ready") {
      setHasInitialized(true)
      setGenerationComplete(false)
      setFiles([])
      setPreviewHtml(null)
      setError(null)
      setCurrentPrompt(initialPrompt)
      setViewMode("files")
      sendMessage({ text: initialPrompt })
    }
  }, [initialPrompt, hasInitialized, status, sendMessage])

  // Process AI response into files
  useEffect(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant")
    
    if (assistantMessages.length > 0) {
      const latestMessage = assistantMessages[assistantMessages.length - 1]
      const text = getUIMessageText(latestMessage)
      
      setRawOutput(text)
      
      const isStreaming = status === "streaming"
      const parsed = parseFiles(text, isStreaming)
      
      if (parsed.length > 0) {
        setFiles(parsed)
        
        // Build preview
        const preview = buildPreviewHtml(parsed)
        if (preview) {
          setPreviewHtml(preview)
        }
        
        // Auto-switch to preview when generation completes
        if (status === "ready") {
          setGenerationComplete(true)
          setViewMode("preview")
        }
      }
    }
  }, [messages, status])

  // Auto-scroll code
  useEffect(() => {
    if (isLoading) {
      codeEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [rawOutput, isLoading])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setGenerationComplete(false)
    setFiles([])
    setRawOutput("")
    setPreviewHtml(null)
    setViewMode("files")
    setError(null)
    setCurrentPrompt(input.trim())
    sendMessage({ text: input.trim() })
    setInput("")
  }, [input, isLoading, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const refreshPreview = () => {
    if (iframeRef.current && previewHtml) {
      iframeRef.current.srcdoc = previewHtml
    }
  }

  const copyCode = async () => {
    const content = viewMode === "html" 
      ? (previewHtml || "") 
      : (files.find(f => f.name === selectedFile)?.content || "")
    if (content) {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadAll = () => {
    if (previewHtml) {
      const blob = new Blob([previewHtml], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "lotus-website.html"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const activeFileContent = files.find(f => f.name === selectedFile)?.content || ""

  return (
    <>
      <PublishModal
        open={publishModalOpen}
        onOpenChange={setPublishModalOpen}
        htmlContent={previewHtml || ""}
        title={currentPrompt ? currentPrompt.slice(0, 50) : "Untitled Website"}
      />
      
      <div className="flex flex-col h-screen bg-background">
        {/* ─── Top Bar ─────────────────────────────────────── */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-background shrink-0">
          {/* Left: back + logo */}
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-border">
              <Image src="/lotus-icon.jpg" alt="Lotus" width={28} height={28} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">Lotus</span>
            
            {/* Prompt display */}
            {currentPrompt && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                  {currentPrompt}
                </span>
              </>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5">
            {previewHtml && (
              <>
                <Button variant="ghost" size="icon" onClick={copyCode} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={downloadAll} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                  <Download className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => setPublishModalOpen(true)}
                  className="h-8 px-3 rounded-lg text-xs font-medium bg-foreground text-background hover:bg-foreground/90"
                >
                  <Globe className="w-3.5 h-3.5 mr-1.5" />
                  Publish
                </Button>
                <div className="w-px h-5 bg-border mx-1" />
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-lg"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* ─── Main content area ───────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* ─── Left sidebar: File tree + prompt ──────────── */}
          <div className="w-[280px] flex flex-col border-r border-border bg-background shrink-0">
            
            {/* Prompt input */}
            <div className="p-3 border-b border-border">
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="describe your design..."
                    rows={2}
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="absolute bottom-2 right-2 h-6 w-6 rounded-md bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30"
                  >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  </Button>
                </div>
              </form>
            </div>

            {/* File tree */}
            <div className="flex-1 overflow-y-auto">
              {files.length > 0 ? (
                <div className="py-2">
                  <div className="px-3 py-1.5 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                    <FolderOpen className="w-3.5 h-3.5" />
                    Files
                  </div>
                  {files.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => {
                        setSelectedFile(file.name)
                        setViewMode("files")
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors",
                        selectedFile === file.name && viewMode === "files"
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {getFileIcon(file.name)}
                      {file.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>generating...</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-start gap-2 text-sm text-red-500 text-left w-full px-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">describe your website to get started</p>
                      <div className="space-y-1.5">
                        {[
                          "a landing page for a law firm",
                          "portfolio for a photographer",
                          "restaurant with online menu"
                        ].map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => { setInput(prompt); inputRef.current?.focus() }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-transparent hover:border-border"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─── Right panel: code/preview ──────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab bar */}
            <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-muted/30 shrink-0">
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setViewMode("files")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    viewMode === "files" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Files
                </button>
                <button
                  onClick={() => setViewMode("preview")}
                  disabled={!previewHtml}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-30",
                    viewMode === "preview" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Preview
                  {previewHtml && !generationComplete && isLoading && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => setViewMode("html")}
                  disabled={!previewHtml}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-30",
                    viewMode === "html" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  HTML
                </button>
              </div>

              {/* Preview device toggles */}
              {viewMode === "preview" && previewHtml && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => setDeviceMode("desktop")}
                    className={cn("h-7 w-7 rounded-md", deviceMode === "desktop" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => setDeviceMode("mobile")}
                    className={cn("h-7 w-7 rounded-md", deviceMode === "mobile" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </Button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <Button variant="ghost" size="icon" onClick={refreshPreview} className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden">
              {viewMode === "files" ? (
                // ─── Code editor view ───
                <div className="h-full flex flex-col bg-background">
                  {activeFileContent ? (
                    <>
                      {/* File tab */}
                      <div className="h-9 px-4 flex items-center gap-2 border-b border-border bg-muted/20 text-xs shrink-0">
                        {getFileIcon(selectedFile)}
                        <span className="text-muted-foreground">{selectedFile}</span>
                        {isLoading && (
                          <span className="ml-auto flex items-center gap-1.5 text-muted-foreground">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            writing...
                          </span>
                        )}
                      </div>
                      <pre className="flex-1 overflow-auto p-4 text-[13px] leading-6 font-mono text-foreground/80">
                        <code>{activeFileContent}</code>
                        <div ref={codeEndRef} />
                      </pre>
                    </>
                  ) : rawOutput ? (
                    <>
                      <div className="h-9 px-4 flex items-center gap-2 border-b border-border bg-muted/20 text-xs shrink-0">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">output</span>
                        {isLoading && (
                          <span className="ml-auto flex items-center gap-1.5 text-muted-foreground">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            generating...
                          </span>
                        )}
                      </div>
                      <pre className="flex-1 overflow-auto p-4 text-[13px] leading-6 font-mono text-foreground/80">
                        <code>{rawOutput}</code>
                        <div ref={codeEndRef} />
                      </pre>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                        <Code className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">no code generated yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">describe your website to get started</p>
                    </div>
                  )}
                </div>
              ) : viewMode === "preview" ? (
                // ─── Preview view ───
                <div className="h-full flex items-center justify-center p-4 bg-muted/20">
                  {previewHtml ? (
                    <div 
                      className={cn(
                        "bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 relative",
                        deviceMode === "mobile" ? "w-[375px] h-full max-h-[667px]" : "w-full h-full"
                      )}
                    >
                      <iframe
                        ref={iframeRef}
                        srcDoc={previewHtml}
                        className="w-full h-full border-0"
                        title="Website Preview"
                        sandbox="allow-scripts allow-same-origin"
                      />
                      {!generationComplete && isLoading && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 px-2.5 py-1.5 rounded-md text-xs backdrop-blur-sm border border-neutral-200 text-neutral-600">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          updating...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      {isLoading ? (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>creating your website...</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">preview will appear here</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // ─── HTML combined view ───
                <div className="h-full flex flex-col bg-background">
                  <div className="h-9 px-4 flex items-center gap-2 border-b border-border bg-muted/20 text-xs shrink-0">
                    <FileText className="w-4 h-4 text-orange-400" />
                    <span className="text-muted-foreground">combined output (HTML + CSS inlined)</span>
                  </div>
                  <pre className="flex-1 overflow-auto p-4 text-[13px] leading-6 font-mono text-foreground/80">
                    <code>{previewHtml || "no output yet"}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
