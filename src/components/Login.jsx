import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LOGO_URI, BRAND, BRAND_DARK } from "../data/constants";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const fn = mode === "login" ? signIn : signUp;
    const { error: err } = await fn(email, password);

    setLoading(false);
    if (err) {
      setError(err.message);
    } else if (mode === "signup") {
      setMessage("✅ Account created! Check your email to confirm, then log in.");
      setMode("login");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0d0d 0%, #1a0000 50%, #0d0d0d 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "20px",
    }}>
      {/* Background glow */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 50% 40%, rgba(229,57,53,0.12) 0%, transparent 60%)" }} />

      {/* Card */}
      <div style={{
        background: "rgba(24,24,24,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(229,57,53,0.2)",
        borderRadius: 24,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        position: "relative",
      }}>
        {/* Logo & Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src={LOGO_URI} alt="Step2 Fitness" style={{
            width: 72, height: 72, borderRadius: 18, objectFit: "cover",
            background: "#fff", padding: 4,
            boxShadow: `0 8px 32px rgba(229,57,53,0.5)`,
            marginBottom: 16,
          }} />
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: 0.5 }}>DIET PLAN BRAIN</div>
          <div style={{ color: BRAND, fontSize: 11, fontWeight: 800, letterSpacing: 3, marginTop: 4, textTransform: "uppercase" }}>Step2 Fitness Trainer Portal</div>
        </div>

        {/* Tab Switch */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {[["login", "Sign In"], ["signup", "Create Account"]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(""); setMessage(""); }}
              style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 9,
                background: mode === m ? BRAND : "transparent",
                color: mode === m ? "#fff" : "#888",
                fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
              }}>{label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handle}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#666", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Trainer Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="trainer@step2fitness.in"
              style={{
                width: "100%", padding: "13px 16px", borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "#fff",
                fontSize: 14, outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = BRAND}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#666", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Password</label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "13px 16px", borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "#fff",
                fontSize: 14, outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = BRAND}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {error && (
            <div style={{ background: "rgba(229,57,53,0.15)", border: "1px solid rgba(229,57,53,0.4)", borderRadius: 10, padding: "12px 16px", color: "#ff8a80", fontSize: 13, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}
          {message && (
            <div style={{ background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.4)", borderRadius: 10, padding: "12px 16px", color: "#a5d6a7", fontSize: 13, marginBottom: 16 }}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="premium-btn" style={{
            width: "100%", padding: "15px",
            background: loading ? "#444" : `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`,
            border: "none", borderRadius: 14, color: "#fff",
            fontWeight: 900, fontSize: 16, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : `0 6px 24px rgba(229,57,53,0.5)`,
            transition: "all 0.2s", letterSpacing: 0.5,
          }}>
            {loading ? "⏳ Please wait..." : mode === "login" ? "🔐 Sign In to Trainer Portal" : "🚀 Create Trainer Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#444" }}>
          🔒 Secured by Supabase Auth · 256-bit SSL
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 11, color: "#333" }}>
        © STEP2 FITNESS STUDIO, Valasarawakkam, Chennai
      </div>
    </div>
  );
}
