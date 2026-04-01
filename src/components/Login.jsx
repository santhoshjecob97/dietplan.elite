import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LOGO_URI, BRAND, BRAND_DARK } from "../data/constants";

export default function Login() {
  const { signIn, signUp, signInWithPhone, verifyOTP } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState("login"); // login | signup | phone
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "phone") {
        if (!showOtp) {
          const { error: err } = await signInWithPhone(phone);
          if (err) throw err;
          setShowOtp(true);
          setMessage("📩 OTP sent to your phone!");
        } else {
          const { error: err } = await verifyOTP(phone, otp);
          if (err) throw err;
        }
      } else {
        const fn = mode === "login" ? signIn : signUp;
        const { error: err } = await fn(email, password);
        if (err) throw err;
        if (mode === "signup") {
          setMessage("✅ Account created! Check your email to confirm, then log in.");
          setMode("login");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 50% 40%, rgba(229,57,53,0.12) 0%, transparent 60%)" }} />

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
          {[["login", "Email"], ["phone", "Phone / OTP"], ["signup", "Join"]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(""); setMessage(""); setShowOtp(false); }}
              style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 9,
                background: mode === m ? BRAND : "transparent",
                color: mode === m ? "#fff" : "#888",
                fontWeight: 800, fontSize: 11, cursor: "pointer", transition: "all 0.2s",
                textTransform: "uppercase"
              }}>{label}
            </button>
          ))}
        </div>

        <form onSubmit={handle}>
          {mode === "phone" ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Phone Number</label>
                <input
                  type="tel" required value={phone} disabled={showOtp}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={inputStyle}
                />
              </div>
              {showOtp && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#666", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Verify OTP</label>
                  <input
                    type="text" required value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    style={inputStyle}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Email Address</label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="trainer@step2fitness.in"
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#666", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Password</label>
                <input
                  type="password" required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {error && <div style={errorStyle}>⚠️ {error}</div>}
          {message && <div style={msgStyle}>{message}</div>}

          <button type="submit" disabled={loading} className="premium-btn" style={{
            width: "100%", padding: "15px",
            background: loading ? "#444" : `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`,
            border: "none", borderRadius: 14, color: "#fff",
            fontWeight: 900, fontSize: 16, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : `0 6px 24px rgba(229,57,53,0.5)`,
          }}>
            {loading ? "⏳ Working..." : mode === "phone" ? (showOtp ? "🔓 Verify & Enter" : "📩 Send OTP") : (mode === "login" ? "🔐 Sign In" : "🚀 Create Account")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#444" }}>
          🔒 Secured by Step2 Fitness Cloud · 256-bit SSL
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 11, color: "#333" }}>
        © STEP2 FITNESS STUDIO, Valasarawakkam, Chennai
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "13px 16px", borderRadius: 12,
  border: "1.5px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)", color: "#fff",
  fontSize: 14, outline: "none", boxSizing: "border-box",
};

const errorStyle = {
  background: "rgba(229,57,53,0.15)", border: "1px solid rgba(229,57,53,0.4)",
  borderRadius: 10, padding: "12px 16px", color: "#ff8a80", fontSize: 13, marginBottom: 16
};

const msgStyle = {
  background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.4)",
  borderRadius: 10, padding: "12px 16px", color: "#a5d6a7", fontSize: 13, marginBottom: 16
};
