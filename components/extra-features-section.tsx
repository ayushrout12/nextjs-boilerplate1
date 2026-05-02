"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileUp, Presentation, Loader2, Download, CheckCircle, AlertCircle } from "lucide-react"

type OutputFormat = "pptx" | "keynote"

export function ExtraFeaturesSection() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<OutputFormat>("pptx")
  const [isConverting, setIsConverting] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file")
        return
      }
      setFile(selectedFile)
      setError(null)
      setDownloadUrl(null)
    }
  }

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("pdf", file)
      formData.append("format", format)

      const response = await fetch("/api/convert-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Conversion failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed")
    } finally {
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a")
      link.href = downloadUrl
      const suffix = format === "keynote" ? "_keynote" : "_presentation"
      link.download = `${file?.name.replace(".pdf", "")}${suffix}.pptx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const resetConverter = () => {
    setFile(null)
    setDownloadUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <section id="extra-features" className="py-24 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-4">
            Extra Dev Functionalities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to boost your productivity beyond website creation.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Presentation className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold">PDF to Keynote Converter</CardTitle>
              <CardDescription className="text-base mt-2 max-w-md mx-auto">
                Upload any PDF file and convert it into a presentation. Each page of your PDF becomes a slide. 
                Perfect for turning documents, reports, or designs into presentation slides.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Format Selection */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setFormat("pptx")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    format === "pptx"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  PowerPoint (.pptx)
                </button>
                <button
                  onClick={() => setFormat("keynote")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    format === "keynote"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Keynote (.pptx)
                </button>
              </div>
              
              {format === "keynote" && (
                <p className="text-xs text-muted-foreground text-center">
                  Outputs .pptx format which Keynote opens and edits natively
                </p>
              )}

              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${file 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FileUp className="h-10 w-10 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Click to upload PDF</p>
                      <p className="text-sm text-muted-foreground">or drag and drop</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!downloadUrl ? (
                  <Button
                    onClick={handleConvert}
                    disabled={!file || isConverting}
                    className="flex-1 h-12 rounded-xl"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Presentation className="h-4 w-4 mr-2" />
                        Convert to Presentation
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleDownload}
                      className="flex-1 h-12 rounded-xl"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download {format === "keynote" ? "for Keynote" : ".pptx"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetConverter}
                      className="h-12 rounded-xl"
                    >
                      Convert Another
                    </Button>
                  </>
                )}
              </div>

              {/* Info Note */}
              <p className="text-xs text-muted-foreground text-center">
                The generated .pptx file opens directly in Apple Keynote, Microsoft PowerPoint, or Google Slides.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
