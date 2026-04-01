import { FOOD_DATABASE } from "../data/foodDatabase";

/**
 * AI Meal Swap Engine
 * -------------------
 * Finds macro-equivalent alternatives from the 220+ food database.
 */

export function findSwaps(originalMeal, goal = "Maintenance") {
  const { foods: mealString, cal: targetCal } = originalMeal;
  
  // 1. Identify "Base Category" from the original meal string
  // (Simple keyword matching for Step2 Fitness common items)
  const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Protein", "Fruit"];
  const mealTags = [];
  
  if (mealString.toLowerCase().includes("idli") || mealString.toLowerCase().includes("dosa") || mealString.toLowerCase().includes("oats")) {
    mealTags.push("Breakfast");
  }
  if (mealString.toLowerCase().includes("rice") || mealString.toLowerCase().includes("biryani") || mealString.toLowerCase().includes("dal")) {
    mealTags.push("Lunch", "Dinner");
  }
  if (mealString.toLowerCase().includes("chicken") || mealString.toLowerCase().includes("egg") || mealString.toLowerCase().includes("paneer") || mealString.toLowerCase().includes("fish")) {
    mealTags.push("Protein");
  }
  if (mealString.toLowerCase().includes("fruit") || mealString.toLowerCase().includes("apple") || mealString.toLowerCase().includes("banana")) {
    mealTags.push("Fruit");
  }

  // 2. Filter Database for "Equivalent" items
  const alternatives = FOOD_DATABASE.filter(f => {
    // Avoid swapping for the same item
    if (mealString.toLowerCase().includes(f.name.toLowerCase())) return false;
    
    // Match tags
    return f.tags.some(tag => mealTags.includes(tag));
  });

  // 3. Calculate Portions & Macro Delta
  return alternatives
    .map(alt => {
      // Logic: How many 'units' of this alt equal the target calories?
      const qtyNeeded = (targetCal / alt.cal).toFixed(1);
      const newCal = Math.round(qtyNeeded * alt.cal);
      const newP = Math.round(qtyNeeded * alt.p);
      const newC = Math.round(qtyNeeded * alt.c);
      const newF = Math.round(qtyNeeded * alt.f);

      // Score the swap (Lower is better)
      // For Muscle goals, we penalize low protein. For Weight Loss, we penalize high fat.
      let score = Math.abs(newCal - targetCal);
      if (goal === "Body Building" && newP < originalMeal.p) score += 50; 
      if (goal === "Weight Loss" && newF > originalMeal.f) score += 50;

      return {
        ...alt,
        qty: qtyNeeded,
        displayQty: `${qtyNeeded} ${alt.unit}${qtyNeeded > 1 && !alt.unit.includes("s") ? "s" : ""}`,
        newMacros: { cal: newCal, p: newP, c: newC, f: newF },
        score
      };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 4); // Top 4 "Smart Swaps"
}
