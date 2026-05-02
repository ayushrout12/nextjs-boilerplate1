import { NextRequest, NextResponse } from "next/server"
import pptxgen from "pptxgenjs"
import { PDFDocument } from "pdf-lib"

export const runtime = "nodejs"
export const maxDuration = 60

// Extract text content from PDF pages using multiple methods
async function extractPDFContent(buffer: Buffer): Promise<{ pages: string[], pageCount: number }> {
  const pages: string[] = []
  
  try {
    // Load PDF to get page count
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })
    const pageCount = pdfDoc.getPageCount()
    
    console.log("[v0] PDF has", pageCount, "pages")
    
    // Convert buffer to string for text extraction
    const pdfString = buffer.toString("latin1")
    
    // Find all page object boundaries
    const pageObjects: { start: number, end: number }[] = []
    const pageRegex = /(\d+)\s+0\s+obj[\s\S]*?\/Type\s*\/Page[^s]/g
    let match
    
    while ((match = pageRegex.exec(pdfString)) !== null) {
      pageObjects.push({ start: match.index, end: match.index + 5000 }) // Approximate page content area
    }
    
    // Extract text from each page region or use stream-based extraction
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g
    const allStreams: string[] = []
    
    while ((match = streamRegex.exec(pdfString)) !== null) {
      const streamContent = match[1]
      const extractedText = extractTextFromStream(streamContent)
      if (extractedText.trim()) {
        allStreams.push(extractedText)
      }
    }
    
    // Distribute extracted text across pages
    if (allStreams.length > 0) {
      const textsPerPage = Math.ceil(allStreams.length / pageCount)
      
      for (let i = 0; i < pageCount; i++) {
        const startIdx = i * textsPerPage
        const endIdx = Math.min(startIdx + textsPerPage, allStreams.length)
        const pageText = allStreams.slice(startIdx, endIdx).join("\n\n")
        pages.push(pageText || `Page ${i + 1}`)
      }
    } else {
      // Fallback: try to extract any readable text and split by page markers
      const readableText = extractReadableText(pdfString)
      
      if (readableText.trim()) {
        // Split text roughly by page count
        const words = readableText.split(/\s+/)
        const wordsPerPage = Math.ceil(words.length / pageCount)
        
        for (let i = 0; i < pageCount; i++) {
          const startIdx = i * wordsPerPage
          const endIdx = Math.min(startIdx + wordsPerPage, words.length)
          const pageText = words.slice(startIdx, endIdx).join(" ")
          pages.push(pageText || `Page ${i + 1}`)
        }
      } else {
        // No text found - create placeholder pages
        for (let i = 0; i < pageCount; i++) {
          pages.push(`[Page ${i + 1} - Image or encrypted content]`)
        }
      }
    }
    
    return { pages, pageCount }
  } catch (error) {
    console.error("[v0] PDF parsing error:", error)
    return { pages: ["Error extracting PDF content"], pageCount: 1 }
  }
}

// Extract text from PDF stream content
function extractTextFromStream(streamContent: string): string {
  const textParts: string[] = []
  
  // Match Tj operator (single string)
  const tjMatches = streamContent.match(/\(([^)]*)\)\s*Tj/g) || []
  for (const tj of tjMatches) {
    const extracted = tj.match(/\(([^)]*)\)/)
    if (extracted && extracted[1]) {
      textParts.push(decodePDFString(extracted[1]))
    }
  }
  
  // Match TJ operator (array of strings)
  const tjArrayMatches = streamContent.match(/\[((?:[^[\]]*|\[[^\]]*\])*)\]\s*TJ/g) || []
  for (const tjArray of tjArrayMatches) {
    const parts = tjArray.match(/\(([^)]*)\)/g) || []
    const line = parts.map(p => {
      const m = p.match(/\(([^)]*)\)/)
      return m ? decodePDFString(m[1]) : ""
    }).join("")
    if (line.trim()) {
      textParts.push(line)
    }
  }
  
  // Match BT...ET text blocks
  const btMatches = streamContent.match(/BT[\s\S]*?ET/g) || []
  for (const bt of btMatches) {
    const innerTj = bt.match(/\(([^)]*)\)\s*Tj/g) || []
    for (const tj of innerTj) {
      const extracted = tj.match(/\(([^)]*)\)/)
      if (extracted && extracted[1] && !textParts.includes(decodePDFString(extracted[1]))) {
        textParts.push(decodePDFString(extracted[1]))
      }
    }
  }
  
  return textParts.join(" ")
}

