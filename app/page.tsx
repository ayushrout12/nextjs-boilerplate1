export default function Home() {
  return (
    <main
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >

      {/* animated lotus logo */}
      <svg
        width="90"
        height="90"
        viewBox="0 0 200 200"
        style={{ marginBottom: "20px" }}
      >
        <g fill="white">
          <path d="M100 40 C120 80 140 90 100 140 C60 90 80 80 100 40">
            <animate
              attributeName="d"
              dur="3s"
              repeatCount="indefinite"
              values="
              M100 40 C120 80 140 90 100 140 C60 90 80 80 100 40;
              M100 45 C125 85 145 95 100 145 C55 95 75 85 100 45;
              M100 40 C120 80 140 90 100 140 C60 90 80 80 100 40
              "
            />
          </path>
        </g>
      </svg>

      {/* brand */}
      <h1
        style={{
          fontSize: "20px",
          letterSpacing: "2px",
          opacity: 0.7,
          marginBottom: "40px",
        }}
      >
        trylotus
      </h1>

      {/* headline */}
      <h2
        style={{
          fontSize: "48px",
          fontWeight: "500",
          maxWidth: "700px",
          lineHeight: "1.2",
        }}
      >
        build something you actually want to use
      </h2>

      <p
        style={{
          marginTop: "20px",
          fontSize: "18px",
          opacity: 0.7,
        }}
      >
        describe it. we’ll help you make it real.
      </p>

    </main>
  );
}
