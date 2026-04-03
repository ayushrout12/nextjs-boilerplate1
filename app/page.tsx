"use client";
import AIChat from "./components/AIChat";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient - animated */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5 dark:via-primary/5" />
      
      {/* Decorative lotus blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 py-20 md:py-28">
        {/* Hero section */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm mb-6">
            <span>🌸</span>
            <span>ai-powered website builder</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            build with lotus
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            describe your vision, and lotus ai will craft it. <br />
            no code, just creativity.
          </p>
        </div>

        {/* AI Chat panel - glass morphism */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="border-b border-border/50 px-6 py-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">lotus ai · ready</span>
              </div>
            </div>
            <div className="p-6">
              <AIChat />
            </div>
          </div>
        </div>

        {/* Feature cards - modern */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto">
          <div className="group relative rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 text-center hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition" />
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-semibold mb-2">ai generation</h3>
            <p className="text-sm text-muted-foreground">describe, and lotus builds</p>
          </div>
          <div className="group relative rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 text-center hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
            <div className="text-4xl mb-3">🌸</div>
            <h3 className="font-semibold mb-2">lotus elegance</h3>
            <p className="text-sm text-muted-foreground">calm, beautiful design</p>
          </div>
          <div className="group relative rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 text-center hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
            <div className="text-4xl mb-3">🌙</div>
            <h3 className="font-semibold mb-2">light / dark</h3>
            <p className="text-sm text-muted-foreground">your eyes, your choice</p>
          </div>
        </div>
      </div>
    </div>
  );
}
