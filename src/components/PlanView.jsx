import React from "react";
import { LOGO_URI, BRAND_DARK, DAYS } from "../data/constants";
import { GOAL_CFG } from "../data/goals";
import { IMAGES } from "../data/images";
import { WORKOUT_SCHEDULES, WORKOUT_DETAILS, getExercisesForWorkout } from "../data/workouts";
import { SUPPLEMENT_PLANS, SUPPLEMENT_BRANDS } from "../data/supplements";
import { ALLERGENS } from "../data/allergens";
import { FOOD_DATABASE } from "../data/foodDatabase";
import { findSwaps } from "../utils/swapEngine";
import { exportPDF } from "../utils/pdfGenerator";
import { getWhatsAppMessage } from "../utils/messaging";
import { logMeal, fetchMemberLogs } from "../hooks/useFoodLogs";
import { updatePlanSwaps } from "../hooks/usePlans";
import { connectGoogleFit, fetchTodaySteps } from "../utils/googleFit";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

export default function PlanView({ plan, tab, setTab, purchaseDuration, setPage, setForm, copied, setCopied }) {
  const { client, metrics, meals: initialMeals, shop, gc, id: planId, meal_overrides } = plan;
  const [sessionMeals, setSessionMeals] = React.useState(meal_overrides || initialMeals);
  const [swapTarget, setSwapTarget] = React.useState(null);
  const [alternatives, setAlternatives] = React.useState([]);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const totalCal = sessionMeals.reduce((s, m) => s + m.cal, 0);
  const C = gc.color;
  const [expandedDay, setExpandedDay] = React.useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [steps, setSteps] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Sync state if plan.id changes (manual plan switch)
  React.useEffect(() => {
    setSessionMeals(meal_overrides || initialMeals);
  }, [planId, meal_overrides, initialMeals]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");
    if (token) {
      setAccessToken(token);
      fetchTodaySteps(token).then(setSteps);
    }
  }, []);

  const handleSwapRequest = (index) => {
    const meal = sessionMeals[index];
    const swps = findSwaps(meal, client.goal);
    setAlternatives(swps);
    setSwapTarget(index);
  };

  const applySwap = async (alt) => {
    const newMeals = [...sessionMeals];
    newMeals[swapTarget] = {
      ...newMeals[swapTarget],
      foods: alt.displayQty + " (" + alt.name + ")",
      cal: alt.newMacros.cal,
      p: alt.newMacros.p,
      c: alt.newMacros.c,
      f: alt.newMacros.f,
      isSwapped: true
    };
    setSessionMeals(newMeals);
    setSwapTarget(null);
    
    // PERSIST TO DATABASE
    setIsSyncing(true);
    await updatePlanSwaps(planId, newMeals);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const resetPlan = async () => {
    if (!window.confirm("Restore to original trainer-designed plan? Your custom swaps will be lost.")) return;
    setSessionMeals(initialMeals);
    setIsSyncing(true);
    await updatePlanSwaps(planId, null);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* CLIENT HERO SECTION (Premium Gradient & Glass) */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_DARK} 0%, ${C} 100%)`, padding: "40px 24px 30px", color: "#fff", position: "relative", overflow: "hidden" }}>
        {/* Subtle background decoration */}
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }}></div>
        
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          <img src={LOGO_URI} alt="Step2" style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", background: "#fff", padding: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }} />
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" }}>Personalized Performance Brain</div>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, letterSpacing: -0.5 }}>{client.name}</h1>
            
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
               <span style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", padding: "6px 14px", borderRadius: 12, fontSize: 12, fontWeight: 800 }}>🔥 {client.streak_count || 0} DAY STREAK</span>
               <span style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", padding: "6px 14px", borderRadius: 12, fontSize: 12, fontWeight: 800 }}>🏆 {client.points || 0} POINTS</span>
               {steps !== null && (
                 <span style={{ background: "rgba(156,255,97,0.2)", backdropFilter: "blur(4px)", padding: "6px 14px", borderRadius: 12, fontSize: 12, fontWeight: 800, color: "#9cff61" }}>🚶 {steps} STEPS</span>
               )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[["TARGET", metrics.targetCal, "kcal"], ["PROTEIN", metrics.protein + "g", ""], ["WATER", metrics.water + "L", ""]].map(([l, v, u]) => (
              <div key={l} className="glass-card" style={{ padding: "14px 18px", textAlign: "center", borderRadius: 16, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 24, fontWeight: 900 }}>{v}</div>
                <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.8, textTransform: "uppercase" }}>{l} {u}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 20px", display: "flex", gap: 4, overflowX: "auto" }}>
        {[["overview", "📊 Overview"], ["meals", "🍽️ Meals"], ["chart", "📈 Chart"], ["weekly", "📅 Weekly"], ["shopping", "🛒 Shopping"], ["supplements", "💊 Supplements"], ["tracker", "📈 Tracker"], ["whatsapp", "💬 WhatsApp"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "14px 16px", border: "none", borderBottom: `3px solid ${tab === id ? C : "transparent"}`, background: "transparent", color: tab === id ? C : "#888", cursor: "pointer", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", transition: "all 0.15s" }}>{label}</button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        <div className="glass-card" style={{ borderRadius: 24, padding: "30px", border: "1px solid #fff" }}>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div>
              <h2 style={{ fontWeight: 900, fontSize: 19, marginBottom: 20, color: "#1a1a1a" }}>📊 Plan Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12, marginBottom: 24 }}>
                {[["🎯 Goal", client.goal], ["⚡ Cal Adjustment", (GOAL_CFG[client.goal]?.adj > 0 ? "+" : "") + GOAL_CFG[client.goal]?.adj + " kcal"], ["🔥 Target Calories", metrics.targetCal + " kcal/day"], ["🥩 Protein", metrics.protein + "g/day"], ["🌾 Carbs", metrics.carbs + "g/day"], ["🥑 Fat", metrics.fat + "g/day"], ["💧 Water", metrics.water + "L/day"], ["🧬 BMI", `${metrics.bmi} — ${metrics.bmiLabel}`], ["🩺 Medical", client.medical || "None"], ["⚠️ Allergens", Array.isArray(client.allergies) && client.allergies.length > 0 ? client.allergies.join(", ") : "None"]].map(([l, v]) => (
                  <div key={l} style={{ background: "#f8f9fa", borderRadius: 12, padding: "14px 16px", borderLeft: `4px solid ${C}` }}>
                    <div style={{ fontSize: 11, color: "#999", marginBottom: 3 }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{v}</div>
                  </div>
                ))}
              </div>
              
              {/* Allergen Warning Banner */}
              {Array.isArray(client.allergies) && client.allergies.length > 0 && (
                <div style={{ background: "#fff9c4", border: "1px solid #fbc02d", borderRadius: 12, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
                   <div style={{ fontSize: 24 }}>⚠️</div>
                   <div>
                     <div style={{ fontWeight: 800, fontSize: 14, color: "#d32f2f" }}>ALLERGEN SENSITIVITY ALERT</div>
                     <div style={{ fontSize: 12, color: "#5d4037" }}>This plan has been filtered to exclude: <b>{client.allergies.join(", ")}</b>. Always check ingredients before consumption.</div>
                   </div>
                </div>
              )}
              <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, color: "#333" }}>💡 Key Guidelines for {client.goal}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                {[`Eat every 2.5–3 hours — never skip meals`, `Drink ${metrics.water}L water spread throughout the day`, `Sleep 7–8 hours for optimal fat burn & recovery`, `Pre-workout meal 30–45 min before training`, `Post-workout protein within 45 min of training`, client.goal === "Body Building" ? "Increase calories on heavy training days" : "Avoid eating 2+ hours before bedtime", `Progress photos every Sunday morning — same time`, `Re-assess plan every 4 weeks with your trainer`].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: `${C}08`, borderRadius: 10 }}>
                    <span style={{ color: C, fontWeight: 900, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: "#444" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CHART ── */}
          {tab === "chart" && (
            <div>
              <h2 style={{ fontWeight: 900, fontSize: 19, marginBottom: 6, color: "#1a1a1a" }}>📈 Calorie Distribution by Meal</h2>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Daily target: <b style={{ color: C }}>{metrics.targetCal} kcal</b> · Total planned: <b>{sessionMeals.reduce((s,m)=>s+m.cal,0)} kcal</b></p>
              <div style={{ height: 280, marginBottom: 28 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionMeals} margin={{ top: 8, right: 8, left: -10, bottom: 8 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val, name) => [`${val} kcal`, "Calories"]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                    <ReferenceLine y={metrics.targetCal / sessionMeals.length} stroke={C} strokeDasharray="4 4" label={{ value: "Avg target", fill: C, fontSize: 11 }} />
                    <Bar dataKey="cal" radius={[6,6,0,0]}>
                      {sessionMeals.map((m, i) => <Cell key={i} fill={i % 2 === 0 ? C : `${C}80`} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, color: "#333", textTransform: "uppercase", letterSpacing: 1 }}>🥗 Macro-Nutrient Composition</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {[
                  ["🥩 Protein", sessionMeals.reduce((s, m) => s + m.p, 0) + "g", "#E53935"],
                  ["🌾 Carbs", sessionMeals.reduce((s, m) => s + m.c, 0) + "g", "#1E88E5"],
                  ["🥑 Fat", sessionMeals.reduce((s, m) => s + m.f, 0) + "g", "#43A047"]
                ].map(([l, v, col]) => (
                  <div key={l} className="glass-card premium-btn" style={{ background: "#fff", borderLeft: `5px solid ${col}`, borderRadius: 20, padding: "24px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 900, color: col }}>{v}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "meals" && (
            <div>
              <div style={{ height: 160, borderRadius: 16, background: `url(${IMAGES.MealsHeader}) center/cover`, marginBottom: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))" }}></div>
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, color: "#fff", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>🍽️ Daily Meal Plan</h2>
                    <p style={{ margin: 0, fontSize: 13, opacity: 0.8, marginTop: 4 }}>Custom nutrition for {client.goal}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {isSyncing && <span style={{ fontSize: 10, background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5 }}>☁️ Syncing...</span>}
                    {sessionMeals.some(m => m.isSwapped) && (
                      <button onClick={resetPlan} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 800, cursor: "pointer", backdropFilter: "blur(4px)" }}>↩ Reset to Original</button>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ background: `linear-gradient(135deg,${BRAND_DARK},${C})` }}>
                    {["Time", "Meal", "Foods (Chennai Market)", "Cal", "Protein", "Carbs", "Fat"].map(h => (
                      <th key={h} style={{ color: "#fff", padding: "11px 14px", textAlign: "left", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {sessionMeals.map((m, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#f9fafb" : "#fff", borderLeft: m.isSwapped ? `4px solid ${C}` : "none" }}>
                        <td style={{ padding: "11px 14px", fontWeight: 800, color: C, whiteSpace: "nowrap" }}>{m.time}</td>
                        <td style={{ padding: "11px 14px", fontWeight: 700 }}>{m.name}</td>
                        <td style={{ padding: "11px 14px", color: "#444" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ fontWeight: 800 }}>{m.foods}</div>
                            <button onClick={() => handleSwapRequest(i)} style={{ background: `${C}15`, color: C, border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 10, fontWeight: 800, cursor: "pointer", marginLeft: 8 }}>🔄 Swap</button>
                          </div>
                          {m.allergens && m.allergens.length > 0 && (
                            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                              {m.allergens.map(a => (
                                <span key={a} title={a} style={{ background: "#fff3e0", color: "#e65100", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 4, display: "flex", alignItems: "center", gap: 2 }}>
                                  {ALLERGENS[a]?.icon} {a}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "11px 14px", fontWeight: 800, textAlign: "center" }}>{m.cal}</td>
                        <td style={{ padding: "11px 14px", textAlign: "center", color: "#e53935" }}>{m.p}g</td>
                        <td style={{ padding: "11px 14px", textAlign: "center", color: "#0288d1" }}>{m.c}g</td>
                        <td style={{ padding: "11px 14px", textAlign: "center", color: "#00897b" }}>{m.f}g</td>
                      </tr>
                    ))}
                    <tr style={{ background: `linear-gradient(135deg,${BRAND_DARK},${C})` }}>
                      <td colSpan={3} style={{ padding: "11px 14px", color: "#fff", fontWeight: 900 }}>DAILY TOTAL</td>
                      <td style={{ padding: "11px 14px", color: "#fff", fontWeight: 900, textAlign: "center" }}>{totalCal}</td>
                      <td style={{ padding: "11px 14px", color: "#fff", fontWeight: 700, textAlign: "center" }}>{sessionMeals.reduce((s, m) => s + m.p, 0)}g</td>
                      <td style={{ padding: "11px 14px", color: "#fff", fontWeight: 700, textAlign: "center" }}>{sessionMeals.reduce((s, m) => s + m.c, 0)}g</td>
                      <td style={{ padding: "11px 14px", color: "#fff", fontWeight: 700, textAlign: "center" }}>{sessionMeals.reduce((s, m) => s + m.f, 0)}g</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── WEEKLY ── */}
          {tab === "weekly" && (
            <div>
              <div style={{ height: 180, borderRadius: 16, background: `url(${IMAGES[client.goal]}) center/cover`, marginBottom: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}></div>
                <div style={{ position: "absolute", bottom: 20, left: 20, color: "#fff", zIndex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#ffe082", marginBottom: 4 }}>Training Protocol</div>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>{client.goal} Program</h2>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {DAYS.map((day, i) => {
                  const w = (WORKOUT_SCHEDULES[client.goal] || WORKOUT_SCHEDULES.Maintenance)[i];
                  const rest = w.toLowerCase().includes("rest") || w.toLowerCase().includes("recovery");
                  const det = WORKOUT_DETAILS[w] || { img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=200&q=80", min: "45", ex: 8, int: 3 };

                  if (rest) {
                    return (
                      <div key={day} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px", background: "#f8f9fa", borderRadius: 16, border: "1px solid #eee" }}>
                        <div style={{ width: 68, height: 68, borderRadius: 12, background: "#efefef", display: "flex", alignItems: "center", justify: "center", fontSize: 24, justifyContent: "center" }}>😴</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{day}</div>
                          <div style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a", marginTop: 2 }}>{w}</div>
                          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Hydration & active recovery</div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={day} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      <div onClick={() => setExpandedDay(expandedDay === day ? null : day)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px", background: "#fff", borderRadius: expandedDay === day ? "16px 16px 0 0" : 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0", transition: "background 0.2s", cursor: "pointer" }}>
                        <img src={det.img} style={{ width: 76, height: 76, borderRadius: 14, objectFit: "cover", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 13, color: C, textTransform: "uppercase", letterSpacing: 0.5 }}>{day}</div>
                          <div style={{ fontWeight: 900, fontSize: 16, color: "#1a1a1a", margin: "2px 0 4px" }}>{w}</div>
                          <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>9 Exercises • 3 Sets x 15 Reps</div>
                          <div style={{ marginTop: 4, letterSpacing: 2 }}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <span key={idx} style={{ color: idx < det.int ? "#2196f3" : "#e0e0e0", fontSize: 12 }}>⚡</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ padding: "0 10px", fontSize: 18, color: "#ccc" }}>{expandedDay === day ? "▲" : "▼"}</div>
                      </div>
                      
                      {expandedDay === day && (
                        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderTop: "none", borderRadius: "0 0 16px 16px", padding: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                          <div style={{ fontWeight: 800, fontSize: 12, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Daily Routine</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {getExercisesForWorkout(w).map((ex, idx) => (
                              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "#f8f9fa", borderRadius: 10, borderLeft: `3px solid ${C}` }}>
                                <div>
                                  <div style={{ fontWeight: 800, fontSize: 13, color: "#1a1a1a" }}>{idx + 1}. {ex.name}</div>
                                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{ex.sets} Sets × {ex.reps} Reps</div>
                                </div>
                                <a href={ex.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: "#ffe082", color: "#d84315", fontSize: 11, fontWeight: 800, padding: "6px 12px", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 4 }}>
                                  <span>▶</span> Video
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SHOPPING ── */}
          {tab === "shopping" && (
            <div>
              <div style={{ height: 140, borderRadius: 16, background: `url(${IMAGES.ShoppingHeader}) center/cover`, marginBottom: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3))" }}></div>
                <div style={{ position: "absolute", bottom: 20, left: 20, color: "#fff", zIndex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>🛒 Weekly Shopping List</h2>
                  <p style={{ margin: 0, fontSize: 13, opacity: 0.8, marginTop: 4 }}>Chennai Local Market Guide</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12, marginBottom: 20 }}>
                {shop.map((s, i) => (
                  <div key={i} style={{ background: "#f8f9fa", borderRadius: 12, padding: "16px", borderLeft: `4px solid ${C}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 900, color: C, fontSize: 14 }}>{s.cat}</span>
                      <span style={{ background: `${C}15`, color: C, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 800 }}>{s.cost}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>{s.items}</div>
                    <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: "#999" }}>Qty: {s.qty}</div>
                        <div style={{ display: "flex", gap: 6 }}>
                           <a href={`https://www.bigbasket.com/ps/?q=${encodeURIComponent(s.cat + " " + s.items.split(',')[0])}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", background: "#fff", padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 11, fontWeight: 800, color: "#e65100" }}>🛒 BigBasket</a>
                           <a href={`https://www.zeptonow.com/search?q=${encodeURIComponent(s.cat + " " + s.items.split(',')[0])}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", background: "#fff", padding: "4px 8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 11, fontWeight: 800, color: "#5e35b1" }}>⚡ Zepto</a>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: `${C}10`, borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#555", marginBottom: 12 }}>
                💡 <b>Shopping Tips:</b> Koyambedu Market (best prices & fresh produce) • Spencer's / Nilgiris (quality packaged goods) • Aavin booth (fresh dairy) • Buy proteins weekly, dry goods monthly.
              </div>

              {/* WhatsApp Grocery Sender */}
              <div style={{ background: "#e8f5e9", borderRadius: 12, padding: "16px", border: "1px solid #a5d6a7" }}>
                <div style={{ fontWeight: 800, color: "#2e7d32", marginBottom: 8, fontSize: 14 }}>📲 Send Grocery List to Member via WhatsApp</div>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 14 }}>Formats the full shopping list and opens WhatsApp with the message pre-filled for {client.name}.</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {client.phone && (
                    <a
                      href={`https://wa.me/91${client.phone.replace(/\D/g,"")}?text=${encodeURIComponent(
                        `🛒 *Weekly Grocery List for ${client.name}*\n🏋️ Goal: ${client.goal} | Step2 Fitness\n\n` +
                        shop.map(s => `*${s.cat}*\n${s.items}\nQty: ${s.qty} | Est: ${s.cost}`).join("\n\n") +
                        `\n\n_Prepared by your trainer at Step2 Fitness · 099624 44002_`
                      )}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", padding: "12px 22px", borderRadius: 10, fontWeight: 800, fontSize: 13, textDecoration: "none" }}
                    >
                      📱 WhatsApp to {client.name}
                    </a>
                  )}
                  <button
                    onClick={() => {
                      const msg = `🛒 *Weekly Grocery List for ${client.name}*\n🏋️ Goal: ${client.goal}\n\n` +
                        shop.map(s => `*${s.cat}*\n${s.items}\nQty: ${s.qty} | Est: ${s.cost}`).join("\n\n") +
                        `\n\n_Prepared by Step2 Fitness · 099624 44002_`;
                      navigator.clipboard.writeText(msg);
                    }}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #25D366", color: "#2e7d32", padding: "12px 20px", borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                    📋 Copy List
                  </button>
                  {!client.phone && (
                    <div style={{ fontSize: 11, color: "#888", alignSelf: "center" }}>💡 Add phone number in the form to enable direct WhatsApp send</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── SUPPLEMENTS ── */}
          {tab === "supplements" && (
            <div>
              <div style={{ height: 140, borderRadius: 16, background: `url(${IMAGES.SupplementsHeader}) center/cover`, marginBottom: 16, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3))" }}></div>
                <div style={{ position: "absolute", bottom: 20, left: 20, color: "#fff", zIndex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>💊 Supplement Guide</h2>
                  <p style={{ margin: 0, fontSize: 13, opacity: 0.8, marginTop: 4 }}>Optimized for {client.goal}</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>Goal-specific supplements with Indian brand recommendations, dosage &amp; timing</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14, marginBottom: 24 }}>
                {(SUPPLEMENT_PLANS[client.goal] || ["Multivitamin", "Omega-3"]).map((s, i) => {
                  const info = SUPPLEMENT_BRANDS[s] || { icon: "💊", brands: "Available at Healthkart / Amazon", dose: "As directed", timing: "As per trainer" };
                  return (
                    <div key={i} style={{ background: `linear-gradient(145deg,${C}10,#fff)`, borderRadius: 16, padding: "18px 16px", border: `1.5px solid ${C}30`, textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                      <div style={{ fontSize: 36, marginBottom: 10, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>{info.icon}</div>
                      <div style={{ fontWeight: 900, fontSize: 13, color: "#1a1a1a", marginBottom: 4 }}>{s}</div>
                      <div style={{ fontSize: 11, color: C, fontWeight: 800, marginBottom: 6, background: `${C}15`, borderRadius: 8, padding: "2px 8px", display: "inline-block" }}>📦 {info.brands.split(",")[0].trim()}</div>
                      <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>💉 Dose: <b style={{ color: "#444" }}>{info.dose}</b></div>
                      <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>🕐 Timing: <b style={{ color: "#444" }}>{info.timing}</b></div>
                      <div style={{ fontSize: 9, color: "#bbb", marginTop: 6, borderTop: "1px solid #f0f0f0", paddingTop: 5 }}>{info.brands}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: "#fff7e6", borderRadius: 12, padding: "16px", border: "1px solid #ffe082", marginBottom: 12 }}>
                <div style={{ fontWeight: 800, color: "#f57c00", marginBottom: 6 }}>⚠️ Important Note</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>Supplements are additions to a good diet — not replacements. Always consult your Step2 Fitness trainer before starting. Whey protein is the most useful for most goals.{client.medical !== "None" ? ` With ${client.medical}, consult your doctor first.` : ""}</div>
              </div>
              <div style={{ background: "#e8f5e9", borderRadius: 12, padding: "14px 16px", border: "1px solid #a5d6a7" }}>
                <div style={{ fontWeight: 800, color: "#2e7d32", marginBottom: 4 }}>🛒 Where to Buy in Chennai</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>🏪 <b>Healthkart</b> — Anna Nagar, Velachery &nbsp;|&nbsp; 🌐 <b>Amazon / Flipkart</b> &nbsp;|&nbsp; 🏋️ <b>Step2 Fitness Pro Shop</b> &nbsp;|&nbsp; 📞 Ask trainer: <b style={{ color: "#E53935" }}>099624 44002</b></div>
              </div>
            </div>
          )}

          {/* ── TRACKER ── */}
          {tab === "tracker" && (
            <div>
              <div style={{ height: 140, borderRadius: 16, background: `url(${IMAGES.TrackerHeader}) center/cover`, marginBottom: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3))" }}></div>
                <div style={{ position: "absolute", bottom: 20, left: 20, color: "#fff", zIndex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>📈 Progress Tracker</h2>
                  <p style={{ margin: 0, fontSize: 13, opacity: 0.8, marginTop: 4 }}>Weekly Body Measurements</p>
                </div>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "#666", marginBottom: 12 }}>4-Week Measurement Log (Fill weekly)</h3>
              <div style={{ overflowX: "auto", marginBottom: 28 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ background: `linear-gradient(135deg,${BRAND_DARK},${C})` }}>
                    {["Metric", "Unit", "Start", "Wk 1", "Wk 2", "Wk 3", "Wk 4", "Change", "Status"].map(h => (
                      <th key={h} style={{ color: "#fff", padding: "10px 12px", textAlign: "center", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[["Body Weight", "kg", client.weight], ["Waist", "cm", "—"], ["Chest", "cm", "—"], ["Arms", "cm", "—"], ["Thighs", "cm", "—"], ["BMI", "", metrics.bmi], ["Compliance", "%", "—"]].map(([m, u, s], i) => (
                      <tr key={m} style={{ background: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 700 }}>{m}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#aaa", fontSize: 11 }}>{u}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, color: C }}>{s}</td>
                        {[0, 1, 2, 3].map(w => <td key={w} style={{ padding: "10px 12px", textAlign: "center", color: "#ddd", fontSize: 11 }}>fill</td>)}
                        <td style={{ padding: "10px 12px", textAlign: "center", color: "#ddd", fontSize: 11 }}>auto</td>
                        <td style={{ padding: "10px 12px", textAlign: "center", fontSize: 11 }}>⏳</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {["Month 1", "Month 2", "Month 3"].map((m, i) => (
                  <div key={m} style={{ background: `linear-gradient(135deg,${C}15,${C}05)`, borderRadius: 14, padding: "18px", border: `1.5px solid ${C}25`, textAlign: "center" }}>
                    <div style={{ fontWeight: 900, fontSize: 15, color: C }}>{m}</div>
                    <div style={{ fontSize: 26, margin: "8px 0" }}>{"🎯🔥🏆"[i]}</div>
                    <div style={{ fontSize: 13, color: "#555", fontWeight: 700 }}>{client.goal === "Weight Loss" || client.goal === "Fat Loss + Tone" ? `Target: ${client.weight - (i + 1) * 3} kg` : client.goal === "Body Building" || client.goal === "Lean Muscle" ? `+${(i + 1) * 1.5}kg lean mass` : ["Build habit", "Add intensity", "Peak form"][i]}</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{["Consistency focus", "Progress check-in", "Goal achieved"][i]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TRACKER (Food Diary) ── */}
          {tab === "tracker" && <TrackerTab client={client} metrics={metrics} meals={meals} C={C} />}

          {/* ── WHATSAPP ── */}
          {tab === "whatsapp" && (
            <div>
              <h2 style={{ fontWeight: 900, fontSize: 19, marginBottom: 20, color: "#1a1a1a" }}>💬 WhatsApp Message for Client</h2>
              <div style={{ background: "#e8f5e9", borderRadius: 14, padding: "20px", border: "1.5px solid #81c784", marginBottom: 16, fontFamily: "monospace", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "#1b5e20" }}>
                {getWhatsAppMessage(client, metrics)}
              </div>
              <button onClick={() => { navigator.clipboard.writeText(getWhatsAppMessage(client, metrics)); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ padding: "12px 28px", background: copied ? "#2e7d32" : "#25D366", border: "none", color: "#fff", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: 14 }}>
                {copied ? "✅ Copied!" : "📋 Copy Message"}
              </button>
            </div>
          )}

        </div>

        {/* ── SWAP MODAL ── */}
        {swapTarget !== null && (
          <div className="page-transition" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 640, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
              <div style={{ padding: "24px", background: `linear-gradient(135deg,${BRAND_DARK},${C})`, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 20 }}>Step2 AI Smart Swaps 🔄</div>
                  <div style={{ fontSize: 13, opacity: 0.9 }}>Macro-equivalent alternatives for "{sessionMeals[swapTarget].name}"</div>
                </div>
                <button onClick={() => setSwapTarget(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", fontSize: 24, borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
              
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", background: "#fdfdfd" }}>
                <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "2px solid #f0f0f0" }}>
                   <div style={{ fontSize: 11, fontWeight: 900, color: "#999", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Current Selection</div>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#333" }}>{sessionMeals[swapTarget].foods}</div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: C }}>{sessionMeals[swapTarget].cal} kcal</div>
                        <div style={{ fontSize: 11, color: "#888" }}>P: {sessionMeals[swapTarget].p}g | C: {sessionMeals[swapTarget].c}g | F: {sessionMeals[swapTarget].f}g</div>
                      </div>
                   </div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 900, color: "#aaa", marginTop: 12, textAlign: "center", position: "relative" }}>
                   <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#eee", zIndex: 0 }}></div>
                   <span style={{ background: "#fdfdfd", padding: "0 10px", position: "relative", zIndex: 1 }}>SELECT A SMART SWAP</span>
                </div>

                {alternatives.map((alt, idx) => {
                  const pDiff = alt.newMacros.p - sessionMeals[swapTarget].p;
                  const cDiff = alt.newMacros.c - sessionMeals[swapTarget].c;
                  return (
                    <div key={idx} onClick={() => applySwap(alt)} style={{ background: "#fff", border: "1.5px solid #eee", borderRadius: 16, padding: "18px", cursor: "pointer", transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)", position: "relative", overflow: "hidden" }} onMouseOver={e => { e.currentTarget.style.borderColor = C; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)" }} onMouseOut={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <div>
                             <div style={{ fontWeight: 900, fontSize: 17, color: "#1a1a1a" }}>{alt.name}</div>
                             <div style={{ fontSize: 13, color: C, fontWeight: 800, marginTop: 2 }}>Portion: {alt.displayQty}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                             <div style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a" }}>{alt.newMacros.cal} kcal</div>
                             <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 4 }}>
                               <span style={{ fontSize: 10, background: pDiff >= 0 ? "#e8f5e9" : "#ffebee", color: pDiff >= 0 ? "#2e7d32" : "#d32f2f", fontWeight: 800, padding: "2px 6px", borderRadius: 4 }}>
                                 {pDiff >= 0 ? `+${pDiff}` : pDiff}g Prot
                               </span>
                               <span style={{ fontSize: 10, background: "#f1f1f1", color: "#666", fontWeight: 800, padding: "2px 6px", borderRadius: 4 }}>
                                 {alt.newMacros.c}g Carb
                               </span>
                             </div>
                          </div>
                       </div>
                       <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {alt.tags.slice(0,3).map(t => <span key={t} style={{ fontSize: 9, background: "#f8f9fa", padding: "3px 10px", borderRadius: 6, color: "#888", fontWeight: 700, border: "1px solid #eee" }}>{t}</span>)}
                       </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: "20px", background: "#fff", borderTop: "1px solid #eee", textAlign: "center", fontSize: 12, color: "#666", fontWeight: 600 }}>
                 💡 Pick the one that fits your taste today! <br/>
                 <span style={{ fontSize: 10, color: "#999", fontWeight: 400 }}>Engineered for Step2 Fitness Studio Network</span>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTION BUTTONS ── */}
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button onClick={() => exportPDF(plan.client, plan.metrics, sessionMeals, plan.shop, plan.gc, purchaseDuration)} style={{ flex: 1, minWidth: 150, padding: "14px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${BRAND_DARK},${C})`, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 16px ${C}40` }}>⬇ Export PDF</button>
          <button onClick={() => { setForm({ ...client, age: String(client.age), height: String(client.height), weight: String(client.weight) }); setPage("form") }} style={{ flex: 1, minWidth: 150, padding: "14px", borderRadius: 12, border: `2px solid ${C}`, background: "#fff", color: C, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>✏️ Edit Plan</button>
          <button onClick={() => setPage("home")} style={{ flex: 1, minWidth: 150, padding: "14px", borderRadius: 12, border: "2px solid #ddd", background: "#fff", color: "#666", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>➕ New Client</button>
        </div>
      </div>
    </div>
  );
}

function TrackerTab({ client, metrics, meals, C }) {
  const { user } = useAuth();
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [isLogging, setIsLogging] = React.useState(false);

  React.useEffect(() => {
    if (client.id) {
      fetchMemberLogs(client.id).then(data => {
        setLogs(data);
        setLoading(false);
      });
    }
  }, [client.id]);

  const handleLog = async (food) => {
    setIsLogging(true);
    try {
      const newLog = await logMeal(client.id, user.id, {
        name: food.name,
        cal: food.cal,
        p: food.p,
        c: food.c,
        f: food.f,
        type: "Direct Log"
      });
      setLogs([newLog, ...logs]);
      setSearch("");
    } catch (e) {
      alert("Error logging meal");
    } finally {
      setIsLogging(false);
    }
  };

  const filteredFood = FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
  const todayTotal = logs.filter(l => new Date(l.logged_at).toDateString() === new Date().toDateString()).reduce((s, l) => s + l.calories, 0);

  return (
    <div>
      <h2 style={{ fontWeight: 900, fontSize: 19, marginBottom: 6, color: "#1a1a1a" }}>📖 Member Food Diary</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Real-time meal tracking and calorie compliance.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
        {/* Logger */}
        <div>
          <div style={{ background: "#f8f9fa", borderRadius: 16, padding: "20px", border: "1.5px solid #eee" }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>➕ Log a Meal</div>
            <input 
               value={search} onChange={e => setSearch(e.target.value)}
               placeholder="Search food (e.g. Idli, Chicken...)" 
               style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, outline: "none" }}
            />
            {search && (
              <div style={{ marginTop: 8, background: "#fff", border: "1.5px solid #eee", borderRadius: 10, overflow: "hidden" }}>
                {filteredFood.map(f => (
                  <div key={f.name} onClick={() => !isLogging && handleLog(f)} style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0", cursor: isLogging ? "wait" : "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }} onMouseOver={e => e.currentTarget.style.background = "#f8f9fa"} onMouseOut={e => e.currentTarget.style.background = "#fff"}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: "#999" }}>{f.unit} · {f.cal} kcal</div>
                    </div>
                    <span style={{ fontSize: 18 }}>➕</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 20, background: `linear-gradient(135deg,${C},${C}dd)`, borderRadius: 16, padding: "20px", color: "#fff" }}>
            <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.8, textTransform: "uppercase" }}>Today's Consumption</div>
            <div style={{ fontSize: 32, fontWeight: 900, margin: "4px 0" }}>{todayTotal} <span style={{ fontSize: 14, opacity: 0.8 }}>/ {metrics.targetCal} kcal</span></div>
            <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 10, marginTop: 12, overflow: "hidden" }}>
               <div style={{ width: `${Math.min(100, (todayTotal/metrics.targetCal)*100)}%`, height: "100%", background: "#fff", borderRadius: 10 }}></div>
            </div>
          </div>
        </div>

        {/* Log History */}
        <div>
           <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>🕒 Recent Logs (Live Feed)</div>
           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {logs.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#bbb", background: "#fafafa", borderRadius: 16, border: "1.5px dashed #eee" }}>No logs found yet.</div>
              ) : (
                logs.slice(0, 10).map(l => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fdfdfd", border: "1px solid #f0f0f0", borderRadius: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{l.food_name}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{new Date(l.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {l.meal_type}</div>
                    </div>
                    <div style={{ fontWeight: 900, color: C }}>{l.calories} kcal</div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
