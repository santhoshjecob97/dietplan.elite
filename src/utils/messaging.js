/**
 * Generates the formatted WhatsApp message for clients
 */
export function getWhatsAppMessage(client, metrics, meals = []) {
  const mealSummary = meals.length > 0 
    ? "\n\n🍴 *DAILY MEAL PLAN:*\n" + meals.map(m => `• *${m.time}*: ${m.name}\n  _${m.foods}_`).join("\n\n")
    : "";

  return `*STEP2 FITNESS GYM — Chennai* 💪
🌟 *Diet Blueprint for ${client.name}*

🎯 *GOAL:* ${client.goal}
🔥 *TARGET:* ${metrics.targetCal} kcal/day
🥩 *PROTEIN:* ${metrics.protein}g | Carbs: ${metrics.carbs}g | Fat: ${metrics.fat}g
💧 *WATER:* ${metrics.water}L/day | 😴 *SLEEP:* 7-8 hrs
${mealSummary}

✅ Your elite performance plan is ready! Please follow the meal timings strictly for the best transformation results.

🚀 *GET A JUMP ON YOUR DAY!* 🔥
_Prepared by your Step2 Trainer · 099624 44002_`;
}
