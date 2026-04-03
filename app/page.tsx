"use client"

import AIChat from "./components/AIChat"

export default function Page() {
  return (
    <main className="min-h-screen lotus-bg text-white">

      {/* HERO */}
      <section className="hero">
        <h1 className="hero-title">
          Lotus — The World’s Best AI-Powered Web Developer
        </h1>

        <p className="hero-sub">
          describe your vision. lotus builds it instantly.
        </p>
      </section>


      {/* CHAT BUILDER */}
      <section className="builder">
        <AIChat />
      </section>


      {/* FEATURES */}
      <section className="features">

        <div className="feature">
          <h3>AI Generation</h3>
          <p>Describe your idea and lotus generates the entire website.</p>
        </div>

        <div className="feature">
          <h3>Instant Deploy</h3>
          <p>Your project is generated and ready to deploy immediately.</p>
        </div>

        <div className="feature">
          <h3>Lotus Intelligence</h3>
          <p>Powered by advanced AI models trained to build production-grade apps.</p>
        </div>

      </section>

    </main>
  )
}
