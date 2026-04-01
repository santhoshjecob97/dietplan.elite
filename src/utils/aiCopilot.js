/**
 * Step2 Fitness AI Trainer Co-Pilot
 * --------------------------------
 * Analyzes member compliance data and generates coaching insights.
 */

export function analyzePerformance(member, logs, targetMetrics) {
  if (!logs || logs.length === 0) {
    return {
      status: "Insufficient Data",
      insight: "The member hasn't logged enough meals this week for a full analysis. Encourage them to log at least 3 days of nutrition.",
      score: 0
    };
  }

  // 1. Calculate Averages
  const totalCal = logs.reduce((s, l) => s + (l.calories || 0), 0);
  const totalP = logs.reduce((s, l) => s + (l.protein || 0), 0);
  const avgCal = Math.round(totalCal / 7);
  const avgP = Math.round(totalP / 7);
  
  const calDiff = avgCal - targetMetrics.targetCal;
  const pDiff = avgP - targetMetrics.protein;

  // 2. Identify Patterns
  let insights = [];
  let score = 85; // Baseline

  if (Math.abs(calDiff) < 100) {
     insights.push("🎯 Perfect Calorie Alignment: The member is hitting their daily targets with high precision.");
  } else if (calDiff > 200) {
     insights.push("⚠️ Calorie Surplus Detected: Average intake is " + calDiff + "kcal above target. This may slow down weight loss progress.");
     score -= 15;
  } else if (calDiff < -300) {
     insights.push("📉 Extreme Deficit: Member is significantly under-eating. This could lead to muscle loss or metabolic slowdown.");
     score -= 10;
  }

  if (pDiff < -20) {
     insights.push("🥩 Protein Gap: Member is averaging " + Math.abs(pDiff) + "g less protein than required. Suggest adding " + (member.vegetarian ? "Paneer/Soya" : "Whey/Egg whites") + ".");
     score -= 10;
  } else if (pDiff > 10) {
     insights.push("✅ Protein Intake is excellent, supporting muscle recovery.");
  }

  const logFrequency = logs.length;
  if (logFrequency < 5) {
     insights.push("📝 Low Logging Consistency: Member logged only " + logFrequency + " meals. Request more diligent tracking for better coaching accuracy.");
     score -= 20;
  }

  // 3. Final Recommendation (The "Co-Pilot" Voice)
  let recommendation = "";
  if (score > 80) {
    recommendation = "Maintain current momentum. The member is highly compliant. Possibly increase workout intensity next week.";
  } else if (score > 60) {
    recommendation = "Focus on " + (pDiff < 0 ? "protein consistency" : "portion control") + ". A mid-week check-in call is recommended to address logging gaps.";
  } else {
    recommendation = "CRITICAL: Member is drifting from the plan. A 1-on-1 strategy session is needed to simplify the meal plan or address lifestyle barriers.";
  }

  return {
    score: Math.max(0, score),
    insights,
    recommendation,
    summary: `Avg: ${avgCal} kcal | Target: ${targetMetrics.targetCal} kcal`
  };
}
