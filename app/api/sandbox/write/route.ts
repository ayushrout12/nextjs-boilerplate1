import { writeToSandbox } from "@/lib/e2b/sandbox"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, html } = await request.json()

    if (!sessionId || !html) {
      return NextResponse.json(
        { error: "Session ID and HTML are required" },
        { status: 400 }
      )
    }

    const success = await writeToSandbox(sessionId, html)

    if (!success) {
      return NextResponse.json(
        { error: "Sandbox not found or write failed" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error writing to sandbox:", error)
    return NextResponse.json(
      { error: "Failed to write to sandbox" },
      { status: 500 }
    )
  }
}
