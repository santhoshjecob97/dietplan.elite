/**
 * Generates the formatted WhatsApp message for clients
 */
export function getWhatsAppMessage(client, metrics) {
  return `*STEP2 FITNESS GYM — Chennai* 💪
*Diet Plan: ${client.name}*

🎯 Goal: ${client.goal}
📊 Target Calories: *${metrics.targetCal} kcal/day*
🥩 Protein: ${metrics.protein}g | 🌾 Carbs: ${metrics.carbs}g | 🥑 Fat: ${metrics.fat}g
💧 Water: ${metrics.water}L/day | 😴 Sleep: 7-8 hrs

Your diet plan has been prepared. Please follow the meal timings strictly for best results.

*GET A JUMP ON YOUR DAY!* 🔥`;
}
