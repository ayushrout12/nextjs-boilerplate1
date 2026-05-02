import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "from dream to deploy | lotus",
  description: "a step by step journey of turning a simple idea into a fully functional website in minutes.",
}

export default function DreamToDeployArticle() {
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
            <span>5 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide">
            from dream to deploy
          </h1>
          <p className="text-lg text-muted-foreground font-light tracking-wide">
            a step by step journey of turning a simple idea into a fully functional website in minutes.
          </p>
        </header>

        {/* content */}
        <div className="prose prose-lg max-w-none font-light tracking-wide text-foreground/90 space-y-6">
          <p>
            let me walk you through what it actually looks like to build a website with lotus. from the first idea to having it live on the internet. the whole process takes about ten minutes. sometimes less.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            step one: the idea
          </h2>

          <p>
            it starts with an idea. maybe you want a portfolio site to show off your photography. maybe you need a landing page for your new side project. maybe you just want a personal website where people can learn about you.
          </p>

          <p>
            you do not need wireframes. you do not need mockups. you do not need a design document. you just need to know roughly what you want.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            step two: describe it
          </h2>

          <p>
            open lotus and start typing. describe your website like you would explain it to a friend. something like "i want a clean portfolio site for my photos. it should have a big hero image at the top, a grid of my work below that, and a contact section at the bottom. keep it minimal with lots of white space."
          </p>

          <p>
            that is it. you do not need to know any technical terms. you do not need to specify fonts or colors unless you want to. just describe the vibe and let lotus figure out the rest.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            step three: watch it appear
          </h2>

          <p>
            this is the fun part. as soon as you hit enter, your website starts appearing in the preview. you can see the hero section forming. the photo grid populating. the contact form taking shape.
          </p>

          <p>
            it usually takes about thirty seconds for the first version to appear. and it is not just a rough sketch. it is a fully functional website with real code behind it.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            step four: refine it
          </h2>

          <p>
            maybe the first version is not exactly what you imagined. no problem. just keep talking to lotus. say something like "make the headline bigger" or "use a darker color scheme" or "add some subtle animations when scrolling."
          </p>

          <p>
            each change appears in the preview instantly. you can go back and forth as many times as you want. tweaking and adjusting until it feels right.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            step five: publish
          </h2>

          <p>
            when you are happy with your site, click publish. choose a url like yourname.lotus.app. and just like that, your website is live on the internet. anyone can visit it. you can share the link on social media or send it to friends.
          </p>

          <p>
            the whole thing probably took you about ten minutes. you went from having nothing to having a real website that people can visit.
          </p>

          <h2 className="text-2xl font-serif font-normal tracking-wide mt-12 mb-4">
            what used to take weeks
          </h2>

          <p>
            think about how long this would have taken the old way. you would need to learn html and css. or figure out a complicated website builder. or hire someone to do it for you. we are talking days or weeks of work. hundreds or thousands of dollars.
          </p>

          <p>
            now it takes ten minutes and a conversation.
          </p>

          <p>
            that is the dream we had when building lotus. make website creation as simple as describing what you want. make the journey from dream to deploy as short as possible.
          </p>

          <p>
            because everyone has ideas worth sharing. the only thing stopping most people is the technical barrier. and now that barrier is basically gone.
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
