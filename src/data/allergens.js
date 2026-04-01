// src/data/allergens.js
export const ALLERGENS = {
  Dairy: {
    icon: "🥛",
    keywords: ["Milk", "Curd", "Paneer", "Cheese", "Butter", "Yogurt", "Whey"],
    substitutes: "Almond Milk / Tofu / Soy Milk"
  },
  Gluten: {
    icon: "🌾",
    keywords: ["Wheat", "Chapati", "Bread", "Ragi", "Maida", "Oats", "Malt"],
    substitutes: "Millet / Quinoa / Rice Flour"
  },
  Nuts: {
    icon: "🥜",
    keywords: ["Almonds", "Nuts", "Walnuts", "Cashews", "Peanut Butter", "Peanuts", "Pistachios"],
    substitutes: "Mixed Seeds (Sunflower/Pumpkin) / Coconut"
  },
  Eggs: {
    icon: "🥚",
    keywords: ["Egg", "Eggs", "Omelette"],
    substitutes: "Paneer / Tofu / Soya Chunks"
  },
  Soy: {
    icon: "🫛",
    keywords: ["Soy", "Soya", "Tofu"],
    substitutes: "Dal / Chickpeas / Paneer"
  },
  Seafood: {
    icon: "🐟",
    keywords: ["Fish", "Prawns", "Salmon", "Tuna", "Seafood"],
    substitutes: "Chicken / Paneer / Tofu"
  }
};

export const ALLERGEN_LIST = Object.keys(ALLERGENS);

/**
 * Detects allergens present in a food string.
 */
export function detectAllergens(foodString) {
  if (!foodString) return [];
  const detected = [];
  const lowerFood = foodString.toLowerCase();
  
  for (const [allergen, config] of Object.entries(ALLERGENS)) {
    if (config.keywords.some(k => lowerFood.includes(k.toLowerCase()))) {
      detected.push(allergen);
    }
  }
  return detected;
}
