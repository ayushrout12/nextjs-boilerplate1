"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Send, 
  Loader2, 
  Monitor, 
  Smartphone, 
  Code,
  Eye,
  RefreshCw,
  Sparkles
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
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop")
  const [hasInitialized, setHasInitialized] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Auto-send initial prompt from URL
  useEffect(() => {
    if (initialPrompt && !hasInitialized && status === "ready") {
      setHasInitialized(true)
      sendMessage({ text: initialPrompt })
    }
  }, [initialPrompt, hasInitialized, status, sendMessage])

  // Extract HTML from the latest assistant message
  useEffect(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant")
    if (assistantMessages.length > 0) {
      const latestMessage = assistantMessages[assistantMessages.length - 1]
      const text = getUIMessageText(latestMessage)
      const html = extractHtmlFromResponse(text)
      if (html) {
        setPreviewHtml(html)
      }
    }
  }, [messages])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
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

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Chat Panel */}
      <div className="w-[400px] flex flex-col border-r border-border bg-muted/30">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
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
            
            // For assistant messages, show a summary instead of raw HTML
            let displayText = text
            if (isAssistant && text.includes("```html")) {
              displayText = "Generated website code. See the preview panel."
            }
            
            return (
              <div
                key={message.id}
                className={cn(
                  "rounded-lg p-3 text-sm",
                  isAssistant 
                    ? "bg-muted text-foreground" 
                    : "bg-primary text-primary-foreground ml-8"
                )}
              >
                {isAssistant ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{displayText}</span>
                  </div>
                ) : (
                  <span>{displayText}</span>
                )}
              </div>
            )
          })}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating your website...</span>
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
              className="absolute bottom-2 right-2"
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
            {viewMode === "preview" && (
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
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 bg-muted/50 flex items-center justify-center p-4 overflow-auto">
          {previewHtml ? (
            viewMode === "preview" ? (
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
              <div className="w-full h-full overflow-auto">
                <pre className="text-xs text-foreground bg-background p-4 rounded-lg overflow-auto h-full">
                  <code>{previewHtml}</code>
                </pre>
              </div>
            )
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <p className="font-medium">No preview yet</p>
              <p className="text-sm mt-1">Describe what you want to build in the chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
