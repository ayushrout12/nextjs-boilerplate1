export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Describe Your Vision",
      description: "Tell Lotus AI what you want to build. Be as detailed or as simple as you like — from a quick landing page to a full multi-page site.",
    },
    {
      number: "02", 
      title: "AI Generates Your Site",
      description: "Our advanced AI analyzes your request and generates clean, modern code tailored to your specifications in real-time.",
    },
    {
      number: "03",
      title: "Preview & Refine",
      description: "See your website instantly in the live preview. Want changes? Just describe them and watch the AI update your site.",
    },
    {
      number: "04",
      title: "Export & Deploy",
      description: "When you are happy with the result, export your code or deploy directly. Your website is production-ready from day one.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From idea to website in four simple steps. No coding, no complexity.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line for larger screens */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="space-y-4">
                <div className="text-5xl font-bold text-muted-foreground/20 group-hover:text-primary/30 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
