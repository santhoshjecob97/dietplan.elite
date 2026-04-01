import React from "react";
import { ACTIVITIES, MEDICAL_CONDITIONS } from "../data/constants";
import { GOAL_CFG, GOALS } from "../data/goals";
import { IMAGES } from "../data/images";
import { ALLERGEN_LIST, ALLERGENS } from "../data/allergens";

export default function PlanForm({ form, setFormValue, generate, BRAND_DARK }) {
  const gc = GOAL_CFG[form.goal] || GOAL_CFG["Weight Loss"];

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: "100vh", background: "#f4f5f7" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 16px" }}>

        {/* GOAL SELECTOR */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "22px 22px 18px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#555", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>🎯 Select Fitness Goal</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 9 }}>
            {GOALS.map(g => {
              const cfg = GOAL_CFG[g];
              const sel = form.goal === g;
              return (
                <button key={g} onClick={() => setFormValue("goal", g)} style={{ position: "relative", overflow: "hidden", padding: "20px 10px", borderRadius: 12, border: `2px solid ${sel ? cfg.color : "transparent"}`, background: `url(${IMAGES[g]}) center/cover`, color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: 13, transition: "all 0.2s", boxShadow: sel ? `0 0 0 4px ${cfg.color}40` : "0 4px 10px rgba(0,0,0,0.15)", minHeight: "100px", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                  <div style={{ position: "absolute", inset: 0, background: sel ? `linear-gradient(to top, ${cfg.color}E6, rgba(0,0,0,0.3))` : "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))" }}></div>
                  <div style={{ position: "relative", zIndex: 1, textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{cfg.icon}</div>
                    <div>{g}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* PERSONAL INFO */}
        <div style={{ height: 120, borderRadius: 16, background: `url(${IMAGES.FormHeader}) center/cover`, marginBottom: 16, position: "relative", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)" }}></div>
          <div style={{ position: "absolute", bottom: 16, left: 22, color: "#fff", zIndex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Create Client Profile</h2>
            <p style={{ margin: "4px 0 0 0", fontSize: 12, opacity: 0.9 }}>Enter details to generate AI diet & workout plan</p>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: "22px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#555", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>👤 Personal Info</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["name", "Full Name", "text", "e.g. Ravi Kumar"], ["phone", "Phone (WhatsApp)", "tel", "e.g. 9962444002"], ["age", "Age", "number", "e.g. 32"], ["height", "Height (cm)", "number", "170"], ["weight", "Weight (kg)", "number", "85"]].map(([k, l, t, ph]) => (
              <div key={k}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</label>
                <input type={t} placeholder={ph} value={form[k] || ""} onChange={e => setFormValue(k, e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e8e8e8", fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = gc.color} onBlur={e => e.target.style.borderColor = "#e8e8e8"} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Gender</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["M", "👨 Male"], ["F", "👩 Female"]].map(([v, l]) => (
                  <button key={v} onClick={() => setFormValue("gender", v)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${form.gender === v ? "#0288d1" : "#e8e8e8"}`, background: form.gender === v ? "#0288d1" : "#fff", color: form.gender === v ? "#fff" : "#444", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Diet Type</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["Yes", "🥦 Veg"], ["No", "🍗 Non-Veg"]].map(([v, l]) => (
                  <button key={v} onClick={() => setFormValue("vegetarian", v)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${form.vegetarian === v ? "#2e7d32" : "#e8e8e8"}`, background: form.vegetarian === v ? "#2e7d32" : "#fff", color: form.vegetarian === v ? "#fff" : "#444", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVITY & MEDICAL */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "22px", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "#555", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>⚕️ Activity & Health</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Activity Level</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {ACTIVITIES.map(a => (
                  <button key={a} onClick={() => setFormValue("activity", a)} style={{ padding: "9px 14px", borderRadius: 9, border: `1.5px solid ${form.activity === a ? "#5e35b1" : "#e8e8e8"}`, background: form.activity === a ? "#5e35b1" : "#fff", color: form.activity === a ? "#fff" : "#555", cursor: "pointer", fontWeight: 700, fontSize: 12, textAlign: "left" }}>{a}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Medical Condition</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {MEDICAL_CONDITIONS.map(m => (
                  <button key={m} onClick={() => setFormValue("medical", m)} style={{ padding: "9px 14px", borderRadius: 9, border: `1.5px solid ${form.medical === m ? "#c62828" : "#e8e8e8"}`, background: form.medical === m ? "#c62828" : "#fff", color: form.medical === m ? "#fff" : "#555", cursor: "pointer", fontWeight: 700, fontSize: 12, textAlign: "left" }}>{m}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Select Allergies</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALLERGEN_LIST.map(a => {
                const config = ALLERGENS[a];
                // Ensure form.allergies is handled as an array
                const allergens = Array.isArray(form.allergies) ? form.allergies : [];
                const isSelected = allergens.includes(a);

                const toggleAllergen = () => {
                  const updated = isSelected 
                    ? allergens.filter(item => item !== a)
                    : [...allergens, a];
                  setFormValue("allergies", updated);
                };

                return (
                  <button 
                    key={a} 
                    onClick={toggleAllergen}
                    style={{ 
                      padding: "8px 14px", 
                      borderRadius: 20, 
                      border: `1.5px solid ${isSelected ? "#E53935" : "#e8e8e8"}`, 
                      background: isSelected ? "#E53935" : "#fff", 
                      color: isSelected ? "#fff" : "#666", 
                      cursor: "pointer", 
                      fontWeight: 700, 
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "all 0.2s"
                    }}
                  >
                    <span>{config.icon}</span> {a}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Other Notes (Optional)</label>
              <input value={form.notes || ""} onChange={e => setFormValue("notes", e.target.value)} placeholder="e.g. No shellfish, extra spicy..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e8e8e8", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            </div>
          </div>
        </div>

        <button onClick={generate} disabled={!form.name || !form.age || !form.height || !form.weight} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: (!form.name || !form.age || !form.height || !form.weight) ? "#ccc" : `linear-gradient(135deg,${gc.color},${BRAND_DARK})`, color: "#fff", fontSize: 17, fontWeight: 800, cursor: (!form.name || !form.age || !form.height || !form.weight) ? "not-allowed" : "pointer", boxShadow: (!form.name || !form.age || !form.height || !form.weight) ? "none" : `0 6px 24px ${gc.color}50`, letterSpacing: 0.5 }}>
          🧠 Generate Complete Diet Plan →
        </button>
      </div>
    </div>
  );
}
