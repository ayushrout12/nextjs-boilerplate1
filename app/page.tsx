"use client";
import AIChat from "./components/AIChat";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* Hero section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
          <span>🌸</span>
          <span className="lowercase">ai‑powered website builder</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          build with <span className="text-primary">lotus</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          describe your vision, and lotus ai will craft it. no code, just creativity.
        </p>
      </section>

      {/* AI Chat panel */}
      <section className="max-w-2xl mx-auto">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-6 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌸</span>
              <span className="font-medium lowercase">lotus ai assistant</span>
            </div>
          </div>
          <div className="p-6">
            <AIChat />
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
        <div className="rounded-lg border border-border p-5 text-center hover:border-primary/50 transition">
          <div className="text-3xl mb-2">✨</div>
          <h3 className="font-medium mb-1 lowercase">ai generation</h3>
          <p className="text-sm text-muted-foreground lowercase">describe, and lotus builds</p>
        </div>
        <div className="rounded-lg border border-border p-5 text-center hover:border-primary/50 transition">
          <div className="text-3xl mb-2">🌸</div>
          <h3 className="font-medium mb-1 lowercase">lotus elegance</h3>
          <p className="text-sm text-muted-foreground lowercase">beautiful, calm design</p>
        </div>
        <div className="rounded-lg border border-border p-5 text-center hover:border-primary/50 transition">
          <div className="text-3xl mb-2">🌙</div>
          <h3 className="font-medium mb-1 lowercase">light / dark</h3>
          <p className="text-sm text-muted-foreground lowercase">your eyes, your choice</p>
        </div>
      </section>
    </div>
  );
}
