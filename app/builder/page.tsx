import { Suspense } from "react"
import BuilderClient from "./builder-client"

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
          Loading Builder...
        </div>
      }
    >
      <BuilderClient />
    </Suspense>
  )
}
