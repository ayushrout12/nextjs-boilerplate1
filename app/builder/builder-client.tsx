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
  ChevronRight,
  MessageSquare,
  Sparkles,
  Bot,
  User
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

function parseFiles(text: string, allowPartial: boolean = false): ParsedFile[] {
  const files: ParsedFile[] = []
  const regex = /```(\S+)\n([\s\S]*?)```/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const label = match[1]
    const content = match[2].trim()
    
    if (label.includes(".")) {
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

  if (files.length === 0 && allowPartial) {
    const partialRegex = /```(\S+)\n([\s\S]+)$/
    const partialMatch = text.match(partialRegex)
    if (partialMatch && partialMatch[2].length > 50) {
      const label = partialMatch[1]
      let content = partialMatch[2].trim()
      if (label.includes(".")) {
        const ext = label.split(".").pop() || ""
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

function buildPreviewHtml(files: ParsedFile[]): string | null {
  const indexFile = files.find(f => f.name === "index.html" || f.name.endsWith(".html"))
  if (!indexFile) return null

  let html = indexFile.content
  
  // Inline ALL css files
  const cssFiles = files.filter(f => f.language === "css")
  for (const cssFile of cssFiles) {
    const linkRegex = new RegExp(`<link[^>]*href=["']${cssFile.name.replace(".", "\\.")}["'][^>]*/?>`, "gi")
    if (linkRegex.test(html)) {
      html = html.replace(linkRegex, `<style>\n${cssFile.content}\n</style>`)
    } else {
      html = html.replace("</head>", `<style>\n${cssFile.content}\n</style>\n</head>`)
    }
  }

  // Inline ALL js files
  const jsFiles = files.filter(f => f.language === "js")
  for (const jsFile of jsFiles) {
    const scriptRegex = new RegExp(`<script[^>]*src=["']${jsFile.name.replace(".", "\\.")}["'][^>]*>\\s*</script>`, "gi")
    if (scriptRegex.test(html)) {
      html = html.replace(scriptRegex, `<script>\n${jsFile.content}\n</script>`)
    } else {
      html = html.replace("</body>", `<script>\n${jsFile.content}\n</script>\n</body>`)
    }
  }

  return html
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()
  switch (ext) {
    case "html": return <FileText className="w-4 h-4 text-orange-500" />
    case "css": return <FileCode className="w-4 h-4 text-blue-500" />
    case "js": return <FileCode className="w-4 h-4 text-yellow-500" />
    default: return <FileText className="w-4 h-4 text-muted-foreground" />
  }
}

// Extract conversational text from AI response (text before/between/after code blocks)
function extractConversationText(text: string): string {
  // Remove code blocks and get just the conversational parts
  const withoutCode = text.replace(/```[\s\S]*?```/g, "").trim()
  // Clean up excessive whitespace
  return withoutCode.replace(/\n{3,}/g, "\n\n").trim()
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
  const [viewMode, setViewMode] = useState<"files" | "preview" | "html">("preview")
  const [leftTab, setLeftTab] = useState<"chat" | "files">("chat")
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
  const chatEndRef = useRef<HTMLDivElement>(null)

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
      setViewMode("preview")
      setLeftTab("chat")
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
        
        const preview = buildPreviewHtml(parsed)
        if (preview) {
          setPreviewHtml(preview)
        }
        
        if (status === "ready") {
          setGenerationComplete(true)
          setViewMode("preview")
        }
      }
    }
  }, [messages, status])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Auto-scroll code
  useEffect(() => {
    if (isLoading && viewMode === "files") {
      codeEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [rawOutput, isLoading, viewMode])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setGenerationComplete(false)
    setFiles([])
    setRawOutput("")
    setPreviewHtml(null)
    setViewMode("preview")
    setLeftTab("chat")
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
        <div className="h-12 px-4 flex items-center justify-between border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-6 h-6 rounded-md overflow-hidden ring-1 ring-border">
              <Image src="/lotus-icon.jpg" alt="Lotus" width={24} height={24} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium">Lotus</span>
            
            {currentPrompt && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                  {currentPrompt}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            {previewHtml && (
              <>
                <Button variant="ghost" size="icon" onClick={copyCode} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={downloadAll} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  onClick={() => setPublishModalOpen(true)}
                  className="h-8 px-3 rounded-lg text-xs font-medium bg-foreground text-background hover:bg-foreground/90"
                >
                  <Globe className="w-3.5 h-3.5 mr-1.5" />
                  Publish
                </Button>
                <div className="w-px h-5 bg-border mx-1.5" />
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-lg"
            >
              <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* ─── Main content area ───────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* ─── Left sidebar ─────────────────────────────── */}
          <div className="w-[360px] flex flex-col border-r border-border bg-background shrink-0">
            
            {/* Left tab switcher */}
            <div className="h-10 px-3 flex items-center gap-1 border-b border-border shrink-0">
              <button
                onClick={() => setLeftTab("chat")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                  leftTab === "chat" 
                    ? "bg-muted text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat
              </button>
              <button
                onClick={() => setLeftTab("files")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                  leftTab === "files" 
                    ? "bg-muted text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Files
                {files.length > 0 && (
                  <span className="text-[10px] bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">{files.length}</span>
                )}
              </button>
            </div>

            {leftTab === "chat" ? (
              /* �����── Chat Panel ──────────────────────────── */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  {messages.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Sparkles className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium mb-1">describe your website</p>
                      <p className="text-xs text-muted-foreground mb-6">lotus will design and build it for you</p>
                      <div className="w-full space-y-2">
                        {[
                          "a landing page for a law firm",
                          "portfolio for a photographer",
                          "restaurant with online menu",
                          "SaaS startup landing page"
                        ].map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => { setInput(prompt); inputRef.current?.focus() }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {messages.map((msg, i) => {
                        const text = getUIMessageText(msg)
                        if (!text) return null
                        
                        if (msg.role === "user") {
                          return (
                            <div key={i} className="flex gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                                <User className="w-3.5 h-3.5 text-foreground/70" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-muted-foreground mb-0.5">You</p>
                                <p className="text-sm break-words whitespace-pre-wrap">{text}</p>
                              </div>
                            </div>
                          )
                        }
                        
                        // Assistant message - show only conversational text, never code
                        const conversationText = extractConversationText(text)
                        const fileCount = parseFiles(text, false).length
                        const isComplete = status === "ready"
                        
                        // If there's no conversational text and no files, skip
                        if (!conversationText && fileCount === 0) return null
                        
                        return (
                          <div key={i} className="flex gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Bot className="w-3.5 h-3.5 text-foreground/70" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-muted-foreground mb-0.5">Lotus</p>
                              {conversationText && (
                                <p className="text-sm text-foreground/80 mb-2 leading-relaxed break-words whitespace-pre-wrap">{conversationText}</p>
                              )}
                              {fileCount > 0 && isComplete && (
                                <div className="flex items-center gap-2 mt-1">
                                  <button 
                                    onClick={() => setLeftTab("files")}
                                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-md hover:text-foreground transition-colors"
                                  >
                                    <Code className="w-3 h-3" />
                                    {fileCount} file{fileCount > 1 ? "s" : ""}
                                  </button>
                                  <button
                                    onClick={() => setViewMode("preview")}
                                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-md hover:text-foreground transition-colors"
                                  >
                                    <Eye className="w-3 h-3" />
                                    preview
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                      
                      {isLoading && messages.filter(m => m.role === "assistant").length === 0 && (
                        <div className="flex gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5 text-foreground/70" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground mb-0.5">Lotus</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>working on it...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {error && (
                        <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}
                      
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>

                {/* Chat input */}
                <div className="p-3 border-t border-border">
                  <form onSubmit={handleSubmit}>
                    <div className="relative">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={messages.length > 0 ? "ask for changes..." : "describe your design..."}
                        rows={2}
                        className="w-full px-3 py-2.5 pr-10 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="absolute bottom-2.5 right-2 h-6 w-6 rounded-md bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30"
                      >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* ─── Files Panel ─────────────────────────── */
              <div className="flex-1 overflow-y-auto">
                {files.length > 0 ? (
                  <div className="py-1">
                    {files.map((file) => (
                      <button
                        key={file.name}
                        onClick={() => {
                          setSelectedFile(file.name)
                          setViewMode("files")
                        }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors",
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
                    <FolderOpen className="w-8 h-8 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">no files yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">files will appear here after generation</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── Right panel ──────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab bar */}
            <div className="h-10 px-4 flex items-center justify-between border-b border-border bg-muted/20 shrink-0">
              <div className="flex items-center gap-1">
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
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
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
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                    viewMode === "html" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  HTML
                </button>
              </div>

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
                <div className="h-full flex flex-col bg-background">
                  {activeFileContent ? (
                    <>
                      <div className="h-9 px-4 flex items-center gap-2 border-b border-border bg-muted/10 text-xs shrink-0">
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
                      <div className="h-9 px-4 flex items-center gap-2 border-b border-border bg-muted/10 text-xs shrink-0">
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
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                        <Code className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">no code generated yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">describe your website to get started</p>
                    </div>
                  )}
                </div>
              ) : viewMode === "preview" ? (
                <div className="h-full flex items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-900">
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
                        <p className="text-sm text-muted-foreground">preview will appear here</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col bg-background">
                  <div className="h-9 px-4 flex items-center gap-2 border-b border-border bg-muted/10 text-xs shrink-0">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span className="text-muted-foreground">combined output (HTML + CSS + JS inlined)</span>
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
