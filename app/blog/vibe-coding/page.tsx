import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "the art of vibe coding | lotus",
  description: "how conversational ai is reshaping the way we build for the web and why it feels like magic.",
}

export default function VibeCodingArticle() {
  return (
    <article className="min-h-screen bg-background">
      <div className="container max-w-3xl py-16 md:py-24">
        {/* back link */}
        <Link 
          href="/#blog" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12 font-light tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          back to garden
        </Link>

        {/* header */}
        <header className="mb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-light tracking-wider">
            <span>apr 2026</span>
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            <span>4 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide">
            the art of vibe coding
          </h1>
          <p className="text-lg text-muted-foreground font-light tracking-wide">
            how conversational ai is reshaping the way we build for the web and why it feels like magic.
          </p>
        </header>

        {/* content */}
        <div className="prose prose-lg max-w-none font-light tracking-wide text-foreground/90 space-y-6">
          <p>
            there is something different about building websites now. it does not feel like the old way anymore. you know what i mean. the hours spent googling error messages. the copy pasting from stack overflow. the frustration of trying to remember css properties you have used a hundred times before.
          </p>

          <p>
            vibe coding changes all of that.
          </p>

          <p>
            instead of fighting with syntax and documentation, you just describe what you want. you say something like "i want a hero section with a gradient background and a big headline that fades in." and then it just happens. the code appears. the design comes to life. it feels like magic but it is actually just a new way of thinking about creation.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            what makes it different
          </h2>

          <p>
            traditional coding is all about precision. you have to know exactly what to type. every semicolon matters. every bracket has to be in the right place. one small mistake and nothing works. it is powerful but it is also kind of exhausting.
          </p>

          <p>
            vibe coding flips that around. instead of you learning to speak the computer's language, the computer learns to understand yours. you describe the vibe you are going for. the mood. the feeling. and the ai figures out how to translate that into actual working code.
          </p>

          <p>
            this is why we call it vibe coding. you are not really coding in the traditional sense. you are communicating a vision. you are describing an experience. you are sharing a vibe.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            why it feels like magic
          </h2>

          <p>
            when you first try vibe coding, it honestly feels unreal. you type a few sentences and suddenly there is a complete website in front of you. buttons that work. animations that flow. responsive layouts that look good on every screen size.
          </p>

          <p>
            the magic is not really magic though. it is the result of ai that has learned from millions of websites and design patterns. it understands what makes a good landing page. it knows how to create smooth hover effects. it has seen every possible layout and can remix them into something new based on your description.
          </p>

          <p>
            you are basically collaborating with an ai that has studied design and development for years. except instead of having to learn everything it knows, you just have to tell it what you want.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            the future is conversational
          </h2>

          <p>
            we are still early in this shift. vibe coding will only get better. the conversations will become more natural. the ai will understand more subtle requests. it will remember your preferences and style choices.
          </p>

          <p>
            but even now, today, you can build something beautiful just by describing it. that is pretty incredible when you think about it. the barrier between imagination and creation has never been lower.
          </p>

          <p>
            so if you have an idea for a website, do not let the technical stuff stop you. just describe the vibe. the rest will follow.
          </p>
        </div>

        {/* footer */}
        <footer className="mt-16 pt-8 border-t border-border/30 text-center">
          <Link 
            href="/#blog" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all font-light tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            back to all articles
          </Link>
        </footer>
      </div>
    </article>
  )
}
