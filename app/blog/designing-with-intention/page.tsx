import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "designing with intention | lotus",
  description: "the philosophy behind lotus and creating tools that feel like extensions of your imagination.",
}

export default function DesigningWithIntentionArticle() {
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
            <span>mar 2026</span>
            <span className="w-1 h-1 rounded-full bg-primary/40" />
            <span>3 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide">
            designing with intention
          </h1>
          <p className="text-lg text-muted-foreground font-light tracking-wide">
            the philosophy behind lotus and creating tools that feel like extensions of your imagination.
          </p>
        </header>

        {/* content */}
        <div className="prose prose-lg max-w-none font-light tracking-wide text-foreground/90 space-y-6">
          <p>
            when i started building lotus, i had one question in mind. what if creating a website felt as natural as describing it to a friend?
          </p>

          <p>
            most design tools are complicated. they have hundreds of buttons and menus and settings. you spend more time learning the tool than actually creating. that always felt backwards to me.
          </p>

          <p>
            lotus was built with a different philosophy. everything should feel intentional. every feature should exist because it helps you create, not because we could add it.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            simplicity is hard
          </h2>

          <p>
            making something simple is actually really difficult. it is easy to add features. it is hard to know what to leave out. every button you add is another thing someone has to learn. every option is another decision someone has to make.
          </p>

          <p>
            with lotus, we wanted to remove decisions, not add them. you should not have to think about padding values or color hex codes or responsive breakpoints. you should just describe what you want and trust that it will look good.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            tools should feel invisible
          </h2>

          <p>
            the best tools are the ones you forget you are using. think about how you write in a notes app. you do not think about the app. you think about what you are writing. the tool gets out of your way.
          </p>

          <p>
            that is what we want lotus to feel like. when you are using it, you should not be thinking "how do i use this builder?" you should be thinking "what do i want my website to look like?"
          </p>

          <p>
            the tool becomes invisible. your creativity becomes the focus.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            intention over options
          </h2>

          <p>
            every design decision in lotus comes from asking one question. does this help someone bring their vision to life? if the answer is no, we do not add it. if the answer is yes, we make it as simple as possible.
          </p>

          <p>
            this is designing with intention. not adding things because we can. adding things because they matter.
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
