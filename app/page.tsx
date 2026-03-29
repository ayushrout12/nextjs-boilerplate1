import LotusLogo from "./components/LotusLogo"

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px"
      }}
    >
      <div
        style={{
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.6)",
          borderRadius: "24px",
          padding: "60px",
          maxWidth: "720px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)"
        }}
      >
        <LotusLogo />

        <h1
          style={{
            fontSize: "18px",
            letterSpacing: "2px",
            marginBottom: "20px",
            opacity: 0.6
          }}
        >
          trylotus
        </h1>

        <h2
          style={{
            fontSize: "44px",
            fontWeight: 500,
            lineHeight: 1.2
          }}
        >
          build something you actually want to use
        </h2>

        <p
          style={{
            marginTop: "14px",
            fontSize: "18px",
            opacity: 0.7
          }}
        >
          describe your idea. lotus helps bring it to life.
        </p>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            gap: "10px"
          }}
        >
          <input
            placeholder="a habit tracker for students..."
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.1)",
              fontSize: "16px"
            }}
          />

          <button
            style={{
              padding: "16px 24px",
              borderRadius: "12px",
              border: "none",
              background: "#7c6cff",
              color: "white",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            build
          </button>
        </div>
      </div>
    </main>
  )
}
