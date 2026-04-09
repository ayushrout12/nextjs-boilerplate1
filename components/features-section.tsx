import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Code2, Eye, Layers } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Creation",
    description: "Describe your vision in natural language and watch as Lotus transforms it into a beautiful website in seconds.",
  },
  {
    icon: Code2,
    title: "Clean Code",
    description: "Every website is built with modern best practices — semantic HTML, responsive design, and optimal performance.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your website come to life in real-time. Make changes through conversation and watch the transformation.",
  },
  {
    icon: Layers,
    title: "Refine & Evolve",
    description: "Not quite right? Simply describe what you'd like to change. Lotus remembers context and refines your creation.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Lotus combines advanced AI with beautiful design to bring your ideas to life.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <Card key={i} className="bg-card border-border/50 rounded-2xl card-hover text-center">
              <CardHeader className="items-center pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
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
