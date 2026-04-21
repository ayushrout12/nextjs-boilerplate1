import { Sandbox } from "e2b"

// Store active sandboxes in memory (in production, use Redis/database)
const activeSandboxes = new Map<string, Sandbox>()

export async function createSandbox(sessionId: string): Promise<{
  sandboxId: string
  previewUrl: string
}> {
  // Create a new sandbox with base template
  const sandbox = await Sandbox.create("base", {
    timeoutMs: 10 * 60 * 1000, // 10 minutes timeout
    apiKey: process.env.E2B_API_KEY,
  })

  // Store sandbox reference
  activeSandboxes.set(sessionId, sandbox)

  // Create the basic project structure
  await sandbox.files.write("/home/user/project/index.html", `
<!DOCTYPE html>
<html>
<head>
  <title>Loading...</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex items-center justify-center min-h-screen bg-slate-950">
  <div class="text-center">
    <div class="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
    <p class="text-slate-400">Generating your website...</p>
  </div>
</body>
</html>
`)

  // Start a simple HTTP server
  await sandbox.commands.run("cd /home/user/project && npx -y serve -l 3000", {
    background: true,
  })

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Get the preview URL
  const host = sandbox.getHost(3000)
  const previewUrl = `https://${host}`

  return {
    sandboxId: sandbox.id,
    previewUrl,
  }
}

export async function getSandbox(sessionId: string): Promise<Sandbox | null> {
  return activeSandboxes.get(sessionId) || null
}

export async function writeToSandbox(
  sessionId: string,
  html: string
): Promise<boolean> {
  const sandbox = activeSandboxes.get(sessionId)
  if (!sandbox) return false

  try {
    await sandbox.files.write("/home/user/project/index.html", html)
    return true
  } catch (error) {
    console.error("Error writing to sandbox:", error)
    return false
  }
}

export async function getPreviewUrl(sessionId: string): Promise<string | null> {
  const sandbox = activeSandboxes.get(sessionId)
  if (!sandbox) return null

  try {
    const host = sandbox.getHost(3000)
    return `https://${host}`
  } catch (error) {
    console.error("Error getting preview URL:", error)
    return null
  }
}

export async function killSandbox(sessionId: string): Promise<boolean> {
  const sandbox = activeSandboxes.get(sessionId)
  if (!sandbox) return false

  try {
    await sandbox.kill()
    activeSandboxes.delete(sessionId)
    return true
  } catch (error) {
    console.error("Error killing sandbox:", error)
    return false
  }
}

export async function getCodeFromSandbox(sessionId: string): Promise<string | null> {
  const sandbox = activeSandboxes.get(sessionId)
  if (!sandbox) return null

  try {
    const content = await sandbox.files.read("/home/user/project/index.html")
    return content
  } catch (error) {
    console.error("Error reading from sandbox:", error)
    return null
  }
}
