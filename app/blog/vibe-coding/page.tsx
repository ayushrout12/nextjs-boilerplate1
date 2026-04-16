import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "The Art of Vibe Coding | Lotus",
  description: "How conversational AI is reshaping the way we build for the web — and why it feels like magic.",
}

export default function VibeCodingArticle() {
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
            <span>apr 2026</span>
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            <span>4 min read</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide text-center mb-8">
            the art of vibe coding
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground font-light tracking-wide text-center mb-16 max-w-2xl mx-auto">
            how conversational ai is reshaping the way we build for the web — and why it feels like magic.
          </p>

          {/* Content */}
          <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none font-light">
            <p className="text-lg leading-relaxed mb-6">
              there&apos;s a moment every creator knows — that spark when an idea first takes shape in your mind. it&apos;s vivid, alive, full of possibility. but then comes the gap: the distance between what you can imagine and what you can actually build.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              for decades, that gap was filled with learning curves, syntax errors, and endless documentation. the vision in your head had to survive translation through frameworks, languages, and tools that were never designed for the way humans naturally think.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">the conversation begins</h2>

            <p className="text-lg leading-relaxed mb-6">
              vibe coding changes everything. instead of writing code, you describe what you want. instead of debugging syntax, you refine your vision through conversation. it&apos;s not about becoming a better programmer — it&apos;s about becoming a better communicator with machines that finally understand context, nuance, and intent.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              when you tell lotus &quot;i want a hero section that feels like morning light filtering through leaves,&quot; it doesn&apos;t just parse keywords. it understands the feeling you&apos;re reaching for. it translates emotion into color palettes, typography choices, and subtle animations that breathe.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">beyond autocomplete</h2>

            <p className="text-lg leading-relaxed mb-6">
              this isn&apos;t about ai writing code faster. it&apos;s about ai understanding what you&apos;re trying to create and collaborating with you to make it real. the best vibe coding sessions feel less like programming and more like having a conversation with a talented designer who happens to think in react components.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              you describe, it builds. you refine, it adapts. you dream, it deploys. the technical complexity doesn&apos;t disappear — it just moves behind the curtain, handled by systems that have absorbed millions of patterns and best practices.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">the magic is real</h2>

            <p className="text-lg leading-relaxed mb-6">
              we call it magic because that&apos;s how it feels. but underneath, it&apos;s something more profound: a fundamental shift in who gets to create for the web. ideas that once required teams and months can now be explored in minutes. concepts that lived only in imagination can take form and be shared with the world.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              this is the art of vibe coding — not replacing human creativity, but amplifying it. not eliminating the need for skill, but redefining what skills matter. the future belongs to those who can articulate their vision clearly, iterate fearlessly, and embrace the conversation between human imagination and machine capability.
            </p>

            <p className="text-lg leading-relaxed mb-6 text-primary/80 italic">
              welcome to the garden. let&apos;s build something beautiful together.
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
