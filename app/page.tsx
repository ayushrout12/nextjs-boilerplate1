"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("lotus-access");
    if (saved === "granted") {
      setAuthorized(true);
    }
  }, []);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();

    if (password === "lotuspreview") {
      window.localStorage.setItem("lotus-access", "granted");
      setAuthorized(true);
      setError("");
      setPassword("");
    } else {
      setError("Incorrect password");
    }
  }

  if (!authorized) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          background:
            "linear-gradient(135deg, #f7f1f4 0%, #eef6f8 50%, #f8f5ef 100%)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderRadius: "28px",
            padding: "40px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.65)",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              marginBottom: "18px",
              textAlign: "center",
            }}
          >
            🌸
          </div>

          <p
            style={{
              margin: 0,
              textAlign: "center",
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#7b6f76",
            }}
          >
            lotus preview
          </p>

          <h1
            style={{
              marginTop: "14px",
              marginBottom: "10px",
              textAlign: "center",
              fontSize: "36px",
              lineHeight: 1.15,
              color: "#1f1a1d",
              fontWeight: 600,
            }}
          >
            enter preview access
          </h1>

          <p
            style={{
              margin: "0 0 28px 0",
              textAlign: "center",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#6d646a",
            }}
          >
            this preview is currently private.
          </p>

          <form onSubmit={handleUnlock}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "16px 18px",
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.9)",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
                color: "#1f1a1d",
              }}
            />

            {error && (
              <p
                style={{
                  marginTop: "12px",
                  marginBottom: 0,
                  color: "#b14c5a",
                  fontSize: "14px",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                marginTop: "18px",
                padding: "16px 18px",
                borderRadius: "16px",
                border: "none",
                background: "#7c6cff",
                color: "white",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(124,108,255,0.22)",
              }}
            >
              enter
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "56px 32px 80px",
        background:
          "linear-gradient(135deg, #f7f1f4 0%, #eef6f8 50%, #f8f5ef 100%)",
      }}
    >
      <section
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.68)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: "32px",
          padding: "72px 56px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.65)",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "20px",
          }}
        >
          🌸
        </div>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#7b6f76",
          }}
        >
          lotus
        </p>

        <h1
          style={{
            marginTop: "18px",
            marginBottom: "18px",
            maxWidth: "760px",
            fontSize: "64px",
            lineHeight: 1.02,
            fontWeight: 600,
            color: "#1f1a1d",
          }}
        >
          build products that feel thoughtful from the start
        </h1>

        <p
          style={{
            maxWidth: "640px",
            margin: 0,
            fontSize: "19px",
            lineHeight: 1.7,
            color: "#5e565b",
          }}
        >
          a calmer way to shape ideas, explore product directions, and turn early
          concepts into something clear, useful, and real.
        </p>

        <div
          style={{
            marginTop: "34px",
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="describe what you want to build"
            style={{
              flex: "1 1 420px",
              minWidth: "280px",
              padding: "18px 20px",
              borderRadius: "18px",
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.92)",
              fontSize: "16px",
              color: "#1f1a1d",
              outline: "none",
            }}
          />

          <button
            style={{
              padding: "18px 24px",
              borderRadius: "18px",
              border: "none",
              background: "#7c6cff",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(124,108,255,0.22)",
            }}
          >
            continue
          </button>
        </div>
      </section>
    </main>
  );
}