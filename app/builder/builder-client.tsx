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

  useEffect(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant")
    if (assistantMessages.length > 0) {
      const latestMessage = assistantMessages[assistantMessages.length - 1]
      const text = getUIMessageText(latestMessage)
      
      setStreamingCode(text)
      
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

  useEffect(() => {
    if (isLoading) {
      codeEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [streamingCode, isLoading])

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
      {/* chat panel */}
      <div className="w-[400px] flex flex-col border-r border-border/30 bg-muted/20 backdrop-blur-xl">
        {/* chat header */}
        <div className="p-5 border-b border-border/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden lotus-glow-sm">
            <Image 
              src="/lotus-icon.jpg" 
              alt="lotus" 
              width={32} 
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="font-light tracking-wide lowercase">lotus designer</h2>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-sm font-light lowercase">describe what you want to build</p>
              <p className="text-xs mt-3 font-light lowercase opacity-70">lotus will generate a complete website</p>
            </div>
          )}
          
          {messages.map((message) => {
            const text = getUIMessageText(message)
            const isAssistant = message.role === "assistant"
            
            let displayText = text
            if (isAssistant) {
              if (text.includes("```html")) {
                displayText = generationComplete 
                  ? "website generated! check the preview." 
                  : "generating website code..."
              }
            }
            
            return (
              <div
                key={message.id}
                className={cn(
                  "rounded-2xl p-4 text-sm font-light lowercase",
                  isAssistant 
                    ? "bg-muted/50 text-foreground backdrop-blur-sm border border-border/30" 
                    : "bg-primary/90 text-primary-foreground ml-8"
                )}
              >
                {isAssistant ? (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                    <span>{displayText}</span>
                  </div>
                ) : (
                  <span>{displayText}</span>
                )}
              </div>
            )
          })}
          
          {isLoading && messages.filter(m => m.role === "assistant").length === 0 && (
            <div className="flex items-center gap-3 text-muted-foreground text-sm font-light lowercase">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>lotus is designing your website...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* input form */}
        <form onSubmit={handleSubmit} className="p-5 border-t border-border/30">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="describe your website..."
              className="min-h-[100px] pr-14 resize-none rounded-2xl border-border/30 bg-card/50 backdrop-blur-sm font-light lowercase placeholder:lowercase"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute bottom-3 right-3 rounded-xl"
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

      {/* preview panel */}
      <div className="flex-1 flex flex-col">
        {/* preview toolbar */}
        <div className="h-14 border-b border-border/30 flex items-center justify-between px-5 bg-background/50 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "preview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
              disabled={!generationComplete}
              className="rounded-xl font-light lowercase"
            >
              <Eye className="w-4 h-4 mr-2" />
              preview
            </Button>
            <Button
              variant={viewMode === "code" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("code")}
              className="rounded-xl font-light lowercase"
            >
              <Code className="w-4 h-4 mr-2" />
              code
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {viewMode === "preview" && generationComplete && (
              <>
                <Button
                  variant={deviceMode === "desktop" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceMode("desktop")}
                  className="rounded-xl"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={deviceMode === "mobile" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setDeviceMode("mobile")}
                  className="rounded-xl"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={refreshPreview} className="rounded-xl">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </>
            )}
            {previewHtml && (
              <>
                <Button variant="ghost" size="icon" onClick={copyCode} className="rounded-xl">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={downloadHtml} className="rounded-xl">
                  <Download className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* preview content */}
        <div className="flex-1 lotus-gradient flex items-center justify-center p-6 overflow-auto">
          {viewMode === "code" ? (
            <div className="w-full h-full overflow-auto rounded-2xl bg-zinc-950/95 border border-border/30 backdrop-blur-xl lotus-glow-sm">
              {streamingCode || previewHtml ? (
                <div className="relative">
                  {isLoading && (
                    <div className="sticky top-0 z-10 bg-zinc-950/90 border-b border-zinc-800/50 px-5 py-3 flex items-center gap-3 backdrop-blur-xl">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-zinc-400 font-light lowercase">generating code...</span>
                    </div>
                  )}
                  <pre className="text-xs text-zinc-300 p-5 overflow-auto font-mono whitespace-pre-wrap break-all leading-relaxed">
                    <code>{streamingCode || previewHtml}</code>
                    <div ref={codeEndRef} />
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-10">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 opacity-40 animate-float">
                    <Image 
                      src="/lotus-icon.jpg" 
                      alt="lotus" 
                      width={80} 
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-zinc-500 font-light lowercase">waiting for your prompt...</p>
                  <p className="text-zinc-600 text-sm mt-3 font-light lowercase">describe the website you want to create</p>
                </div>
              )}
            </div>
          ) : (
            generationComplete && previewHtml ? (
              <div 
                className={cn(
                  "bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 lotus-glow",
                  deviceMode === "mobile" ? "w-[375px] h-[667px]" : "w-full h-full"
                )}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="website preview"
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden lotus-glow animate-float">
                    <Image 
                      src="/lotus-icon.jpg" 
                      alt="lotus" 
                      width={112} 
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isLoading && (
                    <div className="absolute -inset-3 rounded-[2rem] border-2 border-primary/40 animate-pulse" />
                  )}
                </div>
                
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-3 text-foreground mb-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="font-light lowercase">lotus is designing...</span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md font-light lowercase leading-relaxed">
                      watch the code being generated in real-time. preview will appear when complete.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-light text-foreground mb-3 lowercase">ready to create</p>
                    <p className="text-sm text-muted-foreground max-w-md font-light lowercase leading-relaxed">
                      describe the website you want in the chat panel, and lotus will bring it to life.
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
