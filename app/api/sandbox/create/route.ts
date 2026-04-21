import { createSandbox } from "@/lib/e2b/sandbox"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    if (!process.env.E2B_API_KEY) {
      return NextResponse.json(
        { error: "E2B API key not configured" },
        { status: 500 }
      )
    }

    const { sandboxId, previewUrl } = await createSandbox(sessionId)

    return NextResponse.json({
      success: true,
      sandboxId,
      previewUrl,
    })
  } catch (error) {
    console.error("Error creating sandbox:", error)
    return NextResponse.json(
      { error: "Failed to create sandbox" },
      { status: 500 }
    )
  }
}
