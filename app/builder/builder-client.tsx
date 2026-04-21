"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
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
  Sparkles,
  Copy,
  Check,
  Download,
  AlertCircle,
  Globe,
  MessageSquare,
  Wand2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PublishModal } from "@/components/publish-modal"

function getUIMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
}

function extractHtmlFromResponse(text: string, allowPartial: boolean = false): string | null {
  const htmlMatch = text.match(/```html\s*([\s\S]*?)```/)
  if (htmlMatch) {
    return htmlMatch[1].trim()
  }
  
  if (allowPartial) {
    const partialMatch = text.match(/```html\s*([\s\S]*)$/)
    if (partialMatch && partialMatch[1].length > 100) {
      let partial = partialMatch[1].trim()
      if (!partial.includes("</body>")) partial += "</body>"
      if (!partial.includes("</html>")) partial += "</html>"
      return partial
    }
  }
  
  if (text.includes("<!DOCTYPE html>") || text.includes("<html")) {
    const startIndex = text.indexOf("<!DOCTYPE html>") !== -1 
      ? text.indexOf("<!DOCTYPE html>") 
      : text.indexOf("<html")
    const endIndex = text.lastIndexOf("</html>")
    if (endIndex !== -1) {
      return text.slice(startIndex, endIndex + 7)
    }
    
    if (allowPartial && text.includes("<body")) {
      let partial = text.slice(startIndex)
      if (!partial.includes("</body>")) partial += "</body>"
      if (!partial.includes("</html>")) partial += "</html>"
      return partial
    }
  }
  
  return null
}

export default function BuilderClient() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") || ""
  
  const [input, setInput] = useState("")
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [streamingCode, setStreamingCode] = useState<string>("")
  const [viewMode, setViewMode] = useState<"preview" | "code">("code")
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop")
  const [hasInitialized, setHasInitialized] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [publishModalOpen, setPublishModalOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (initialPrompt && !hasInitialized && status === "ready") {
      setHasInitialized(true)
      setGenerationComplete(false)
      setStreamingCode("")
      setPreviewHtml(null)
      setError(null)
      setCurrentPrompt(initialPrompt)
      sendMessage({ text: initialPrompt })
    }
  }, [initialPrompt, hasInitialized, status, sendMessage])

  useEffect(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant")
    
    if (assistantMessages.length > 0) {
      const latestMessage = assistantMessages[assistantMessages.length - 1]
      const text = getUIMessageText(latestMessage)
      
      setStreamingCode(text)
      
      const isStreaming = status === "streaming"
      const html = extractHtmlFromResponse(text, isStreaming)
      
      if (html) {
        setPreviewHtml(html)
        
        if (!previewHtml && viewMode === "code") {
          setViewMode("preview")
        }
        
        if (status === "ready") {
          setGenerationComplete(true)
        }
      }
    }
  }, [messages, status, previewHtml, viewMode])

  useEffect(() => {
    if (isLoading) {
      codeEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [streamingCode, isLoading])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setGenerationComplete(false)
    setStreamingCode("")
    setViewMode("code")
    setError(null)
    setCurrentPrompt(input.trim())
    sendMessage({ text: input.trim() })
    setInput("")
  }

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
    if (previewHtml) {
      await navigator.clipboard.writeText(previewHtml)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadHtml = () => {
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

  return (
    <>
      <PublishModal
        open={publishModalOpen}
        onOpenChange={setPublishModalOpen}
        htmlContent={previewHtml || ""}
        title={currentPrompt ? currentPrompt.slice(0, 50) : "Untitled Website"}
      />
      
      <div className="flex h-screen bg-zinc-950">
        {/* Left Panel - Chat */}
        <div className="w-[420px] flex flex-col border-r border-zinc-800/50 bg-zinc-950">
          {/* Header */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-zinc-800/50">
            <div className="w-8 h-8 rounded-xl overflow-hidden ring-2 ring-rose-500/20">
              <Image 
                src="/lotus-icon.jpg" 
                alt="Lotus" 
                width={32} 
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm font-medium text-white">Lotus</h1>
              <p className="text-xs text-zinc-500">AI Website Builder</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 && !isLoading && !error ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center mb-6">
                  <Wand2 className="w-8 h-8 text-rose-400" />
                </div>
                <h2 className="text-lg font-medium text-white mb-2">Create your website</h2>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px]">
                  Describe what you want to build and Lotus will generate a complete, production-ready website.
                </p>
                
                {/* Example prompts */}
                <div className="mt-8 space-y-2 w-full">
                  <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">Try these</p>
                  {[
                    "A modern SaaS landing page",
                    "Portfolio for a designer",
                    "Restaurant website with menu"
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setInput(prompt)
                        inputRef.current?.focus()
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 text-sm text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300 hover:border-zinc-700/50 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {error && (
                  <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-300">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {messages.map((message) => {
                  const text = getUIMessageText(message)
                  const isAssistant = message.role === "assistant"
                  
                  let displayText = text
                  if (isAssistant) {
                    if (text.includes("```html")) {
                      displayText = generationComplete 
                        ? "Your website is ready! Check the preview." 
                        : "Building your website..."
                    }
                  }
                  
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "rounded-xl p-4 text-sm",
                        isAssistant 
                          ? "bg-zinc-900/50 border border-zinc-800/50" 
                          : "bg-gradient-to-r from-rose-500/90 to-orange-500/90 text-white ml-8"
                      )}
                    >
                      {isAssistant ? (
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                          </div>
                          <span className="text-zinc-300 leading-relaxed">{displayText}</span>
                        </div>
                      ) : (
                        <span className="leading-relaxed">{displayText}</span>
                      )}
                    </div>
                  )
                })}
                
                {isLoading && messages.filter(m => m.role === "assistant").length === 0 && (
                  <div className="flex items-center gap-3 text-sm text-zinc-500 px-2">
                    <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    <span>Generating your website...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-800/50">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your website..."
                  rows={3}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 resize-none transition-all"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-zinc-900/50">
          {/* Toolbar */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("preview")}
                disabled={!previewHtml}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-all",
                  viewMode === "preview" 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                )}
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Preview
                {previewHtml && !generationComplete && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("code")}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs font-medium transition-all",
                  viewMode === "code" 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                )}
              >
                <Code className="w-3.5 h-3.5 mr-1.5" />
                Code
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              {viewMode === "preview" && previewHtml && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeviceMode("desktop")}
                    className={cn(
                      "h-8 w-8 rounded-lg transition-all",
                      deviceMode === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeviceMode("mobile")}
                    className={cn(
                      "h-8 w-8 rounded-lg transition-all",
                      deviceMode === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-5 bg-zinc-800 mx-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={refreshPreview}
                    className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {previewHtml && (
                <>
                  <div className="w-px h-5 bg-zinc-800 mx-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyCode}
                    className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-300"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={downloadHtml}
                    className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-300"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-5 bg-zinc-800 mx-1" />
                  <Button 
                    onClick={() => setPublishModalOpen(true)}
                    className="h-8 px-4 rounded-lg text-xs font-medium bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  >
                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                    Publish
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            {viewMode === "code" ? (
              <div className="w-full h-full rounded-xl bg-zinc-950 border border-zinc-800/50 overflow-hidden">
                {streamingCode || previewHtml ? (
                  <div className="relative h-full">
                    {isLoading && (
                      <div className="sticky top-0 z-10 px-4 py-2.5 flex items-center gap-2 bg-zinc-950/95 border-b border-zinc-800/50 backdrop-blur-sm">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                        <span className="text-xs text-zinc-500">Generating code...</span>
                      </div>
                    )}
                    <pre className="h-full overflow-auto p-4 text-xs text-zinc-400 font-mono leading-relaxed">
                      <code>{streamingCode || previewHtml}</code>
                      <div ref={codeEndRef} />
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-4">
                      <Code className="w-6 h-6 text-zinc-600" />
                    </div>
                    <p className="text-sm text-zinc-600">No code generated yet</p>
                    <p className="text-xs text-zinc-700 mt-1">Describe your website to get started</p>
                  </div>
                )}
              </div>
            ) : (
              previewHtml ? (
                <div 
                  className={cn(
                    "bg-white rounded-xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 relative",
                    deviceMode === "mobile" ? "w-[375px] h-[667px]" : "w-full h-full"
                  )}
                >
                  <iframe
                    ref={iframeRef}
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    title="Website Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  {!generationComplete && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-zinc-900/90 text-white px-3 py-2 rounded-lg text-xs backdrop-blur-sm border border-zinc-800">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                      <span>Updating preview...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-rose-500/20">
                      <Image 
                        src="/lotus-icon.jpg" 
                        alt="Lotus" 
                        width={96} 
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isLoading && (
                      <div className="absolute -inset-4 rounded-3xl border-2 border-rose-500/30 animate-pulse" />
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="flex items-center gap-3 text-white">
                      <Loader2 className="w-5 h-5 animate-spin text-rose-400" />
                      <span className="text-sm font-medium">Creating your website...</span>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-white mb-2">Preview Area</h3>
                      <p className="text-sm text-zinc-500">Your website will appear here</p>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
