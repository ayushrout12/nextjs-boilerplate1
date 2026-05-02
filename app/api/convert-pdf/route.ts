import { NextRequest, NextResponse } from "next/server"
import pptxgen from "pptxgenjs"

export const runtime = "nodejs"
export const maxDuration = 60

// Simple PDF text extraction - works for text-based PDFs
async function extractTextFromPDF(buffer: Buffer): Promise<string[]> {
  const text = buffer.toString("latin1")
  
  // Extract text between stream markers (simplified PDF text extraction)
  const textChunks: string[] = []
  
  // Look for text in PDF streams
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g
  let match
  
  while ((match = streamRegex.exec(text)) !== null) {
    const streamContent = match[1]
    
    // Extract text from Tj and TJ operators (PDF text operators)
    const tjMatches = streamContent.match(/\(([^)]+)\)\s*Tj/g) || []
    const tjArrayMatches = streamContent.match(/\[([^\]]+)\]\s*TJ/g) || []
    
    for (const tj of tjMatches) {
      const extracted = tj.match(/\(([^)]+)\)/)
      if (extracted) {
        textChunks.push(decodeURIComponent(escape(extracted[1])))
      }
    }
    
    for (const tjArray of tjArrayMatches) {
      const parts = tjArray.match(/\(([^)]+)\)/g) || []
      const line = parts.map(p => {
        const m = p.match(/\(([^)]+)\)/)
        return m ? m[1] : ""
      }).join("")
      if (line.trim()) {
        textChunks.push(decodeURIComponent(escape(line)))
      }
    }
  }
  
  // If no text found with stream method, try simple text extraction
  if (textChunks.length === 0) {
    // Extract readable ASCII text sequences
    const readableText = text.match(/[\x20-\x7E]{10,}/g) || []
    return readableText.filter(t => 
      !t.includes("obj") && 
      !t.includes("endobj") && 
      !t.includes("stream") &&
      !t.includes("/Type") &&
      !t.includes("/Font") &&
      t.trim().length > 20
    )
  }
  
  return textChunks
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }

    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    console.log("[v0] Processing PDF:", file.name, "Size:", file.size)

    // Get PDF buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF
    const textChunks = await extractTextFromPDF(buffer)
    console.log("[v0] Extracted text chunks:", textChunks.length)

    // Create presentation
    const pptx = new pptxgen()
    pptx.author = "Lotus"
    pptx.title = file.name.replace(".pdf", "")
    pptx.subject = "Converted from PDF"

    // Add title slide
    const titleSlide = pptx.addSlide()
    titleSlide.addText(file.name.replace(".pdf", ""), {
      x: 0.5,
      y: 2,
      w: 9,
      h: 1.5,
      fontSize: 36,
      bold: true,
      align: "center",
      color: "363636",
    })
    titleSlide.addText("Converted with Lotus", {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 0.5,
      fontSize: 14,
      align: "center",
      color: "666666",
    })

    if (textChunks.length === 0) {
      // Add a slide indicating no text was found
      const infoSlide = pptx.addSlide()
      infoSlide.addText("This PDF appears to be image-based or encrypted.\n\nThe converter works best with text-based PDFs.\n\nFor image PDFs, consider using OCR software first.", {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 3,
        fontSize: 18,
        align: "center",
        color: "666666",
        valign: "middle",
      })
    } else {
      // Add content slides
      const maxCharsPerSlide = 600
      let currentText = ""
      
      for (const chunk of textChunks) {
        if (currentText.length + chunk.length > maxCharsPerSlide) {
          if (currentText.trim()) {
            const slide = pptx.addSlide()
            slide.addText(currentText.trim(), {
              x: 0.5,
              y: 0.5,
              w: 9,
              h: 5,
              fontSize: 14,
              color: "363636",
              valign: "top",
            })
          }
          currentText = chunk
        } else {
          currentText += " " + chunk
        }
      }

      // Add remaining text
      if (currentText.trim()) {
        const slide = pptx.addSlide()
        slide.addText(currentText.trim(), {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 5,
          fontSize: 14,
          color: "363636",
          valign: "top",
        })
      }
    }

    console.log("[v0] Generating PPTX...")
    
    // Generate PPTX file
    const pptxBuffer = await pptx.write({ outputType: "nodebuffer" }) as Buffer

    console.log("[v0] PPTX generated, size:", pptxBuffer.length)

    return new NextResponse(pptxBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${file.name.replace(".pdf", "")}.pptx"`,
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
