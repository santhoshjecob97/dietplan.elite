import React from "react";
import { getPricing } from "../data/goals";
import { IMAGES } from "../data/images";
import { BRAND, BRAND_DARK } from "../data/constants";

export default function Checkout({ form, coupon, setCoupon, unlockPlan, startPayment }) {
  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: "100vh", background: "#f8f9fb" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "30px 16px" }}>
        <div style={{ height: 160, borderRadius: 24, background: `url(${IMAGES.CheckoutHeader}) center/cover`, marginBottom: 30, position: "relative", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))" }}></div>
          <div style={{ position: "absolute", bottom: 25, left: 30, color: "#fff", zIndex: 1 }}>
            <div style={{ background: "#E53935", color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 900, display: "inline-block", marginBottom: 10, letterSpacing: 1 }}>STEP2 PREMIUM</div>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>📈 3-Month Progress Targets</h2>
            <p style={{ margin: "6px 0 0 0", fontSize: 13, opacity: 0.8 }}>Choose your checkpoint for progress tracking & plan adjustments</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 30 }}>
          {(() => {
            const pricing = getPricing(form.goal, form.medical);
            return [
              { tag: "Progress Check", dur: "Week 4", price: pricing.week4, color: "#78909c", desc: "First milestone assessment & plan adjustment." },
              { tag: "Recommended", dur: "Week 8", price: pricing.week8, color: BRAND, desc: "Mid-point evaluation & progress tracking.", pop: true },
              { tag: "Elite", dur: "Week 12", price: pricing.week12, color: "#fbc02d", desc: "Complete 3-Month transformation review." },
            ];
          })().map(p => {
            const isDisc = coupon.toUpperCase() === "FREEFITNESS";
            return (
              <div key={p.dur} style={{ background: "#fff", borderRadius: 20, padding: "30px 24px", textAlign: "center", border: `2px solid ${p.pop ? p.color : "#eee"}`, position: "relative", transform: p.pop ? "scale(1.05)" : "none", transition: "transform 0.2s", boxShadow: p.pop ? "0 15px 40px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.03)" }}>
                {p.pop && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: p.color, color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: 10, fontWeight: 900, letterSpacing: 1 }}>POPULAR</div>}
                <div style={{ fontSize: 14, fontWeight: 800, color: "#888", marginBottom: 10 }}>{p.tag}</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: "#1a1a1a", marginBottom: 5 }}>₹{isDisc ? 0 : p.price}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: p.color, marginBottom: 15 }}>{p.dur} Duration</div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, marginBottom: 25, minHeight: 40 }}>{p.desc}</p>
                <button onClick={() => isDisc ? unlockPlan(p.dur) : startPayment(p.dur, p.price)} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: p.color, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "opacity 0.2s" }} onMouseOver={e => e.currentTarget.style.opacity = 0.9} onMouseOut={e => e.currentTarget.style.opacity = 1}>
                  {isDisc ? "Activate Free Plan" : "Choose Plan"}
                </button>
              </div>
            )
          })}
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1px solid #eee", textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#555", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>🎟️ Have a Coupon?</div>
          <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
            <input type="text" placeholder="Enter Coupon Code" value={coupon} onChange={e => setCoupon(e.target.value)} style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e8e8e8", fontSize: 14, outline: "none", textAlign: "center", fontWeight: 700, textTransform: "uppercase" }} />
          </div>
          {coupon.toUpperCase() === "FREEFITNESS" && (
            <div style={{ marginTop: 10, color: "#2e7d32", fontSize: 12, fontWeight: 800 }}>✅ Coupon Applied: 100% Discount!</div>
          )}
        </div>
      </div>
    </div>
  );
}
