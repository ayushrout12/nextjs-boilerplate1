export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center text-center mt-32 px-6">

      <h1 className="text-6xl font-bold mb-6">
        Build Websites With AI
      </h1>

      <p className="text-lg text-gray-500 max-w-xl mb-8">
        Lotus is the world's best AI-powered web developer.
        Turn ideas into production websites instantly.
      </p>

      <div className="flex gap-4">
        <button className="px-6 py-3 bg-black text-white rounded-xl">
          Start Building
        </button>

        <button className="px-6 py-3 border rounded-xl">
          View Demo
        </button>
      </div>

    </main>
  )
}
