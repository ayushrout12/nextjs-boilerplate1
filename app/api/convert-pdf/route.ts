import { NextRequest, NextResponse } from "next/server"
import pptxgen from "pptxgenjs"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Get PDF buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Dynamic import pdf-parse (CommonJS module)
    const pdfParse = (await import("pdf-parse")).default
    
    // Parse PDF
    const pdfData = await pdfParse(buffer)
    
    // Split text into pages/sections
    const pages = pdfData.text
      .split(/\n\s*\n/)
      .filter((section: string) => section.trim().length > 0)
      .map((section: string) => section.trim())

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

    // Add content slides
    const maxCharsPerSlide = 800
    let currentText = ""
    
    for (const page of pages) {
      if (currentText.length + page.length > maxCharsPerSlide) {
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
            breakLine: true,
          })
        }
        currentText = page
      } else {
        currentText += "\n\n" + page
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
        breakLine: true,
      })
    }

    // Generate PPTX file
    const pptxBuffer = await pptx.write({ outputType: "nodebuffer" }) as Buffer

    return new NextResponse(pptxBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${file.name.replace(".pdf", "")}.pptx"`,
      },
    })
  } catch (error) {
    console.error("PDF conversion error:", error)
    return NextResponse.json(
      { error: "Failed to convert PDF. Please try again." },
      { status: 500 }
    )
  }
}
