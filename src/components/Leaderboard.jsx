import React from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Step2 Fitness Community Leaderboard
 * Shows top performers across the studio branch.
 */

export default function Leaderboard({ trainerId, color = "#E53935" }) {
  const [topMembers, setTopMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("members")
        .select("id, name, points, streak_count")
        .eq("trainer_id", trainerId)
        .order("points", { ascending: false })
        .limit(5);

      if (!error) setTopMembers(data);
      setLoading(false);
    }
    if (trainerId) fetchLeaderboard();
  }, [trainerId]);

  if (loading) return <div className="skeleton" style={{ height: 300, borderRadius: 16 }}></div>;

  return (
    <div className="page-transition" style={{ background: "#fff", borderRadius: 24, padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1.5px solid #eee" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, fontSize: 20 }}>🏆 Community Leaderboard</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#888" }}>Step2 Performance Members</p>
        </div>
        <div style={{ background: `${color}15`, color: color, padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>Weekly Stats</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topMembers.map((m, idx) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px", background: idx === 0 ? `${color}05` : "transparent", borderRadius: 16, border: idx === 0 ? `1.5px solid ${color}15` : "1.5px solid transparent" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: idx === 0 ? color : "#ddd", width: 30, textAlign: "center" }}>
               {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
            </div>
            <div style={{ flex: 1 }}>
               <div style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>{m.name}</div>
               <div style={{ fontSize: 11, color: "#999", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#f57c00", fontWeight: 800 }}>🔥 {m.streak_count || 0} Day Streak</span>
               </div>
            </div>
            <div style={{ textAlign: "right" }}>
               <div style={{ fontSize: 18, fontWeight: 900, color: color }}>{m.points || 0}</div>
               <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>Points</div>
            </div>
          </div>
        ))}
        {topMembers.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No points logged yet. Let's get moving! 🚀</div>}
      </div>

      <div style={{ marginTop: 24, padding: "12px", background: "#f8f9fa", borderRadius: 12, textAlign: "center", fontSize: 10, color: "#999", lineHeight: 1.5 }}>
         Points are awarded for logging meals (+10) and maintaining daily streaks (+50 weekly bonus).
      </div>
    </div>
  );
}
