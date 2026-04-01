import React, { useEffect } from "react";
import { BRAND, UPI_ID, UPI_NAME } from "../data/constants";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Payment({ isProcessing, selectedPrice, purchaseDuration, paymentMethod, setPaymentMethod, processPayment, clientName, clientPhone }) {

  useEffect(() => { loadRazorpayScript(); }, []);

  const openRazorpay = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded || !RAZORPAY_KEY) {
      alert("⚠️ Razorpay not configured. Add VITE_RAZORPAY_KEY_ID to .env.local\nFalling back to simulation.");
      processPayment();
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: selectedPrice * 100, // paise
      currency: "INR",
      name: "Step2 Fitness Studio",
      description: `Diet Plan Brain — ${purchaseDuration} Premium`,
      image: "/favicon.ico",
      prefill: { name: clientName || "", contact: clientPhone || "" },
      theme: { color: BRAND },
      handler: function (response) {
        console.log("Payment success:", response.razorpay_payment_id);
        processPayment(); // unlock the plan
      },
      modal: { ondismiss: () => console.log("Payment dismissed") },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", minHeight: "100vh", background: "#f0f2f5", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        {isProcessing ? (
          <div style={{ background: "#fff", padding: "50px 40px", borderRadius: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: 400, width: "100%" }}>
            <div style={{ width: 60, height: 60, border: "5px solid #f3f3f3", borderTop: `5px solid ${BRAND}`, borderRadius: "50%", margin: "0 auto 24px", animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>Processing Payment...</h2>
            <p style={{ marginTop: 8, color: "#666", fontSize: 14 }}>Securely verifying transaction</p>
            <div style={{ marginTop: 24, padding: "12px", background: "#f8f9fb", borderRadius: 12, fontSize: 12, color: "#888" }}>
              🔒 256-bit SSL Encrypted
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 10px 40px rgba(0,0,0,0.08)", width: "100%", maxWidth: 500, overflow: "hidden" }}>
            {/* Price Header */}
            <div style={{ background: `linear-gradient(135deg,#B71C1C,${BRAND})`, padding: "28px", color: "#fff", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.8, textTransform: "uppercase", letterSpacing: 1 }}>Amount to Pay</div>
              <div style={{ fontSize: 42, fontWeight: 900, marginTop: 4 }}>₹{selectedPrice}</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Plan: {purchaseDuration} Premium</div>
            </div>

            <div style={{ padding: "28px" }}>
              <h3 style={{ margin: "0 0 18px 0", fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>Select Payment Method</h3>

              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {[
                  { id: "UPI", icon: "📱", label: "UPI / QR Scan" },
                  { id: "RAZORPAY", icon: "💳", label: "Card / NetBanking" },
                ].map(m => (
                  <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{ flex: 1, padding: "16px 10px", borderRadius: 14, border: `2px solid ${paymentMethod === m.id ? BRAND : "#f0f0f0"}`, background: paymentMethod === m.id ? `${BRAND}08` : "#fff", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: paymentMethod === m.id ? BRAND : "#666" }}>{m.label}</div>
                  </button>
                ))}
              </div>

              {paymentMethod === "UPI" ? (
                <div style={{ textAlign: "center", background: "#f8f9fb", padding: "24px", borderRadius: 20, border: "1.5px dashed #d0d7de" }}>
                  <div style={{ width: 148, height: 148, background: "#fff", margin: "0 auto 14px", borderRadius: 12, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                    <img
                      src="/payment-qr.jpg"
                      onError={e => { e.target.onerror = null; e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${selectedPrice}&cu=INR`; }}
                      alt="UPI QR Code"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <p style={{ fontSize: 14, color: "#333", margin: "0 0 6px 0", fontWeight: 700 }}>Scan & Pay ₹{selectedPrice}</p>
                  <p style={{ fontSize: 11, color: "#888", margin: "0 0 16px 0" }}>{UPI_NAME} · {UPI_ID}</p>
                  <a href={`upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${selectedPrice}&cu=INR`} style={{ display: "inline-block", background: "#fff", color: "#1a1a1a", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: "none", border: "1px solid #ddd" }}>
                    📱 Open UPI App
                  </a>
                  <div style={{ marginTop: 16, padding: "10px", background: "#fff3e0", borderRadius: 8, fontSize: 11, color: "#e65100" }}>
                    💡 After paying, click "Complete Payment" below to unlock your plan
                  </div>
                </div>
              ) : (
                <div style={{ background: "#f8f9fb", borderRadius: 16, padding: "20px", textAlign: "center", border: "1.5px solid #e8eaf6" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#333", marginBottom: 6 }}>Pay with Razorpay</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Supports Debit Card, Credit Card, Net Banking, UPI & Wallets</div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
                    {["Visa", "Mastercard", "UPI", "Paytm", "NetBanking"].map(p => (
                      <span key={p} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "#555" }}>{p}</span>
                    ))}
                  </div>
                  {!RAZORPAY_KEY && (
                    <div style={{ background: "#fff3e0", borderRadius: 8, padding: "10px 14px", fontSize: 11, color: "#e65100", marginBottom: 12 }}>
                      ⚠️ Razorpay key not set. Add <b>VITE_RAZORPAY_KEY_ID</b> to .env.local — will simulate for now.
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={paymentMethod === "RAZORPAY" ? openRazorpay : processPayment}
                style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: `linear-gradient(135deg,#B71C1C,${BRAND})`, color: "#fff", fontWeight: 900, fontSize: 15, marginTop: 20, cursor: "pointer", boxShadow: `0 8px 20px ${BRAND}40`, letterSpacing: 0.3 }}>
                {paymentMethod === "RAZORPAY" ? "💳 Pay with Razorpay" : "✅ Complete Payment & Unlock Plan"}
              </button>

              <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 14 }}>
                🔒 Secured by Razorpay / Supabase · By continuing, you agree to Step2 Fitness Terms.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