// Decode PDF string escapes
function decodePDFString(str: string): string {
  return str
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\")
    .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
}

// Extract any readable ASCII text
function extractReadableText(pdfString: string): string {
  // Find sequences of printable ASCII characters
  const matches = pdfString.match(/[\x20-\x7E]{4,}/g) || []
  
  // Filter out PDF syntax
  const filtered = matches.filter(t => 
    !t.includes("obj") && 
    !t.includes("endobj") && 
    !t.includes("stream") &&
    !t.includes("endstream") &&
    !t.includes("/Type") &&
    !t.includes("/Font") &&
    !t.includes("/Page") &&
    !t.includes("/Resources") &&
    !t.includes("/MediaBox") &&
    !t.includes("/Contents") &&
    !t.includes("xref") &&
    !t.includes("trailer") &&
    !t.match(/^\d+\s+\d+\s+R$/) &&
    t.trim().length > 10
  )
  
  return filtered.join(" ")
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf") as File
    const format = formData.get("format") as string || "pptx"

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }

    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    console.log("[v0] Processing PDF:", file.name, "Size:", file.size, "Format:", format)

    // Get PDF buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract content from all pages
    const { pages, pageCount } = await extractPDFContent(buffer)
    console.log("[v0] Extracted", pages.length, "pages from PDF with", pageCount, "total pages")

    // Create presentation
    const pptx = new pptxgen()
    pptx.author = "Lotus"
    pptx.title = file.name.replace(".pdf", "")
    pptx.subject = "Converted from PDF"
    pptx.layout = "LAYOUT_16x9"

    // Add title slide
    const titleSlide = pptx.addSlide()
    titleSlide.addText(file.name.replace(".pdf", ""), {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 1,
      fontSize: 36,
      bold: true,
      align: "center",
      color: "363636",
    })
    titleSlide.addText(`${pageCount} pages | Converted with Lotus`, {
      x: 0.5,
      y: 3.7,
      w: 9,
      h: 0.5,
      fontSize: 14,
      align: "center",
      color: "888888",
    })

    // Add a slide for each page
    for (let i = 0; i < pages.length; i++) {
      const slide = pptx.addSlide()
      
      // Page header
      slide.addText(`Page ${i + 1}`, {
        x: 0.3,
        y: 0.2,
        w: 2,
        h: 0.4,
        fontSize: 10,
        color: "888888",
      })
      
      // Page content
      const pageContent = pages[i] || `[Page ${i + 1}]`
      slide.addText(pageContent, {
        x: 0.5,
        y: 0.7,
        w: 9,
        h: 4.8,
        fontSize: 12,
        color: "363636",
        valign: "top",
        wrap: true,
      })
    }

    console.log("[v0] Generating presentation with", pptx.slides.length, "slides")
    
    // Generate file
    const pptxBuffer = await pptx.write({ outputType: "nodebuffer" }) as Buffer

    console.log("[v0] Presentation generated, size:", pptxBuffer.length)

    // For Keynote format, we still output PPTX since Keynote opens it natively
    // The .key format is proprietary and not easily generated
    const filename = `${file.name.replace(".pdf", "")}.pptx`
    const contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation"

    return new NextResponse(pptxBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("[v0] PDF conversion error:", error)
    return NextResponse.json(
      { error: `Failed to convert PDF: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
