import React, { useState, useEffect } from "react";
import { BRAND, BRAND_DARK } from "../data/constants";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Franchise({ setPage }) {
  const { user } = useAuth();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gym, setGym] = useState(null);

  useEffect(() => {
    if (!user) return;
    const loadFranchise = async () => {
      try {
        // Fetch gym info
        const { data: gymData } = await supabase.from("gyms").select("*").eq("id", user.gym_id).single();
        setGym(gymData);

        // Fetch all branches for this gym
        const { data: branchData } = await supabase.from("branches").select("*").eq("gym_id", user.gym_id);
        setBranches(branchData || []);
      } catch (e) {
        console.error("Franchise load error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadFranchise();
  }, [user]);

  if (loading) return <div>Loading Franchise...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f7", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`, padding: "40px 20px", color: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, opacity: 0.9 }}>Franchise Management</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>{gym?.name || "Step2 Fitness Studio"}</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{branches.length}</div>
            <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700 }}>ACTIVE BRANCHES</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 16px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>🏢 Branch Locations</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {branches.map(b => (
            <div key={b.id} style={{ background: "#fff", borderRadius: 20, padding: "24px", border: "1.5px solid #eee", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                 <div>
                    <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>{b.name}</h3>
                    <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{b.location}</div>
                 </div>
                 <div style={{ background: `${BRAND}15`, color: BRAND, padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>Active</div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                 <button style={{ flex: 1, padding: "10px", background: "#f8f9fa", border: "1.5px solid #eee", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📊 Branch Report</button>
                 <button style={{ padding: "10px", background: "#fff", border: `1.5px solid ${BRAND}`, color: BRAND, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✏️ Edit</button>
              </div>
            </div>
          ))}

          {/* Add New Branch Card */}
          <div style={{ border: "2px dashed #ccc", borderRadius: 20, padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", minHeight: 180 }}>
             <div style={{ fontSize: 32, marginBottom: 8 }}>🏢</div>
             <div style={{ fontSize: 14, fontWeight: 900, color: "#888" }}>+ Add New Branch</div>
          </div>
        </div>

        <div style={{ marginTop: 40, background: "#fff", borderRadius: 24, padding: "30px", border: "1.5px solid #eee" }}>
           <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>💳 Franchise Billing & Revenue</h3>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              <div style={{ padding: 20, background: "#f8f9fa", borderRadius: 16, border: "1px solid #eee" }}>
                 <div style={{ color: "#999", fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>Total Monthly Revenue</div>
                 <div style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a" }}>₹4,82,000</div>
              </div>
              <div style={{ padding: 20, background: "#f8f9fa", borderRadius: 16, border: "1px solid #eee" }}>
                 <div style={{ color: "#999", fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>Total Active Members</div>
                 <div style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a" }}>1,240</div>
              </div>
              <div style={{ padding: 20, background: "#f8f9fa", borderRadius: 16, border: "1px solid #eee" }}>
                 <div style={{ color: "#999", fontSize: 11, fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>Subscription Plan</div>
                 <div style={{ fontSize: 24, fontWeight: 900, color: BRAND }}>Premium Enterprise</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
