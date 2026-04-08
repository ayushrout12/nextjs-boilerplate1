import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const blogPosts = [
  {
    title: "the art of vibe coding",
    description: "how conversational ai is reshaping the way we build for the web — and why it feels like magic.",
    date: "apr 2026",
    readTime: "4 min read",
    slug: "/blog/vibe-coding"
  },
  {
    title: "designing with intention",
    description: "the philosophy behind lotus — creating tools that feel like extensions of your imagination.",
    date: "mar 2026",
    readTime: "3 min read",
    slug: "/blog/designing-with-intention"
  },
  {
    title: "from dream to deploy",
    description: "a step-by-step journey of turning a simple idea into a fully functional website in minutes.",
    date: "mar 2026",
    readTime: "5 min read",
    slug: "/blog/dream-to-deploy"
  }
]

export function BlogSection() {
  return (
    <section id="blog" className="py-24 md:py-32 relative overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      
      <div className="container relative">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm text-primary font-light tracking-[0.2em] uppercase">musings</p>
          <h2 className="text-4xl md:text-5xl font-serif font-light tracking-wide">
            from the garden
          </h2>
          <p className="text-lg text-muted-foreground font-light tracking-wide max-w-2xl mx-auto">
            thoughts on creativity, code, and the future of building
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {blogPosts.map((post, i) => (
            <Link href={post.slug} key={i} className="group">
              <Card className="h-full bg-card/50 backdrop-blur-xl border-border/30 hover:border-primary/30 transition-all duration-500 rounded-2xl text-center">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-light tracking-wider">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-primary/40" />
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl font-serif font-normal tracking-wide group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed font-light tracking-wide mb-4">
                    {post.description}
                  </CardDescription>
                  <span className="inline-flex items-center gap-2 text-sm text-primary font-light tracking-wide group-hover:gap-3 transition-all duration-300">
                    read more <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
