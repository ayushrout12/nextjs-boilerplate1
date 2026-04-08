export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "whisper your vision",
      description: "tell lotus what you dream of building. be poetic or precise — from a gentle landing page to an elaborate digital garden.",
    },
    {
      number: "02", 
      title: "watch it bloom",
      description: "lotus listens to your words and weaves them into elegant, modern code — crafted in real-time before your eyes.",
    },
    {
      number: "03",
      title: "nurture & refine",
      description: "see your website unfold in the live preview. wish for changes? simply describe them and watch lotus tend to your creation.",
    },
    {
      number: "04",
      title: "harvest & share",
      description: "when your creation feels complete, export your code or deploy instantly. your website blooms, ready for the world.",
    },
  ]

  return (
    <section id="how-it-works" className="py-28 md:py-36">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-serif font-normal tracking-wide sm:text-4xl md:text-5xl mb-6">
            how it unfolds
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            from seed to blossom in four gentle steps. no complexity, just creation.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative group text-center">
              {/* connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-border/50 to-transparent" />
              )}
              
              <div className="space-y-5">
                <div className="text-6xl font-serif font-light text-primary/20 group-hover:text-primary/40 transition-colors duration-500">
                  {step.number}
                </div>
                <h3 className="text-xl font-serif font-normal tracking-wide">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light tracking-wide">
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
