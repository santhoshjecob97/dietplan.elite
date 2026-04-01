import React from "react";
import { LOGO_URI } from "../data/constants";
import { GOALS, GOAL_CFG } from "../data/goals";

export default function Home({ setPage, setFormValue }) {
  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: "100vh", background: "#111" }}>
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#1a1a1a 0%,#2d0000 50%,#1a1a1a 100%)", padding: "60px 20px 50px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 20% 50%, #E5393520 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E5393515 0%, transparent 40%)" }} />
        <div style={{ position: "relative" }}>
          <img src={LOGO_URI} alt="Step2 Fitness" style={{ width: 100, height: 100, borderRadius: 20, objectFit: "cover", background: "#fff", padding: 4, boxShadow: "0 8px 40px rgba(229,57,53,0.4)", marginBottom: 20 }} />
          <h1 style={{ color: "#fff", fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, letterSpacing: 1, margin: 0, lineHeight: 1.1 }}>DIET PLAN BRAIN</h1>
          <p style={{ color: "#E53935", fontSize: 14, fontWeight: 800, letterSpacing: 3, marginTop: 6 }}>STEP2 FITNESS GYM — CHENNAI</p>
          <p style={{ color: "#999", fontSize: 15, marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>Generate complete personalized diet plans for any fitness goal in seconds</p>
          <button onClick={() => setPage("form")} style={{ marginTop: 32, padding: "16px 48px", background: "#E53935", border: "none", color: "#fff", fontSize: 18, fontWeight: 800, borderRadius: 50, cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 6px 30px rgba(229,57,53,0.5)" }}>
            🚀 Create Diet Plan
          </button>
        </div>
      </div>

      {/* GOALS GRID */}
      <div style={{ padding: "40px 20px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ color: "#fff", textAlign: "center", fontSize: 20, fontWeight: 800, marginBottom: 24, letterSpacing: 1 }}>SUPPORTED FITNESS GOALS</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {GOALS.map(g => {
            const cfg = GOAL_CFG[g];
            return (
              <div key={g} onClick={() => { setFormValue("goal", g); setPage("form"); }} style={{ background: "#1e1e1e", border: `1.5px solid ${cfg.color}30`, borderRadius: 14, padding: "18px 16px", cursor: "pointer", transition: "all 0.2s" }}
                onMouseOver={e => { e.currentTarget.style.borderColor = cfg.color; e.currentTarget.style.background = "#2a2a2a" }}
                onMouseOut={e => { e.currentTarget.style.borderColor = cfg.color + "30"; e.currentTarget.style.background = "#1e1e1e" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{cfg.icon}</div>
                <div style={{ color: cfg.color, fontWeight: 800, fontSize: 15 }}>{g}</div>
                <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{cfg.adj > 0 ? "+" + cfg.adj : cfg.adj === 0 ? "Maintenance" : cfg.adj} kcal adjustment</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* HOW TO USE AS APP */}
      <div style={{ background: "#1a1a1a", borderTop: "1px solid #333", padding: "36px 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ color: "#E53935", textAlign: "center", fontSize: 18, fontWeight: 800, marginBottom: 20, letterSpacing: 1 }}>📱 USE AS AN APP ON YOUR PC</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
            {[
              ["🌐 Chrome / Edge", "Click ⋮ menu → 'Install App' or 'Add to Home Screen' → Launches like a desktop app"],
              ["🖥 Desktop Shortcut", "In Chrome: ⋮ → More Tools → Create Shortcut → ✓ Open as Window"],
              ["🍎 Mac / Safari", "Share button → Add to Dock → Opens as standalone window"],
              ["📌 Bookmark Toolbar", "Drag URL to bookmarks bar for one-click access"],
            ].map(([t, d]) => (
              <div key={t} style={{ background: "#242424", borderRadius: 12, padding: "16px", border: "1px solid #333" }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{t}</div>
                <div style={{ color: "#888", fontSize: 12, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#111", padding: "20px", textAlign: "center", color: "#444", fontSize: 12 }}>
        © STEP2 FITNESS STUDIO, Valasarawakkam &nbsp;•&nbsp; <span style={{ color: "#E53935" }}>GET A JUMP ON YOUR DAY</span>
      </div>
    </div>
  );
}
