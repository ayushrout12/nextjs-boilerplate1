import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Designing with Intention | Lotus",
  description: "The philosophy behind lotus — creating tools that feel like extensions of your imagination.",
}

export default function DesigningWithIntentionArticle() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden">
              <Image
                src="/lotus-icon.jpg"
                alt="lotus"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-serif">lotus</span>
          </Link>
          <Link 
            href="/#blog" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-light"
          >
            <ArrowLeft className="w-4 h-4" />
            back to articles
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="pt-32 pb-24">
        <div className="container max-w-3xl">
          {/* Meta */}
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground font-light tracking-wider mb-8">
            <span>mar 2026</span>
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            <span>3 min read</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide text-center mb-8">
            designing with intention
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground font-light tracking-wide text-center mb-16 max-w-2xl mx-auto">
            the philosophy behind lotus — creating tools that feel like extensions of your imagination.
          </p>

          {/* Content */}
          <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none font-light">
            <p className="text-lg leading-relaxed mb-6">
              every tool carries a philosophy. the decisions made by its creators — what to include, what to leave out, how things should feel — shape not just how you use it, but how you think while using it.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              lotus was born from a simple belief: the best creative tools disappear. they don&apos;t demand attention or require constant learning. they simply work, getting out of the way so you can focus on what matters — bringing your ideas to life.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">the invisible interface</h2>

            <p className="text-lg leading-relaxed mb-6">
              we obsess over what we call &quot;the invisible interface&quot; — interactions so natural that you forget you&apos;re using a tool at all. when you describe a layout and it appears exactly as you imagined, there&apos;s no cognitive friction. no mental translation. just flow.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              this doesn&apos;t happen by accident. it requires understanding how people actually think about design — not in pixels and components, but in feelings, relationships, and stories. a hero section isn&apos;t just dimensions and colors. it&apos;s the first impression, the hook, the promise of what&apos;s to come.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">constraints as creativity</h2>

            <p className="text-lg leading-relaxed mb-6">
              we believe in thoughtful constraints. not limitations that frustrate, but guardrails that guide. every design system in lotus is built on principles that make bad outcomes harder and good outcomes natural.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              color palettes that always harmonize. typography scales that maintain rhythm. spacing systems that create visual music without effort. these aren&apos;t rules imposed from outside — they&apos;re patterns absorbed from studying what makes design work.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">intention over automation</h2>

            <p className="text-lg leading-relaxed mb-6">
              automation is easy. intention is hard. we could auto-generate entire websites without any input, but that would miss the point. the magic isn&apos;t in the output — it&apos;s in the collaboration between human intention and machine capability.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              every interaction in lotus is designed to draw out your intention more clearly. not to replace your vision, but to help you articulate it. not to think for you, but to think with you.
            </p>

            <p className="text-lg leading-relaxed mb-6 text-primary/80 italic">
              design with intention. build with purpose. create what only you can imagine.
            </p>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30">
        <div className="container text-center">
          <Link 
            href="/#blog" 
            className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-light"
          >
            <ArrowLeft className="w-4 h-4" />
            back to all articles
          </Link>
        </div>
      </footer>
    </main>
  )
}
