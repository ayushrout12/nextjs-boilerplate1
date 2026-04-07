"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

function getUIMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
}

function extractHtmlFromResponse(text: string): string | null {
  const htmlMatch = text.match(/```html\s*([\s\S]*?)```/)
  if (htmlMatch) {
    return htmlMatch[1].trim()
  }
  
  if (text.includes("<!DOCTYPE html>") || text.includes("<html")) {
    const startIndex = text.indexOf("<!DOCTYPE html>") !== -1 
      ? text.indexOf("<!DOCTYPE html>") 
      : text.indexOf("<html")
    const endIndex = text.lastIndexOf("</html>")
    if (endIndex !== -1) {
      return text.slice(startIndex, endIndex + 7)
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const codeEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Auto-send initial prompt from URL
  useEffect(() => {
    if (initialPrompt && !hasInitialized && status === "ready") {
      setHasInitialized(true)
      setGenerationComplete(false)
      setStreamingCode("")
      setPreviewHtml(null)
      sendMessage({ text: initialPrompt })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, hasInitialized, status])

  // Track streaming code and extract HTML
  useEffect(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant")
    if (assistantMessages.length > 0) {
      const latestMessage = assistantMessages[assistantMessages.length - 1]
      const text = getUIMessageText(latestMessage)
      
      // Show streaming code
      setStreamingCode(text)
      
      // Only extract and set preview HTML when streaming is complete
      if (status === "ready" && text) {
        const html = extractHtmlFromResponse(text)
        if (html) {
          setPreviewHtml(html)
          setGenerationComplete(true)
          setViewMode("preview")
        }
      }
    }
  }, [messages, status])

  // Auto-scroll code view
  useEffect(() => {
    if (isLoading) {
      codeEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [streamingCode, isLoading])

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setGenerationComplete(false)
    setStreamingCode("")
    setViewMode("code")
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
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Chat Panel */}
      <div className="w-[380px] flex flex-col border-r border-border bg-muted/30">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <h2 className="font-semibold">Lotus Designer</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">Describe what you want to build</p>
              <p className="text-xs mt-2">Lotus will generate a complete website</p>
            </div>
          )}
          
          {messages.map((message) => {
            const text = getUIMessageText(message)
            const isAssistant = message.role === "assistant"
            
            let displayText = text
            if (isAssistant) {
              if (text.includes("```html")) {
                displayText = generationComplete 
                  ? "Website generated! Check the preview." 
                  : "Generating website code..."
              }
            }
            
            return (
              <div
                key={message.id}
                className={cn(
                  "rounded-lg p-3 text-sm",
                  isAssistant 
                    ? "bg-muted text-foreground" 
                    : "bg-gradient-to-r from-pink-500 to-rose-500 text-white ml-8"
                )}
              >
                {isAssistant ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-pink-500" />
                    <span>{displayText}</span>
                  </div>
                ) : (
                  <span>{displayText}</span>
                )}
              </div>
            )
          })}
          
          {isLoading && messages.filter(m => m.role === "assistant").length === 0 && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
              <span>Lotus is designing your website...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your website..."
              className="min-h-[80px] pr-12 resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute bottom-2 right-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
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

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col">
        {/* Preview Toolbar */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "preview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
              disabled={!generationComplete}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              variant={viewMode === "code" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("code")}
            >
              <Code className="w-4 h-4 mr-1" />
              Code
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {viewMode === "preview" && generationComplete && (
              <>
                <Button
                  variant={deviceMode === "desktop" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceMode("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={deviceMode === "mobile" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceMode("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={refreshPreview}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </>
            )}
            {previewHtml && (
              <>
                <Button variant="ghost" size="icon" onClick={copyCode}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={downloadHtml}>
                  <Download className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 bg-muted/50 flex items-center justify-center p-4 overflow-auto">
          {viewMode === "code" ? (
            // Code View - Shows streaming code or final code
            <div className="w-full h-full overflow-auto rounded-lg bg-zinc-950 border border-border">
              {streamingCode || previewHtml ? (
                <div className="relative">
                  {isLoading && (
                    <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                      <span className="text-sm text-zinc-400">Generating code...</span>
                    </div>
                  )}
                  <pre className="text-xs text-zinc-300 p-4 overflow-auto font-mono whitespace-pre-wrap break-all">
                    <code>{streamingCode || previewHtml}</code>
                    <div ref={codeEndRef} />
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 opacity-50">
                    <Image 
                      src="/lotus-icon.jpg" 
                      alt="Lotus" 
                      width={80} 
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-zinc-500 font-medium">Waiting for your prompt...</p>
                  <p className="text-zinc-600 text-sm mt-2">Describe the website you want to create</p>
                </div>
              )}
            </div>
          ) : (
            // Preview View
            generationComplete && previewHtml ? (
              <div 
                className={cn(
                  "bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300",
                  deviceMode === "mobile" ? "w-[375px] h-[667px]" : "w-full h-full"
                )}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Website Preview"
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              // Standby Page
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden">
                    <Image 
                      src="/lotus-icon.jpg" 
                      alt="Lotus" 
                      width={96} 
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isLoading && (
                    <div className="absolute -inset-2 rounded-3xl border-2 border-pink-500/50 animate-pulse" />
                  )}
                </div>
                
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-2 text-foreground mb-2">
                      <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
                      <span className="font-medium">Lotus is designing...</span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Watch the code being generated in real-time. Preview will appear when complete.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-foreground mb-2">Ready to create</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Describe the website you want in the chat panel, and Lotus will bring it to life.
                    </p>
                  </>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
