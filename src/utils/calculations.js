import { ACTIVITY_MULTIPLIERS } from "../data/constants";
import { GOAL_CFG } from "../data/goals";

/**
 * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 */
export function calcBMR(weight, height, age, gender) {
  return gender === "M"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * Calculates all fitness metrics: BMR, TDEE, Target Calories, Macros, and Water
 */
export function calculateAllMetrics(input) {
  const { weight, height, age, gender, activity, goal } = input;
  
  const bmr = calcBMR(weight, height, age, gender);
  const tdee = bmr * (ACTIVITY_MULTIPLIERS[activity] || 1.55);
  
  const goalConfig = GOAL_CFG[goal] || GOAL_CFG.Maintenance;
  const { pct, adj } = goalConfig;
  
  const targetCal = Math.round(tdee + adj);
  const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);
  
  let bmiLabel = "Normal";
  let bmiColor = "#2e7d32";
  
  if (bmi < 18.5) {
    bmiLabel = "Underweight";
    bmiColor = "#0288d1";
  } else if (bmi >= 25 && bmi < 30) {
    bmiLabel = "Overweight";
    bmiColor = "#f57c00";
  } else if (bmi >= 30) {
    bmiLabel = "Obese";
    bmiColor = "#c62828";
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCal,
    bmi,
    bmiLabel,
    bmiColor,
    protein: Math.round((targetCal * pct[0]) / 4),
    carbs: Math.round((targetCal * pct[1]) / 4),
    fat: Math.round((targetCal * pct[2]) / 9),
    water: +(weight * 35 / 1000).toFixed(1),
  };
}
