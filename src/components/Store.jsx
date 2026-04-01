import React, { useState } from "react";
import { STORE_PRODUCTS, BUNDLES } from "../data/store";
import { BRAND, BRAND_DARK } from "../data/constants";
import { useAuth } from "../context/AuthContext";

export default function Store({ setPage, setSelectedPrice }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(STORE_PRODUCTS.map(p => p.category))];
  const filtered = category === "All" ? STORE_PRODUCTS : STORE_PRODUCTS.filter(p => p.category === category);

  const addToCart = (p) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) return prev.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const total = cart.reduce((s, item) => s + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setSelectedPrice(total);
    setPage("payment");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      {/* Store Header */}
      <div style={{ background: `linear-gradient(135deg, ${BRAND_DARK}, ${BRAND})`, padding: "40px 20px", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, opacity: 0.9 }}>Step2 Fitness Pro Shop</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>Elevate Your Performance</h1>
          <p style={{ fontSize: 16, opacity: 0.8, maxWidth: 600, margin: "16px auto 0" }}>Premium supplements curated by our expert trainers to help you achieve your goals faster.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 16px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 30 }}>
        {/* Products Section */}
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 25, overflowX: "auto", paddingBottom: 10 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{ whiteSpace: "nowrap", padding: "10px 20px", borderRadius: 20, border: "none", background: category === c ? BRAND : "#fff", color: category === c ? "#fff" : "#666", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                {c}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1.5px solid #eee", display: "flex", flexDirection: "column" }}>
                <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
                   <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                   <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 10px", borderRadius: 10, fontSize: 10, fontWeight: 800 }}>{p.category}</div>
                </div>
                <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 4px 0", color: "#1a1a1a" }}>{p.name}</h3>
                  <div style={{ fontSize: 18, fontWeight: 900, color: BRAND, marginBottom: 10 }}>₹{p.price.toLocaleString()}</div>
                  <p style={{ fontSize: 12, color: "#777", lineHeight: 1.4, margin: "0 0 16px 0", flex: 1 }}>{p.description}</p>
                  <button onClick={() => addToCart(p)} style={{ width: "100%", padding: "10px", background: "#f8f9fa", border: `1.5px solid ${BRAND}`, color: BRAND, borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", height: "fit-content", position: "sticky", top: 100 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20, borderBottom: "2px solid #f0f0f0", paddingBottom: 12 }}>🛒 Your Cart</h2>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#ccc" }}>
               <div style={{ fontSize: 40, marginBottom: 10 }}>🥡</div>
               <div style={{ fontSize: 13, fontWeight: 700 }}>Your cart is empty</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 15, marginBottom: 20, maxHeight: 400, overflowY: "auto", paddingRight: 5 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", gap: 12, borderBottom: "1.5px solid #f8f9fa", paddingBottom: 15 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                      <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a1a" }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{item.qty} × ₹{item.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#f0f0f0", borderRadius: 12, padding: "16px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                   <span style={{ fontSize: 14, color: "#666" }}>Subtotal</span>
                   <span style={{ fontSize: 14, fontWeight: 800 }}>₹{total.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                   <span style={{ fontSize: 14, color: "#666" }}>GST (18%)</span>
                   <span style={{ fontSize: 14, fontWeight: 800 }}>Incl.</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1.5px solid #ddd" }}>
                   <span style={{ fontSize: 16, fontWeight: 900 }}>Total</span>
                   <span style={{ fontSize: 20, fontWeight: 900, color: BRAND }}>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={handleCheckout} style={{ width: "100%", padding: "16px", background: BRAND, color: "#fff", border: "none", borderRadius: 12, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 12px rgba(229,57,53,0.3)" }}>
                Secure Checkout
              </button>
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#999", fontWeight: 700 }}>
                🔒 Secure Payment via Razorpay
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
