import LotusLogo from "./components/LotusLogo";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* logo */}
      <LotusLogo />

      {/* title */}
      <h1
        style={{
          fontSize: "20px",
          letterSpacing: "2px",
          opacity: 0.6,
          marginBottom: "30px",
        }}
      >
        trylotus
      </h1>

      {/* headline */}
      <h2
        style={{
          fontSize: "48px",
          fontWeight: 500,
          textAlign: "center",
          maxWidth: "700px",
          lineHeight: "1.2",
        }}
      >
        build something you actually want to use
      </h2>

      {/* subtext */}
      <p
        style={{
          marginTop: "16px",
          fontSize: "18px",
          opacity: 0.7,
          textAlign: "center",
        }}
      >
        describe it. we’ll help you make it real.
      </p>

      {/* input box */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "10px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <input
          placeholder="a simple habit tracker for students..."
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #222",
            background: "transparent",
            fontSize: "16px",
          }}
        />

        <button
          style={{
            padding: "16px 20px",
            borderRadius: "12px",
            border: "none",
            background: "white",
            color: "black",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          build
        </button>
      </div>
    </main>
  );
}
