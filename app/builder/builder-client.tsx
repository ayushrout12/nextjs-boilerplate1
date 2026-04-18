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
  Download,
  AlertCircle,
  Save,
  Heart,
  Globe
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
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const codeEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      console.log("[v0] Chat error:", err)
      if (err.message?.includes("credit card") || err.message?.includes("billing")) {
        setError("ai gateway requires billing setup. please add a payment method to your vercel account.")
      } else {
        setError(err.message || "an unexpected error occurred")
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

  const saveWebsite = async () => {
    if (!previewHtml || saving) return
    
    setSaving(true)
    try {
      const response = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentPrompt ? currentPrompt.slice(0, 50) : "untitled website",
          prompt: currentPrompt,
          html_content: previewHtml,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("please sign in to save your websites")
        } else {
          setError(data.error || "failed to save website")
        }
        return
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError("failed to save website")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
    <PublishModal
      open={publishModalOpen}
      onOpenChange={setPublishModalOpen}
      htmlContent={previewHtml || ""}
      title={currentPrompt ? currentPrompt.slice(0, 50) : "untitled website"}
    />
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* chat panel */}
      <div className="w-[380px] flex flex-col border-r border-border/30 bg-muted/10 backdrop-blur-2xl">
        {/* chat header */}
        <div className="p-5 border-b border-border/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl overflow-hidden lotus-glow-sm animate-petal">
            <Image 
              src="/lotus-icon.jpg" 
              alt="lotus" 
              width={36} 
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="font-serif font-normal tracking-wide">lotus designer</h2>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && !isLoading && !error && (
            <div className="text-center text-muted-foreground py-14">
              <p className="text-sm font-light tracking-wide">whisper what you wish to create</p>
              <p className="text-xs mt-3 font-light tracking-wide opacity-60">lotus will bloom a complete website</p>
            </div>
          )}
          
          {error && (
            <div className="rounded-2xl p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-light tracking-wide">{error}</p>
                  <p className="text-xs mt-2 opacity-70 font-light">please check your vercel account settings</p>
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
                  ? "your website has bloomed. check the preview." 
                  : "weaving your website..."
              }
            }
            
            return (
              <div
                key={message.id}
                className={cn(
                  "rounded-2xl p-4 text-sm font-light tracking-wide",
                  isAssistant 
                    ? "bg-card/60 text-foreground backdrop-blur-xl border border-border/30" 
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
            <div className="flex items-center gap-3 text-muted-foreground text-sm font-light tracking-wide">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>lotus is crafting your vision...</span>
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
              className="min-h-[100px] pr-14 resize-none rounded-2xl border-border/30 bg-card/50 backdrop-blur-xl font-light tracking-wide placeholder:opacity-50"
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
        {/* toolbar */}
        <div className="h-14 border-b border-border/30 flex items-center justify-between px-5 bg-background/50 backdrop-blur-2xl">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "preview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
              disabled={!generationComplete}
              className="rounded-xl font-light tracking-wide"
            >
              <Eye className="w-4 h-4 mr-2" />
              preview
            </Button>
            <Button
              variant={viewMode === "code" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("code")}
              className="rounded-xl font-light tracking-wide"
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={saveWebsite} 
                  disabled={saving || saved}
                  className="rounded-xl font-light tracking-wide"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : saved ? (
                    <Heart className="w-4 h-4 mr-2 text-primary fill-primary" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saved ? "saved" : "save"}
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => setPublishModalOpen(true)}
                  className="rounded-xl font-light tracking-wide bg-primary hover:bg-primary/90"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  publish
                </Button>
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

        {/* content */}
        <div className="flex-1 lotus-gradient flex items-center justify-center p-6 overflow-auto">
          {viewMode === "code" ? (
            <div className="w-full h-full overflow-auto rounded-2xl bg-zinc-950/95 border border-border/30 backdrop-blur-2xl lotus-glow-sm">
              {streamingCode || previewHtml ? (
                <div className="relative">
                  {isLoading && (
                    <div className="sticky top-0 z-10 bg-zinc-950/90 border-b border-zinc-800/50 px-5 py-3 flex items-center gap-3 backdrop-blur-xl">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-zinc-400 font-light tracking-wide">weaving code...</span>
                    </div>
                  )}
                  <pre className="text-xs text-zinc-300 p-5 overflow-auto font-mono whitespace-pre-wrap break-all leading-relaxed">
                    <code>{streamingCode || previewHtml}</code>
                    <div ref={codeEndRef} />
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-10">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 opacity-30 animate-float">
                    <Image 
                      src="/lotus-icon.jpg" 
                      alt="lotus" 
                      width={80} 
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-zinc-500 font-light tracking-wide">awaiting your vision...</p>
                  <p className="text-zinc-600 text-sm mt-3 font-light tracking-wide">describe the website you dream of</p>
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
                <div className="relative mb-10">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden lotus-glow animate-float">
                    <Image 
                      src="/lotus-icon.jpg" 
                      alt="lotus" 
                      width={128} 
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isLoading && (
                    <div className="absolute -inset-4 rounded-[2rem] border-2 border-primary/30 animate-pulse" />
                  )}
                </div>
                
                {isLoading ? (
                  <>
                    <div className="flex items-center gap-3 text-foreground mb-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="font-serif font-normal tracking-wide">lotus is crafting...</span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md font-light tracking-wide leading-relaxed">
                      watch the code bloom in real-time. your preview will appear when complete.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-serif font-normal text-foreground mb-4 tracking-wide">ready to create</p>
                    <p className="text-sm text-muted-foreground max-w-md font-light tracking-wide leading-relaxed">
                      whisper your vision in the chat panel, and lotus will bring it to life.
                    </p>
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
