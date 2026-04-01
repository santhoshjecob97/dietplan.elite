// Fitness Goal Configurations
export const GOAL_CFG = {
  "Weight Loss": {
    pct: [0.4, 0.3, 0.3], // [Protein, Carbs, Fat]
    adj: -500, // Calorie adjustment from TDEE
    icon: "⚖️",
    color: "#E53935",
    pricing: { week4: 50, week8: 100, week12: 200 },
  },
  "Fat Loss + Tone": {
    pct: [0.42, 0.28, 0.3],
    adj: -400,
    icon: "🎽",
    color: "#e91e63",
    pricing: { week4: 60, week8: 120, week12: 240 },
  },
  "Lean Muscle": {
    pct: [0.35, 0.4, 0.25],
    adj: +200,
    icon: "✨",
    color: "#00897b",
    pricing: { week4: 70, week8: 140, week12: 280 },
  },
  "Body Building": {
    pct: [0.35, 0.45, 0.2],
    adj: +400,
    icon: "💪",
    color: "#5e35b1",
    pricing: { week4: 80, week8: 160, week12: 320 },
  },
  "CrossFit": {
    pct: [0.3, 0.45, 0.25],
    adj: +100,
    icon: "🔥",
    color: "#f57c00",
    pricing: { week4: 75, week8: 150, week12: 300 },
  },
  "Sports Performance": {
    pct: [0.28, 0.5, 0.22],
    adj: +150,
    icon: "⚡",
    color: "#0288d1",
    pricing: { week4: 70, week8: 140, week12: 280 },
  },
  Maintenance: {
    pct: [0.3, 0.45, 0.25],
    adj: 0,
    icon: "⚙️",
    color: "#546e7a",
    pricing: { week4: 50, week8: 100, week12: 200 },
  },
};

export const GOALS = Object.keys(GOAL_CFG);

/**
 * Calculates dynamic pricing based on goal and medical conditions
 */
export function getPricing(goal, medical = "None") {
  const basePricing = (GOAL_CFG[goal] || GOAL_CFG.Maintenance).pricing;
  let medicalSurcharge = 0;

  if (medical && medical !== "None") {
    const complexConditions = ["Diabetes", "Hypertension", "Heart Disease", "Thyroid"];
    medicalSurcharge = complexConditions.includes(medical) ? 20 : 10;
  }

  return {
    week4: basePricing.week4 + medicalSurcharge,
    week8: basePricing.week8 + medicalSurcharge,
    week12: basePricing.week12 + medicalSurcharge,
  };
}
