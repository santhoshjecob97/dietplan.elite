import React, { useState } from "react";
import { 
  BRAND, 
  BRAND_DARK
} from "./data/constants";
import { GOAL_CFG } from "./data/goals";
import { generateMealPlan } from "./data/meals";
import { generateShoppingList } from "./data/shopping";
import { calculateAllMetrics } from "./utils/calculations";
import { useAuth } from "./context/AuthContext";
import { upsertMember, savePlan } from "./hooks/usePlans";

// Sub-components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import PlanForm from "./components/PlanForm";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import PlanView from "./components/PlanView";
import MembersDashboard from "./components/MembersDashboard";
import Store from "./components/Store";
import Franchise from "./components/Franchise";

export default function DietPlanBrain() {
  const { user } = useAuth();
  const [page, setPage] = useState("home");
  const [form, setForm] = useState({ 
    name: "", phone: "", age: "", gender: "M", height: "", weight: "", 
    goal: "Weight Loss", activity: "Moderate", medical: "None", 
    vegetarian: "No", allergies: [], notes: "" 
  });
  const [plan, setPlan] = useState(null);
  const [tab, setTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [purchaseDuration, setPurchaseDuration] = useState("Week 4");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "saved" | "error"
  const [bulkMemberIds, setBulkMemberIds] = useState([]); // for bulk assignment

  const setFormValue = (k, v) => setForm(p => ({ ...p, [k]: v }));
  
  const generate = () => {
    if (!form.name || !form.age || !form.height || !form.weight) return;
    const c = { ...form, age: +form.age, height: +form.height, weight: +form.weight };
    const metrics = calculateAllMetrics(c);
    const meals = generateMealPlan(c.goal, c.vegetarian, c.medical, metrics.targetCal, c.allergies);
    const shop = generateShoppingList(c.goal, c.vegetarian);
    const goalCfg = GOAL_CFG[c.goal] || GOAL_CFG.Maintenance;
    
    setPlan({ client: c, metrics, meals, shop, gc: goalCfg });
    setPage("checkout");
  };

  const unlockPlan = async (dur) => {
    setPurchaseDuration(dur);
    setUnlocked(true);
    setPage("plan");
    setTab("overview");
    await autoSavePlan(dur);
  };

  const startPayment = (dur, price) => {
    setPurchaseDuration(dur);
    setSelectedPrice(price);
    setPage("payment");
  };

  const processPayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_XXXXXXXXXXXXXX", // Trainer: Replace with your LIVE Razorpay Key ID
      amount: selectedPrice * 100, // Amount in paise
      currency: "INR",
      name: "Step2 Fitness",
      description: `${purchaseDuration} Transformation Plan`,
      image: "https://i.imgur.com/your-logo.png",
      handler: async function (response) {
        // Payment success
        setIsProcessing(true);
        setTimeout(async () => {
          setIsProcessing(false);
          setUnlocked(true);
          setPage("plan");
          setTab("overview");
          await autoSavePlan(purchaseDuration);
          alert("⚡ Payment Successful! Plan Unlocked.");
        }, 1500);
      },
      prefill: {
        name: form.name,
        contact: form.phone,
      },
      theme: { color: BRAND },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const autoSavePlan = async (dur) => {
    if (!user || !plan) return;
    setSaveStatus("saving");
    try {
      if (bulkMemberIds.length > 0) {
        // BULK MODE: Save the same plan snapshot for all selected members
        for (const memberId of bulkMemberIds) {
          await savePlan(user.id, memberId, plan, plan.metrics, dur);
        }
        setBulkMemberIds([]); // Clear bulk list after saving
      } else {
        // SINGLE MODE: Upsert member then save plan
        const member = await upsertMember(user.id, plan.client);
        if (!member) throw new Error("Member save failed");
        await savePlan(user.id, member.id, plan, plan.metrics, dur);
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (e) {
      console.error("Plan save error:", e);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Navbar 
        page={page} 
        setPage={setPage} 
        plan={plan} 
        purchaseDuration={purchaseDuration} 
      />

      {/* Save status toast (Premium Glass) */}
      {saveStatus && (
        <div 
          className="glass-card"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 1000,
            padding: "16px 24px", borderRadius: 16, fontWeight: 800, fontSize: 13,
            display: "flex", alignItems: "center", gap: 10,
            color: saveStatus === "saved" ? "#2e7d32" : saveStatus === "error" ? "#c62828" : BRAND,
            borderBottom: `4px solid ${saveStatus === "saved" ? "#2e7d32" : saveStatus === "error" ? "#c62828" : BRAND}`,
            animation: "slideUp 0.4s ease-out"
          }}
        >
          {saveStatus === "saving" && "⏳ Cloud Syncing..."}
          {saveStatus === "saved" && "✅ Database Updated"}
          {saveStatus === "error" && "⚠️ Sync Error"}
        </div>
      )}

      {/* RENDER PAGES */}
      <div className="page-transition" style={{ padding: "24px 0", maxWidth: 1440, margin: "0 auto" }}>
        {page === "home" && <Home setPage={setPage} setFormValue={(k, v) => setForm({ ...form, [k]: v })} />}
        {page === "dashboard" && <MembersDashboard setPage={setPage} setForm={setForm} setPlan={setPlan} setPurchaseDuration={setPurchaseDuration} setUnlocked={setUnlocked} />}
        {page === "form" && <PlanForm form={form} setForm={setForm} buildPlan={buildPlan} isBulk={isBulk} setIsBulk={setIsBulk} />}
        {page === "checkout" && <Checkout form={form} coupon={coupon} setCoupon={setCoupon} unlockPlan={unlockPlan} startPayment={startPayment} />}
        {page === "payment" && <Payment isProcessing={isProcessing} selectedPrice={selectedPrice} purchaseDuration={purchaseDuration} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} processPayment={processPayment} />}
        {page === "plan" && plan && (
          <PlanView 
            plan={plan} 
            tab={tab} 
            setTab={setTab} 
            purchaseDuration={purchaseDuration} 
            setPage={setPage}
            setForm={setForm}
            copied={copied}
            setCopied={setCopied}
          />
        )}
      </div>
    </div>
  );
}
