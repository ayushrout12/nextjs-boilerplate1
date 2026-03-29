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
      <main style={pageBg}>
        <section style={gateCard}>
          <div style={emojiLogo}>🌸</div>
          <p style={eyebrow}>private preview</p>
          <h1 style={gateTitle}>enter preview access</h1>
          <p style={gateText}>
            this preview build is currently private.
          </p>

          <form onSubmit={handleUnlock} style={{ marginTop: 24 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              autoComplete="current-password"
              style={passwordInput}
            />

            {error ? <p style={errorText}>{error}</p> : null}

            <button type="submit" style={primaryButton}>
              continue
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main style={pageBg}>
      <section style={heroWrap}>
        <div style={heroCard}>
          <div style={badge}>🌸 lotus</div>

          <h1 style={heroTitle}>
            build web products that feel thoughtful from the start
          </h1>

          <p style={heroText}>
            shape an idea, refine the direction, and turn early concepts into
            something clear, useful, and beautifully made.
          </p>

          <div style={heroActions}>
            <input
              type="text"
              placeholder="describe what you want to build"
              style={heroInput}
            />
            <button style={primaryButtonSmall}>start</button>
          </div>

          <div style={subLinks}>
            <span>calm workflow</span>
            <span>clean output</span>
            <span>private preview</span>
          </div>
        </div>
      </section>
    </main>
  );
}

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  padding: "40px 24px 80px",
  background: `
    radial-gradient(circle at 15% 20%, rgba(255, 196, 221, 0.85), transparent 28%),
    radial-gradient(circle at 85% 18%, rgba(188, 233, 255, 0.9), transparent 30%),
    radial-gradient(circle at 50% 90%, rgba(214, 206, 255, 0.65), transparent 30%),
    linear-gradient(135deg, #fff7fb 0%, #f4fbff 52%, #fff9f2 100%)
  `,
};

const heroWrap: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const heroCard: React.CSSProperties = {
  width: "100%",
  maxWidth: "980px",
  padding: "72px 56px",
  borderRadius: "34px",
  background: "rgba(255,255,255,0.60)",
  backdropFilter: "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
  boxShadow: "0 24px 80px rgba(82, 70, 110, 0.10)",
  border: "1px solid rgba(255,255,255,0.7)",
  textAlign: "center",
};

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "10px 16px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.72)",
  color: "#7a5af8",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "26px",
  border: "1px solid rgba(122,90,248,0.10)",
};

const heroTitle: React.CSSProperties = {
  margin: "0 auto",
  maxWidth: "820px",
  fontSize: "64px",
  lineHeight: 1.02,
  fontWeight: 600,
  letterSpacing: "-0.04em",
  color: "#17131a",
};

const heroText: React.CSSProperties = {
  maxWidth: "680px",
  margin: "20px auto 0",
  fontSize: "19px",
  lineHeight: 1.75,
  color: "#5f5863",
};

const heroActions: React.CSSProperties = {
  marginTop: "34px",
  display: "flex",
  gap: "14px",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
};

const heroInput: React.CSSProperties = {
  width: "min(100%, 560px)",
  padding: "18px 20px",
  borderRadius: "18px",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.88)",
  color: "#17131a",
  fontSize: "16px",
  outline: "none",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
};

const primaryButtonSmall: React.CSSProperties = {
  padding: "18px 24px",
  border: "none",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #7c6cff 0%, #6b8cff 100%)",
  color: "#fff",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 14px 34px rgba(108, 99, 255, 0.22)",
};

const subLinks: React.CSSProperties = {
  marginTop: "22px",
  display: "flex",
  justifyContent: "center",
  gap: "22px",
  flexWrap: "wrap",
  color: "#7b737c",
  fontSize: "14px",
};

const gateCard: React.CSSProperties = {
  width: "100%",
  maxWidth: "540px",
  margin: "80px auto",
  padding: "42px",
  borderRadius: "30px",
  background: "rgba(255,255,255,0.68)",
  backdropFilter: "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
  boxShadow: "0 24px 80px rgba(82, 70, 110, 0.10)",
  border: "1px solid rgba(255,255,255,0.7)",
};

const emojiLogo: React.CSSProperties = {
  textAlign: "center",
  fontSize: "34px",
  marginBottom: "16px",
};

const eyebrow: React.CSSProperties = {
  margin: 0,
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  fontSize: "12px",
  color: "#7c7480",
};

const gateTitle: React.CSSProperties = {
  margin: "14px 0 10px",
  textAlign: "center",
  fontSize: "38px",
  lineHeight: 1.08,
  color: "#17131a",
};

const gateText: React.CSSProperties = {
  margin: 0,
  textAlign: "center",
  color: "#5f5863",
  fontSize: "16px",
  lineHeight: 1.7,
};

const passwordInput: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "17px 18px",
  borderRadius: "16px",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.88)",
  fontSize: "16px",
  color: "#17131a",
  outline: "none",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  marginTop: "16px",
  padding: "17px 18px",
  border: "none",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #7c6cff 0%, #6b8cff 100%)",
  color: "#fff",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 14px 34px rgba(108, 99, 255, 0.22)",
};

const errorText: React.CSSProperties = {
  marginTop: "12px",
  marginBottom: 0,
  fontSize: "14px",
  color: "#b85b68",
};
