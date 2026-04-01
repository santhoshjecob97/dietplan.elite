// Meal Plan Templates and Generation Logic
import { detectAllergens, ALLERGENS } from "./allergens";

export const MEAL_PLANS = {
  "Weight Loss": [
    { time: "6:00 AM", name: "Pre-Workout", foods: { v: "Black Coffee + 6 Soaked Almonds", nv: "Black Coffee + ½ Banana" }, cal: 60, p: 1, c: 8, f: 3 },
    { time: "8:00 AM", name: "Breakfast", foods: { v: "Oats Upma 150g + 3 Egg Whites Omelette", nv: "3 Egg Whites Omelette + 2 Idlis + Chutney" }, cal: 320, p: 28, c: 42, f: 5 },
    { time: "10:30 AM", name: "Mid-Morning", foods: { v: "Greek Yogurt 150g + Mixed Seeds 10g", nv: "Greek Yogurt 150g + Nuts 20g" }, cal: 200, p: 13, c: 12, f: 9 },
    { time: "1:00 PM", name: "Lunch", foods: { v: "Brown Rice 100g + Dal + Sabzi + Salad", nv: "Brown Rice 100g + Chicken 150g + Rasam + Salad" }, cal: 480, p: 35, c: 52, f: 9 },
    { time: "4:00 PM", name: "Evening Snack", foods: { v: "Sprouts 100g + Buttermilk 200ml", nv: "Sprouts 100g + Buttermilk 200ml" }, cal: 160, p: 10, c: 20, f: 2 },
    { time: "7:30 PM", name: "Dinner", foods: { v: "Ragi Dosa (2) + Sambar + Stir-Fry Veggies", nv: "Ragi Dosa (2) + Sambar + Grilled Fish 100g" }, cal: 360, p: 18, c: 48, f: 7 },
    { time: "9:30 PM", name: "Bedtime", foods: { v: "Turmeric Milk 200ml (low fat)", nv: "Turmeric Milk 200ml (low fat)" }, cal: 90, p: 6, c: 8, f: 2 },
  ],
  "Body Building": [
    { time: "5:30 AM", name: "Pre-Workout", foods: { v: "Banana + Peanut Butter 1tbsp", nv: "Banana + 2 Boiled Eggs" }, cal: 200, p: 10, c: 28, f: 6 },
    { time: "8:00 AM", name: "Breakfast", foods: { v: "Paneer Bhurji 150g + Chapati (3) + Milk 300ml", nv: "6 Egg Omelette + Chapati (3) + Milk 300ml" }, cal: 620, p: 48, c: 55, f: 18 },
    { time: "10:30 AM", name: "Mid-Morning", foods: { v: "Mass Gainer Shake + Banana", nv: "Protein Shake + Banana" }, cal: 380, p: 40, c: 48, f: 5 },
    { time: "1:00 PM", name: "Lunch", foods: { v: "Rice 200g + Paneer Curry 200g + Dal", nv: "Rice 200g + Chicken 250g + Dal" }, cal: 780, p: 58, c: 90, f: 15 },
    { time: "4:00 PM", name: "Post-Workout", foods: { v: "Protein Shake + Dates (4)", nv: "Whey Protein + Dates (4)" }, cal: 300, p: 35, c: 30, f: 3 },
    { time: "7:30 PM", name: "Dinner", foods: { v: "Chapati (4) + Paneer Gravy + Dal", nv: "Chapati (4) + Mutton Curry 200g" }, cal: 720, p: 52, c: 72, f: 20 },
    { time: "10:00 PM", name: "Bedtime", foods: { v: "Curd 200g + Peanut Butter 1tbsp", nv: "Casein Shake + Nuts 30g" }, cal: 300, p: 30, c: 15, f: 12 },
  ],
  "CrossFit": [
    { time: "6:00 AM", name: "Pre-WOD", foods: { v: "Oats 50g + Banana + Honey", nv: "Oats 50g + Banana + Boiled Egg" }, cal: 280, p: 10, c: 52, f: 4 },
    { time: "8:30 AM", name: "Post-WOD", foods: { v: "Protein Shake + Mango 150g", nv: "Whey Protein + Mango 150g" }, cal: 300, p: 30, c: 38, f: 3 },
    { time: "11:00 AM", name: "Brunch", foods: { v: "Paneer Sandwich (WW) + Salad", nv: "Chicken Sandwich (WW) + Salad" }, cal: 420, p: 28, c: 48, f: 12 },
    { time: "2:00 PM", name: "Lunch", foods: { v: "Brown Rice 150g + Dal + Curd", nv: "Brown Rice 150g + Tuna 150g + Curd" }, cal: 520, p: 38, c: 60, f: 10 },
    { time: "5:00 PM", name: "Afternoon", foods: { v: "Mixed Nuts 30g + Coconut Water", nv: "Mixed Nuts 30g + Coconut Water" }, cal: 200, p: 5, c: 20, f: 12 },
    { time: "8:00 PM", name: "Dinner", foods: { v: "Quinoa 100g + Rajma + Sabzi", nv: "Quinoa 100g + Grilled Chicken 150g + Sabzi" }, cal: 480, p: 35, c: 52, f: 10 },
    { time: "10:00 PM", name: "Recovery", foods: { v: "Tart Cherry Juice 200ml + Nuts", nv: "Tart Cherry Juice 200ml + Nuts" }, cal: 150, p: 3, c: 25, f: 5 },
  ],
  "Sports Performance": [
    { time: "6:00 AM", name: "Pre-Training", foods: { v: "Banana (2) + Dates (3) + Black Coffee", nv: "Banana (2) + Dates (3) + Black Coffee" }, cal: 220, p: 3, c: 55, f: 1 },
    { time: "8:30 AM", name: "Post-Training", foods: { v: "Soya Shake + White Rice 100g", nv: "Whey Protein + White Rice 100g" }, cal: 400, p: 35, c: 58, f: 4 },
    { time: "11:00 AM", name: "Breakfast", foods: { v: "Poha 200g + Sprouts + Milk", nv: "Poha 200g + Boiled Eggs (4)" }, cal: 480, p: 30, c: 65, f: 10 },
    { time: "2:00 PM", name: "Lunch", foods: { v: "Rice 200g + Dal + Rajma + Curd", nv: "Rice 200g + Chicken 200g + Fish 100g" }, cal: 680, p: 48, c: 80, f: 14 },
    { time: "5:00 PM", name: "Mid Snack", foods: { v: "Energy Bar / Fruit Platter 250g", nv: "Energy Bar / Fruit Platter 250g" }, cal: 250, p: 6, c: 45, f: 5 },
    { time: "8:00 PM", name: "Dinner", foods: { v: "Chapati (3) + Palak Paneer", nv: "Chapati (3) + Grilled Salmon 150g" }, cal: 550, p: 38, c: 55, f: 16 },
    { time: "10:30 PM", name: "Recovery", foods: { v: "Chocolate Milk 300ml", nv: "Chocolate Milk 300ml" }, cal: 210, p: 12, c: 30, f: 5 },
  ],
  "Lean Muscle": [
    { time: "6:30 AM", name: "Morning", foods: { v: "Overnight Oats + Chia + Almond Milk", nv: "Overnight Oats + 3 Boiled Eggs" }, cal: 340, p: 22, c: 42, f: 9 },
    { time: "9:00 AM", name: "Breakfast", foods: { v: "Moong Dal Chilla (3) + Curd", nv: "4 Egg Omelette + Toast (2)" }, cal: 420, p: 32, c: 38, f: 14 },
    { time: "12:00 PM", name: "Lunch", foods: { v: "Brown Rice 100g + Soya Chunks + Sabzi", nv: "Brown Rice 100g + Grilled Chicken 150g + Sabzi" }, cal: 500, p: 40, c: 52, f: 10 },
    { time: "3:30 PM", name: "Pre-Workout", foods: { v: "Banana + Black Coffee", nv: "Banana + Black Coffee" }, cal: 110, p: 1, c: 28, f: 0 },
    { time: "5:30 PM", name: "Post-Workout", foods: { v: "Soya Protein Shake", nv: "Whey Protein Shake" }, cal: 160, p: 30, c: 8, f: 2 },
    { time: "8:00 PM", name: "Dinner", foods: { v: "Chapati (3) + Paneer Curry + Dal", nv: "Chapati (3) + Fish Curry 150g" }, cal: 520, p: 38, c: 52, f: 12 },
    { time: "10:30 PM", name: "Bedtime", foods: { v: "Curd 200g", nv: "Casein Shake" }, cal: 130, p: 22, c: 6, f: 3 },
  ],
  "Fat Loss + Tone": [
    { time: "6:00 AM", name: "Morning", foods: { v: "Warm Lemon Water + Soaked Methi", nv: "Warm Lemon Water + Soaked Methi" }, cal: 10, p: 0, c: 2, f: 0 },
    { time: "8:00 AM", name: "Breakfast", foods: { v: "3 Egg Whites + Veg Omelette + 1 Idli", nv: "4 Egg White Omelette + 1 Idli" }, cal: 280, p: 26, c: 28, f: 6 },
    { time: "10:30 AM", name: "Mid-Morning", foods: { v: "Green Apple + Almonds (8)", nv: "Green Apple + Almonds (8)" }, cal: 150, p: 3, c: 22, f: 6 },
    { time: "1:00 PM", name: "Lunch", foods: { v: "Millet Khichdi 150g + Salad", nv: "Grilled Chicken 150g + Salad Bowl" }, cal: 380, p: 30, c: 38, f: 8 },
    { time: "4:00 PM", name: "Snack", foods: { v: "Cucumber + Hummus 30g", nv: "Cucumber + Hummus 30g" }, cal: 100, p: 4, c: 12, f: 4 },
    { time: "7:30 PM", name: "Dinner", foods: { v: "Soup + Tofu Stir Fry + Chapati (1)", nv: "Soup + Grilled Fish 120g + Chapati (1)" }, cal: 320, p: 28, c: 28, f: 8 },
    { time: "9:30 PM", name: "Bedtime", foods: { v: "Chamomile Tea / Skim Milk 150ml", nv: "Chamomile Tea / Skim Milk 150ml" }, cal: 60, p: 5, c: 6, f: 1 },
  ],
  Maintenance: [
    { time: "7:00 AM", name: "Breakfast", foods: { v: "Idli (3) + Sambar + Chutney", nv: "Idli (3) + Egg Curry" }, cal: 360, p: 16, c: 58, f: 6 },
    { time: "10:00 AM", name: "Mid-Morning", foods: { v: "Seasonal Fruit + Nuts 20g", nv: "Seasonal Fruit + Nuts 20g" }, cal: 180, p: 4, c: 28, f: 7 },
    { time: "1:00 PM", name: "Lunch", foods: { v: "Rice + Dal + 2 Sabzi + Curd", nv: "Rice + Dal + Chicken + Sabzi" }, cal: 560, p: 28, c: 70, f: 12 },
    { time: "4:00 PM", name: "Evening", foods: { v: "Tea/Coffee + Multigrain Biscuits", nv: "Tea/Coffee + Multigrain Biscuits" }, cal: 140, p: 3, c: 22, f: 5 },
    { time: "7:30 PM", name: "Dinner", foods: { v: "Chapati (3) + Paneer + Dal", nv: "Chapati (3) + Chicken Curry" }, cal: 520, p: 30, c: 58, f: 14 },
    { time: "9:30 PM", name: "Bedtime", foods: { v: "Warm Milk 200ml", nv: "Warm Milk 200ml" }, cal: 120, p: 6, c: 10, f: 4 },
  ],
};

