"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, UIMessage } from "ai"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ChatPanel } from "@/components/builder/chat-panel"
import { PreviewPanel } from "@/components/builder/preview-panel"
import { Moon, Sun, Home, FolderOpen, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function getMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

function extractHtmlFromMessage(text: string): string | null {
  const htmlMatch = text.match(/```html\s*([\s\S]*?)```/)
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1].trim()
  }
  return null
}

export default function BuilderPage() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") || ""
  const { theme, setTheme } = useTheme()
  
  const [input, setInput] = useState("")
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      console.error("[v0] Chat error:", err)
      if (err.message.includes("credit card") || err.message.includes("verification") || err.message.includes("403")) {
        setErrorMessage("AI Gateway requires account verification. Please add a credit card to your Vercel account at vercel.com/account/billing")
      } else {
        setErrorMessage(err.message || "An error occurred while generating. Please try again.")
      }
    }
  })

  // Extract HTML from the latest assistant message
  useEffect(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant")
    if (assistantMessages.length > 0) {
      const lastMessage = assistantMessages[assistantMessages.length - 1]
      const text = getMessageText(lastMessage)
      const html = extractHtmlFromMessage(text)
      if (html) {
        setPreviewHtml(html)
      }
    }
  }, [messages])

  // Handle initial prompt from URL - wait for hook to be ready
  useEffect(() => {
    if (initialPrompt && !hasInitialized && status === "ready" && sendMessage) {
      // Use a small delay to ensure the hook is fully ready
      const timer = setTimeout(() => {
        setHasInitialized(true)
        sendMessage({ text: initialPrompt }).catch((err) => {
          console.error("[v0] Failed to send initial message:", err)
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [initialPrompt, hasInitialized, status, sendMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const messageText = input
      setInput("")
      await sendMessage({ text: messageText })
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="font-bold hidden sm:inline">Lotus AI</span>
          </Link>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <span className="text-sm text-muted-foreground hidden sm:inline">Builder</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/dashboard">
              <FolderOpen className="h-4 w-4" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      {/* Error Alert */}
      {errorMessage && (
        <div className="px-4 py-2 border-b border-border">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{errorMessage}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setErrorMessage(null)}
                className="ml-2"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <ChatPanel
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              status={status}
              error={errorMessage}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={65}>
            <PreviewPanel html={previewHtml} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
