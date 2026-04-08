import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Code2, Eye, Layers } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "instant creation",
    description: "describe your vision in natural words and watch as lotus transforms them into a beautiful website in moments.",
  },
  {
    icon: Code2,
    title: "elegant, clean code",
    description: "every website blooms with modern best practices — semantic html, responsive design, and graceful performance.",
  },
  {
    icon: Eye,
    title: "live preview",
    description: "see your website unfold in real-time. make changes through gentle conversation and witness the transformation.",
  },
  {
    icon: Layers,
    title: "refine & evolve",
    description: "not quite perfect? simply describe your wishes. lotus remembers and refines your creation with care.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 md:py-36 lotus-gradient">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-serif font-normal tracking-wide sm:text-4xl md:text-5xl mb-6">
            boundless possibilities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            lotus combines the wisdom of advanced ai with the art of web design
            to bring your dreams to life, gently and beautifully.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/30 hover:border-primary/30 transition-all duration-500 rounded-2xl group text-center">
              <CardHeader className="items-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-serif font-normal tracking-wide">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed font-light tracking-wide">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
