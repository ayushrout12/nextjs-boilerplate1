import { killSandbox } from "@/lib/e2b/sandbox"
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

    const success = await killSandbox(sessionId)

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error killing sandbox:", error)
    return NextResponse.json(
      { error: "Failed to kill sandbox" },
      { status: 500 }
    )
  }
}
