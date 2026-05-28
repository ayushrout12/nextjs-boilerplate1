import { Suspense } from "react"
import BuilderClient from "./builder-client"

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="w-6 h-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
        </div>
      }
    >
      <BuilderClient />
    </Suspense>
  )
}
