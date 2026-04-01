// Shopping List Generation Logic
export function generateShoppingList(goal, vegetarian) {
  const isVeg = vegetarian === "Yes";
  const base = [
    { cat: "Vegetables", items: "Spinach, Beans, Carrot, Tomato, Brinjal, Pumpkin, Cucumber", qty: "1.5 kg", cost: "₹80–120" },
    { cat: "Fruits", items: "Banana, Apple, Mango (seasonal), Pomegranate", qty: "1 kg", cost: "₹80–150" },
    { cat: "Dairy", items: "Aavin Milk, Curd, Buttermilk", qty: "2 L", cost: "₹100–140" },
    { cat: "Spices", items: "Turmeric, Cumin, Coriander, Mustard, Curry Leaves", qty: "Small", cost: "₹50–70" },
    { cat: "Oils", items: "Groundnut Oil / Cold-Pressed Coconut Oil", qty: "250ml", cost: "₹60–90" },
  ];
  
  const vegAdd = [
    { cat: "Protein", items: "Paneer, Greek Yogurt, Soya Chunks, Tofu, Moong Dal, Toor Dal", qty: "700g", cost: "₹200–300" },
    { cat: "Carbs", items: "Brown Rice, Ragi Flour, Oats, Whole Wheat, Millets", qty: "1.5 kg", cost: "₹120–180" },
    { cat: "Extras", items: "Peanut Butter, Almonds, Walnuts, Chia Seeds, Flaxseeds", qty: "200g", cost: "₹150–220" },
  ];
  
  const nvAdd = [
    { cat: "Protein", items: "Chicken Breast, Eggs (14 nos), Fish (Tilapia/Salmon)", qty: "700g", cost: "₹280–400" },
    { cat: "Carbs", items: "Brown Rice, Ragi Flour, Oats, Whole Wheat, Quinoa", qty: "1.5 kg", cost: "₹120–200" },
    { cat: "Extras", items: "Mixed Nuts, Greek Yogurt, Whey Protein (optional)", qty: "Varies", cost: "₹200–400" },
  ];
  
  return [...base, ...(isVeg ? vegAdd : nvAdd)];
}
