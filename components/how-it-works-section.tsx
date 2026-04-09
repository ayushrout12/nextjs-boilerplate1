export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Describe",
      description: "Tell Lotus what you want to build. Be creative or precise — from a simple landing page to a complex web app.",
    },
    {
      number: "2", 
      title: "Generate",
      description: "Lotus transforms your words into elegant, modern code — crafted in real-time before your eyes.",
    },
    {
      number: "3",
      title: "Refine",
      description: "See your website in the live preview. Want changes? Simply describe them and watch Lotus update your creation.",
    },
    {
      number: "4",
      title: "Publish",
      description: "When ready, publish to your own subdomain or export the code. Your website is ready for the world.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From idea to website in four simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-border" />
              )}
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold mx-auto">
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
