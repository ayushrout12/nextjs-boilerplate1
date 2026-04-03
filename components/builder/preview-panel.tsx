"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Monitor, Tablet, Smartphone, ExternalLink, Code2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface PreviewPanelProps {
  html: string | null
}

type ViewMode = "preview" | "code"
type DeviceSize = "desktop" | "tablet" | "mobile"

const deviceSizes: Record<DeviceSize, string> = {
  desktop: "w-full",
  tablet: "w-[768px]",
  mobile: "w-[375px]",
}

export function PreviewPanel({ html }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preview")
  const [device, setDevice] = useState<DeviceSize>("desktop")

  const handleOpenInNewTab = () => {
    if (html) {
      const blob = new Blob([html], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
    }
  }

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-background">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("preview")}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            variant={viewMode === "code" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("code")}
            className="gap-2"
          >
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Code</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {viewMode === "preview" && (
            <>
              <Button
                variant={device === "desktop" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setDevice("desktop")}
                className="h-8 w-8"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={device === "tablet" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setDevice("tablet")}
                className="h-8 w-8"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={device === "mobile" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setDevice("mobile")}
                className="h-8 w-8"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-border mx-2" />
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenInNewTab}
            disabled={!html}
            className="h-8 w-8"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {!html ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No preview yet</h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Describe your website in the chat panel and the preview will appear here.
              </p>
            </div>
          </div>
        ) : viewMode === "preview" ? (
          <div className="h-full flex justify-center">
            <div className={cn(
              "h-full bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300",
              deviceSizes[device],
              device !== "desktop" && "mx-auto"
            )}>
              <iframe
                srcDoc={html}
                className="w-full h-full border-0"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        ) : (
          <div className="h-full">
            <pre className="bg-card rounded-lg p-4 overflow-auto h-full text-sm">
              <code className="text-foreground">{html}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
