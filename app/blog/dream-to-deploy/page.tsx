import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "From Dream to Deploy | Lotus",
  description: "A step-by-step journey of turning a simple idea into a fully functional website in minutes.",
}

export default function DreamToDeployArticle() {
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
            <span>5 min read</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide text-center mb-8">
            from dream to deploy
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground font-light tracking-wide text-center mb-16 max-w-2xl mx-auto">
            a step-by-step journey of turning a simple idea into a fully functional website in minutes.
          </p>

          {/* Content */}
          <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none font-light">
            <p className="text-lg leading-relaxed mb-6">
              let me tell you about maya. she had an idea for a pottery studio website — warm, earthy, inviting. something that felt like the experience of holding clay in your hands. she had the vision. she didn&apos;t have six months to learn web development.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              this is her story, and the story of thousands like her who are discovering that the distance between dream and deploy has never been shorter.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">minute one: the vision</h2>

            <p className="text-lg leading-relaxed mb-6">
              maya opened lotus and simply described what she wanted: &quot;a website for my pottery studio. warm terracotta colors, lots of white space, images of hands working clay. it should feel peaceful and handcrafted, not corporate or slick.&quot;
            </p>

            <p className="text-lg leading-relaxed mb-6">
              within seconds, lotus had generated a starting point — not a generic template, but something that actually captured the feeling she described. soft earth tones. organic shapes. typography that felt human.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">minutes two through five: the conversation</h2>

            <p className="text-lg leading-relaxed mb-6">
              the first version was close, but not quite right. maya wanted the header to feel more grounded, the pottery gallery to have a more organic layout. she said so, in plain language, and watched as lotus refined each element.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              &quot;make the gallery feel like stones arranged in a zen garden.&quot; lotus understood. the rigid grid softened into something more natural, images clustering in ways that felt intentional but not forced.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              &quot;add a section about my process, but make it feel like a journey.&quot; a timeline appeared, but not a corporate milestone chart — something that flowed like water, each stage of creation leading naturally to the next.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">minutes six through ten: the details</h2>

            <p className="text-lg leading-relaxed mb-6">
              maya added her own photos. she refined the copy, letting lotus suggest alternatives when her words felt clunky. she experimented with different layouts for her workshop schedule, settling on something that felt approachable rather than rigid.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              the contact form needed to feel warm, not formal. she described what she wanted: &quot;like leaving a note for a friend.&quot; lotus created something with softer labels, more inviting placeholder text, a submit button that said &quot;reach out&quot; instead of &quot;submit.&quot;
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">minute eleven: deploy</h2>

            <p className="text-lg leading-relaxed mb-6">
              with a single click, maya&apos;s pottery studio had a home on the internet. not a staging environment or a preview link — a real, live website that her customers could visit, her friends could share, her dream made tangible.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              eleven minutes. from &quot;i have an idea&quot; to &quot;here&apos;s the link.&quot; no code written. no tutorials watched. no compromises between vision and capability.
            </p>

            <h2 className="text-2xl font-serif font-normal mt-12 mb-6">the new creative timeline</h2>

            <p className="text-lg leading-relaxed mb-6">
              maya&apos;s story isn&apos;t exceptional anymore. it&apos;s becoming normal. entrepreneurs launching in hours instead of months. artists sharing their work without waiting for a web developer. ideas that would have stayed ideas finally finding their way into the world.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              the tools have changed. the timelines have compressed. but the most important thing hasn&apos;t changed at all: the human imagination that dreams up what should exist, and the satisfaction of making it real.
            </p>

            <p className="text-lg leading-relaxed mb-6 text-primary/80 italic">
              your dream is eleven minutes away. what will you build?
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
