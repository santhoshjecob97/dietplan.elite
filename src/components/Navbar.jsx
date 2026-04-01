import React from "react";
import { LOGO_URI, BRAND } from "../data/constants";
import { exportPDF } from "../utils/pdfGenerator";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ page, setPage, plan, purchaseDuration }) {
  const { user, signOut } = useAuth();

  return (
    <div 
      className="glass-card"
      style={{ 
        margin: "12px 20px", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", 
        height: 64, position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, 
        borderRadius: 20, border: "1px solid rgba(255,255,255,0.4)"
      }}
    >
      {/* Brand */}
      <div 
        className="premium-btn"
        style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} 
        onClick={() => setPage("home")}
      >
        <img src={LOGO_URI} alt="Step2" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", background: "#fff", padding: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
        <div style={{ display: window.innerWidth < 600 ? "none" : "block" }}>
          <div style={{ color: "#1a1a1a", fontWeight: 900, fontSize: 15, letterSpacing: 0.5, lineHeight: 1.1 }}>STEP2 FITNESS</div>
          <div style={{ color: BRAND, fontSize: 10, fontWeight: 800, letterSpacing: 1.5 }}>PREMIUM BRAIN</div>
        </div>
      </div>

      {/* Nav Actions */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Main Nav Icons (Clean & Premium) */}
        {[
          { id: "home", label: "🏠", text: "Home" },
          { id: "members", label: "👥", text: "Members" },
          { id: "store", label: "🛒", text: "Store" },
          { id: "franchise", label: "🏢", text: "Franchise", roles: ["superadmin", "manager"] }
        ].map(item => {
          if (item.roles && !item.roles.includes(user?.role)) return null;
          const isActive = page === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setPage(item.id)} 
              className="premium-btn"
              style={{ 
                background: isActive ? `${BRAND}15` : "transparent", 
                border: "none", color: isActive ? BRAND : "#555", 
                padding: "8px 16px", borderRadius: 14, cursor: "pointer", 
                fontSize: 13, fontWeight: 800,
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              <span>{item.label}</span>
              <span style={{ display: window.innerWidth < 800 ? "none" : "block" }}>{item.text}</span>
            </button>
          );
        })}

        <div style={{ position: "sticky", top: 16, zIndex: 1000, margin: "0 16px" }}>
      <div className="glass-card" style={{ 
        padding: "12px 24px", color: "#fff", 
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderRadius: 20, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="premium-btn" onClick={() => setPage("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <img src={LOGO_URI} alt="S2" style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", padding: 2 }} />
            <span style={{ fontWeight: 900, letterSpacing: 1, fontSize: 18 }}>STEP2</span>
          </div>
          {plan?.client && (
            <div style={{ padding: "4px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "#666" }}>Client:</span> {plan.client.name}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {[["home", "🏠 Home"], ["dashboard", "👥 Members"], ["form", "💪 New Plan"]].map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)} className="premium-btn" style={{ 
              padding: "10px 16px", border: "none", background: page === id ? BRAND : "transparent",
              color: "#fff", borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: "pointer",
            }}>{label}</button>
          ))}
          <button onClick={() => signOut()} className="premium-btn" style={{ 
            padding: "10px 16px", border: "none", background: "rgba(255,255,255,0.05)",
            color: "#ff8a80", borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: "pointer", marginLeft: 8
          }}>🚪 Exit</button>
        </div>
      </div>
    </div>

        {/* Dynamic Context Button */}
        {page === "plan" && plan && (
          <button 
            onClick={() => exportPDF(plan.client, plan.metrics, plan.meals, plan.shop, plan.gc, purchaseDuration)} 
            className="premium-btn"
            style={{ background: BRAND, border: "none", color: "#fff", padding: "10px 20px", borderRadius: 14, cursor: "pointer", fontSize: 13, fontWeight: 900, boxShadow: `0 4px 15px ${BRAND}40` }}
          >
            ⬇ DOWNLOAD PDF
          </button>
        )}

        {["form", "checkout", "payment"].includes(page) && (
          <button onClick={() => setPage("home")} style={{ background: "rgba(0,0,0,0.05)", border: "none", color: "#555", padding: "8px 16px", borderRadius: 14, cursor: "pointer", fontSize: 12, fontWeight: 800 }}>← Back</button>
        )}

        {/* User Account */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg,${BRAND},#f57c00)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", boxShadow: "0 4px 10px rgba(229,57,53,0.3)" }}>
              {user.email?.[0]?.toUpperCase() || "T"}
            </div>
            <button onClick={signOut} style={{ background: "rgba(0,0,0,0.05)", border: "none", color: "#e53935", width: 32, height: 32, borderRadius: 10, cursor: "pointer", fontSize: 14 }} title="Logout">🚪</button>
          </div>
        )}
      </div>
    </div>
  );
}
