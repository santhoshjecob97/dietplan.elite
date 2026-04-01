import React, { useState, useEffect } from "react";
import { BRAND, BRAND_DARK } from "../data/constants";
import { fetchMembersWithPlans } from "../hooks/usePlans";
import { fetchTrainerLogs, fetchMemberLogs } from "../hooks/useFoodLogs";
import Leaderboard from "./Leaderboard";
import { analyzePerformance } from "../utils/aiCopilot";
import { useAuth } from "../context/AuthContext";
import { exportWeeklyReport } from "../utils/pdfGenerator";

export default function MembersDashboard({ setPage, setForm, setPlan, setBulkMemberIds }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [goalFilter, setGoalFilter] = useState("All");
  const [selectedIndices, setSelectedIndices] = useState([]); // for bulk actions
  const [historyMember, setHistoryMember] = useState(null); // for version history modal
  const [reportMember, setReportMember] = useState(null); // for weekly report modal
  const [versions, setVersions] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [memberLogs, setMemberLogs] = useState([]);
  const [aiReport, setAiReport] = useState(null); // for AI Analysis modal

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const [mList, lList] = await Promise.all([
          fetchMembersWithPlans(user.id),
          fetchTrainerLogs(user.id)
        ]);
        setMembers(mList);
        setRecentLogs(lList);
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const goals = ["All", "Weight Loss", "Body Building", "Fat Loss + Tone", "Lean Muscle", "CrossFit", "Sports Performance", "Maintenance"];
  const filtered = members.filter(m => {
    const nameMatch = m.name?.toLowerCase().includes(search.toLowerCase());
    const goalMatch = goalFilter === "All" || m.goal === goalFilter;
    return nameMatch && goalMatch;
  });

  const activePlan = (m) => m.plans?.find(p => p.is_active) || m.plans?.[0];

  const loadPlan = (member) => {
    const ap = activePlan(member);
    if (!ap?.plan_data) return;
    setForm({ ...member, age: String(member.age || ""), height: String(member.height || ""), weight: String(member.weight || "") });
    setPlan(ap.plan_data);
    setPage("plan");
  };

  const toggleSelect = (id) => {
    setSelectedIndices(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const openHistory = async (member) => {
    setHistoryMember(member);
    const { fetchPlanVersions } = await import("../hooks/usePlans");
    const data = await fetchPlanVersions(member.id);
    setVersions(data);
  };

  const restoreVersion = (v) => {
    if (!v.snapshot?.plan_data) return;
    setForm({ ...historyMember, age: String(historyMember.age || ""), height: String(historyMember.height || ""), weight: String(historyMember.weight || "") });
    setPlan(v.snapshot.plan_data);
    setPage("plan");
    setHistoryMember(null);
  };

  const bulkAssign = () => {
    if (selectedIndices.length === 0) return;
    const first = members.find(m => m.id === selectedIndices[0]);
    if (!first) return;
    
    setBulkMemberIds(selectedIndices);
    setForm({ ...first, name: "BULK ASSIGN", phone: "", age: String(first.age || ""), height: String(first.height || ""), weight: String(first.weight || "") });
    setPage("form");
    alert(`⚡ Bulk Mode: Designing a plan for ${selectedIndices.length} members.`);
  };

  const openReport = async (member) => {
    setReportMember(member);
    const logs = await fetchMemberLogs(member.id);
    setMemberLogs(logs);
  };

  const openAiAnalysis = async (member) => {
    const ap = activePlan(member);
    if (!ap) return alert("Member needs an active plan for AI analysis.");
    
    setLoading(true);
    const logs = await fetchMemberLogs(member.id);
    const analysis = analyzePerformance(member, logs, ap.metrics);
    setAiReport({ member, ...analysis });
    setLoading(false);
  };

  const goalColors = {
    "Weight Loss": "#E53935", "Body Building": "#5e35b1", "Fat Loss + Tone": "#e91e63",
    "Lean Muscle": "#00897b", "CrossFit": "#f57c00", "Sports Performance": "#0288d1", "Maintenance": "#546e7a",
  };

  if (loading) return (
    <div className="page-transition" style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <div className="skeleton" style={{ height: 40, width: 250, marginBottom: 30 }}></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, height: 280, padding: 20, border: "1.5px solid #eee" }}>
            <div className="skeleton" style={{ height: 5, width: "100%", marginBottom: 15 }}></div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
               <div className="skeleton" style={{ width: 40, height: 40, borderRadius: "50%" }}></div>
               <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 20, width: "70%", marginBottom: 8 }}></div>
                  <div className="skeleton" style={{ height: 12, width: "40%" }}></div>
               </div>
            </div>
            <div className="skeleton" style={{ height: 80, width: "100%", marginBottom: 20 }}></div>
            <div style={{ display: "flex", gap: 8 }}>
               <div className="skeleton" style={{ flex: 1, height: 40, borderRadius: 10 }}></div>
               <div className="skeleton" style={{ flex: 1, height: 40, borderRadius: 10 }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="page-transition" style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${BRAND_DARK},${BRAND})`, padding: "24px 20px 20px", color: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" }}>Step2 Fitness Trainer Dashboard</div>
          <div style={{ fontSize: 26, fontWeight: 900 }}>👥 Members & Plans</div>
          <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
            {[
              ["Total Members", members.length],
              ["Active Plans", members.filter(m => activePlan(m)).length],
              ["This Month", members.filter(m => new Date(m.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length],
            ].map(([label, val]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{val}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>{label}</div>
              </div>
            ))}
            <button onClick={() => setPage("form")} style={{ marginLeft: "auto", background: "#fff", color: BRAND, border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              ➕ New Client Plan
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 40px", display: "grid", gridTemplateColumns: window.innerWidth < 1000 ? "1fr" : "1fr 360px", gap: 32, alignItems: "start" }}>
        {/* Main List Area */}
        <div className="page-transition">
          {/* Search & Filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by name..."
              style={{ flex: 1, minWidth: 220, padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", background: "#fff" }}
            />
            <select value={goalFilter} onChange={e => setGoalFilter(e.target.value)}
              style={{ padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 13, outline: "none", background: "#fff", cursor: "pointer" }}>
              {goals.map(g => <option key={g}>{g}</option>)}
            </select>
            
            {selectedIndices.length > 0 && (
              <div style={{ background: "#fff", border: `1.5px solid ${BRAND}`, borderRadius: 12, padding: "8px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: BRAND }}>{selectedIndices.length} selected</span>
                <button onClick={bulkAssign} style={{ background: BRAND, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>⚡ Bulk Assign</button>
                <button onClick={() => setSelectedIndices([])} style={{ background: "none", border: "none", color: "#888", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>No members found</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
              {filtered.map(member => {
                const ap = activePlan(member);
                const gc = goalColors[member.goal] || BRAND;
                const isSelected = selectedIndices.includes(member.id);

                return (
                  <div key={member.id} className="glass-card page-transition" style={{ borderRadius: 24, overflow: "hidden", position: "relative", transition: "transform 0.3s ease", cursor: "default" }}>
                    <label className="premium-btn" style={{ position: "absolute", top: 16, left: 16, zIndex: 2, cursor: "pointer", background: "rgba(255,255,255,0.8)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ddd", backdropFilter: "blur(4px)" }}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(member.id)} style={{ cursor: "pointer" }} />
                    </label>
                    <div style={{ height: 6, background: gc }} />
                    <div style={{ padding: "24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: "#111", letterSpacing: -0.3 }}>{member.name}</h3>
                          <div style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                             <span style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>🆔 {member.id.split('-')[0].toUpperCase()}</span>
                             <span style={{ color: BRAND, fontWeight: 900, display: "flex", alignItems: "center", gap: 3 }}>
                               <span style={{ fontSize: 14 }}>🔥</span> {member.streak_count || 0} DAY STREAK
                             </span>
                          </div>
                        </div>
                        <div style={{ background: `linear-gradient(135deg, ${BRAND}15, ${BRAND}05)`, color: BRAND, padding: "10px 14px", borderRadius: 16, textAlign: "center", border: `1px solid ${BRAND}20` }}>
                           <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1 }}>{member.points || 0}</div>
                           <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", marginTop: 2, letterSpacing: 1 }}>Pts</div>
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button onClick={() => ap && loadPlan(member)} disabled={!ap} className="premium-btn" style={{ flex: 1, padding: "12px", background: ap ? `linear-gradient(135deg,${BRAND_DARK},${BRAND})` : "#f0f0f0", border: "none", borderRadius: 14, color: ap ? "#fff" : "#aaa", fontWeight: 800, fontSize: 11, cursor: "pointer" }}>👁 VIEW PLAN</button>
                        <button onClick={() => openHistory(member)} className="premium-btn" style={{ padding: "12px", background: "#fff", border: "1.5px solid #eee", borderRadius: 14, color: "#666", fontWeight: 800, fontSize: 11, cursor: "pointer" }}>🕒</button>
                        <button onClick={() => openReport(member)} className="premium-btn" style={{ padding: "12px", background: "#fff", border: `1.5px solid ${BRAND}30`, borderRadius: 14, color: BRAND, fontWeight: 800, fontSize: 11, cursor: "pointer" }}>📊</button>
                        <button onClick={() => openAiAnalysis(member)} className="premium-btn" style={{ flex: 1, padding: "12px", background: "#f9fafb", border: `1.5px dashed ${BRAND}40`, borderRadius: 14, color: BRAND, fontWeight: 900, fontSize: 11, cursor: "pointer" }}>🤖 AI INSIGHT</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
           <Leaderboard trainerId={user.id} color={BRAND} />
           <div style={{ padding: "20px", background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`, borderRadius: 24, color: "#fff", boxShadow: `0 10px 30px ${BRAND}40` }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>🤖</div>
              <h4 style={{ margin: 0, fontWeight: 900, fontSize: 18 }}>Step2 AI Co-Pilot</h4>
              <p style={{ margin: "10px 0 16px 0", fontSize: 12, opacity: 0.9, lineHeight: 1.5 }}>Our AI analyzes member logs and suggests weekly goal adjustments for you.</p>
              <button disabled style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "not-allowed" }}>Coming Soon: AI Coaching</button>
           </div>
        </div>
      </div>

      {/* Modals (History & Report) */}
      {historyMember && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 600, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
             <div style={{ padding: "24px", background: `linear-gradient(135deg,${BRAND_DARK},${BRAND})`, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <div>
                 <div style={{ fontWeight: 900, fontSize: 20 }}>Plan History</div>
                 <div style={{ fontSize: 13, opacity: 0.9 }}>{historyMember.name}</div>
               </div>
               <button onClick={() => setHistoryMember(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", fontSize: 24, borderRadius: "50%", width: 36, height: 36, cursor: "pointer" }}>×</button>
             </div>
             <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
               {versions.length === 0 ? <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No history</div> : (
                 <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                   {versions.map(p => (
                     <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 16, overflow: "hidden" }}>
                       <div style={{ background: "#f8f9fa", padding: "10px 16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                         <span style={{ fontWeight: 800, fontSize: 13 }}>{p.duration}</span>
                         <span style={{ fontSize: 11, color: "#888" }}>{new Date(p.created_at).toLocaleDateString()}</span>
                       </div>
                       {p.plan_versions?.map(v => (
                         <div key={v.version_number} style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0" }}>
                            <div>
                               <div style={{ fontWeight: 700, fontSize: 14 }}>Version {v.version_number}</div>
                               <div style={{ fontSize: 12, color: "#666" }}>{v.snapshot?.metrics?.targetCal} kcal</div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => restoreVersion(v)} style={{ background: "#fff", border: `1.5px solid ${BRAND}`, color: BRAND, padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Restore</button>
                              <button style={{ padding: "6px 12px", borderRadius: 8, background: `${BRAND}10`, border: `1.5px solid ${BRAND}25`, fontSize: 11, fontWeight: 800, color: BRAND, cursor: "pointer" }}>🤖 AI Insight</button>
                            </div>
                         </div>
                       ))}
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
      {/* Weekly Report Modal */}
      {reportMember && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 800, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
             <div style={{ padding: "24px", background: `linear-gradient(135deg,${BRAND_DARK},${BRAND})`, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <div>
                 <div style={{ fontWeight: 900, fontSize: 20 }}>Weekly Performance Report</div>
                 <div style={{ fontSize: 13, opacity: 0.9 }}>{reportMember.name} • Last 7 Days</div>
               </div>
               <button onClick={() => setReportMember(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", fontSize: 24, borderRadius: "50%", width: 36, height: 36, cursor: "pointer" }}>×</button>
             </div>
             
             <div style={{ flex: 1, overflowY: "auto", padding: "30px" }}>
                {memberLogs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
                     <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
                     <div>No logs found for the last 7 days. Clients must log meals in their portal to generate this report.</div>
                  </div>
                ) : (
                  <div>
                    {/* Summary Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 30 }}>
                       {[
                         ["Daily Target", `${activePlan(reportMember)?.metrics?.targetCal || 0} kcal`],
                         ["Avg. Intake", `${Math.round(memberLogs.reduce((s, l) => s + l.calories, 0) / 7)} kcal`],
                         ["Log Entries", `${memberLogs.length} total`],
                       ].map(([l, v]) => (
                         <div key={l} style={{ background: "#f8f9fa", borderRadius: 16, padding: "20px", textAlign: "center", border: "1.5px solid #eee" }}>
                           <div style={{ fontSize: 11, fontWeight: 900, color: "#999", textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
                           <div style={{ fontSize: 24, fontWeight: 900, color: BRAND }}>{v}</div>
                         </div>
                       ))}
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}>📈 7-Day Trend</h3>
                    <div style={{ height: 200, display: "flex", alignItems: "flex-end", gap: 10, borderBottom: "2px solid #eee", paddingBottom: 10, marginBottom: 40 }}>
                       {[6,5,4,3,2,1,0].map(i => {
                          const d = new Date(); d.setDate(d.getDate() - i);
                          const dStr = d.toDateString();
                          const todayTotal = memberLogs.filter(l => new Date(l.logged_at).toDateString() === dStr).reduce((s, l) => s + l.calories, 0);
                          const target = activePlan(reportMember)?.metrics?.targetCal || 2000;
                          const height = Math.min(100, (todayTotal / (target * 1.5)) * 100);
                          return (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                               <div style={{ fontSize: 10, fontWeight: 800, marginBottom: 5, color: todayTotal > target ? "#e53935" : BRAND }}>{todayTotal}</div>
                               <div style={{ width: "100%", height: `${height}%`, background: todayTotal > target ? "#ffcdd2" : `${BRAND}30`, borderRadius: "4px 4px 0 0", borderTop: `4px solid ${todayTotal > target ? "#e53935" : BRAND}` }}></div>
                               <div style={{ fontSize: 10, marginTop: 8, color: "#888", fontWeight: 700 }}>{d.toLocaleDateString([], { weekday: 'short' })}</div>
                            </div>
                          );
                       })}
                    </div>

                    <button onClick={() => exportWeeklyReport(reportMember, memberLogs, activePlan(reportMember)?.metrics)} style={{ width: "100%", padding: "16px", background: BRAND, color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                       📥 Download Professional PDF Report
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
      {/* AI Co-Pilot Modal */}
      {aiReport && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="page-transition" style={{ background: "#fff", borderRadius: 32, width: "100%", maxWidth: 650, overflow: "hidden" }}>
             {/* Header */}
             <div style={{ padding: "30px", background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`, color: "#fff", position: "relative" }}>
                <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, opacity: 0.8, marginBottom: 8 }}>Step2 AI Co-Pilot Analysis</div>
                <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>{aiReport.member.name}</h2>
                <button onClick={() => setAiReport(null)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer" }}>×</button>
             </div>

             <div style={{ padding: "30px" }}>
                {/* Score & Summary */}
                <div style={{ display: "flex", gap: 20, marginBottom: 30, alignItems: "center" }}>
                   <div style={{ width: 100, height: 100, borderRadius: "50%", border: `6px solid ${BRAND}15`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: BRAND }}>{aiReport.score}</div>
                      <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.6 }}>SCORE</div>
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>Compliance: {aiReport.score > 80 ? "Excellent" : aiReport.score > 60 ? "Good" : "Needs Review"}</div>
                      <p style={{ margin: "4px 0 0 0", color: "#888", fontSize: 12 }}>{aiReport.summary}</p>
                   </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>🔍 Key Insights</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30 }}>
                   {aiReport.insights.map((insight, i) => (
                      <div key={i} style={{ padding: "14px", background: "#f8f9fa", borderRadius: 12, fontSize: 13, color: "#444", border: "1px solid #eee" }}>{insight}</div>
                   ))}
                </div>

                <div style={{ padding: "20px", background: BRAND + "06", borderRadius: 20, border: `1.5px dashed ${BRAND}25` }}>
                   <div style={{ fontSize: 14, fontWeight: 900, color: BRAND, marginBottom: 8 }}>🤖 AI Recommendation for Trainer</div>
                   <div style={{ fontSize: 14, lineHeight: 1.6, color: "#111", fontStyle: "italic" }}>"{aiReport.recommendation}"</div>
                </div>

                <div style={{ marginTop: 30, display: "flex", gap: 12 }}>
                   <button onClick={() => setAiReport(null)} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", background: BRAND, color: "#fff", fontWeight: 800, cursor: "pointer" }}>Got it, Thank you AI</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
