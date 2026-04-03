import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Code2, Eye, Layers } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Describe your vision in plain English and watch as Lotus AI transforms your words into a fully functional website in seconds.",
  },
  {
    icon: Code2,
    title: "Clean, Production-Ready Code",
    description: "Every website is built with modern best practices — semantic HTML, responsive CSS, and optimized performance out of the box.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your website come to life in real-time. Make changes through conversation and instantly preview the results.",
  },
  {
    icon: Layers,
    title: "Iterate & Refine",
    description: "Not quite right? Simply describe what you want to change. Lotus AI remembers context and refines your design iteratively.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Consider yourself limitless
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lotus AI combines the power of advanced language models with modern web development 
            to bring your ideas to life faster than ever before.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
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