/**
 * Generates personalized meal plans based on goal, dietary preference, medical conditions, target calories, and member allergens.
 */
export function generateMealPlan(goal, vegetarian, medical = "None", targetCal = 2000, memberAllergens = []) {
  const isVeg = vegetarian === "Yes";
  const selectedPlan = MEAL_PLANS[goal] || MEAL_PLANS.Maintenance;
  
  const currentTotal = selectedPlan.reduce((sum, meal) => sum + meal.cal, 0);
  const scalingRatio = targetCal / currentTotal;

  // Ensure memberAllergens is an array (sometimes it's a string from form)
  const allergens = typeof memberAllergens === "string" 
    ? memberAllergens.split(",").map(a => a.trim()).filter(Boolean)
    : (memberAllergens || []);

  return selectedPlan.map(meal => {
    let foods = isVeg ? meal.foods.v : meal.foods.nv;

    // Apply Allergen Filtering
    allergens.forEach(allergen => {
      const config = ALLERGENS[allergen];
      if (config && detectAllergens(foods).includes(allergen)) {
        // Simple swap logic — replace allergen keywords with substitutes
        config.keywords.forEach(k => {
          const regex = new RegExp(`\\b${k}\\b`, "gi");
          if (foods.match(regex)) {
             foods = foods.replace(regex, config.substitutes);
          }
        });
      }
    });

    // Apply Medical Adjustments
    if (medical === "Diabetes") {
      foods = foods.replace(/Banana|Mango|Dates|Honey|Sugary/gi, "Green Apple/Cucumber");
    }
    if (medical === "PCOS" || medical === "Thyroid") {
      foods = foods.replace(/Milk|Curd|Cheese/gi, "Almond Milk/Tofu");
    }
    if (medical === "Hypertension") {
      foods = foods.replace(/Salt|Pickle/gi, "Low-Salt Alternative");
    }

    return {
      ...meal,
      foods,
      cal: Math.round(meal.cal * scalingRatio),
      p: Math.round(meal.p * scalingRatio),
      c: Math.round(meal.c * scalingRatio),
      f: Math.round(meal.f * scalingRatio),
      allergens: detectAllergens(foods) // Store for UI badges
    };
  });
}
