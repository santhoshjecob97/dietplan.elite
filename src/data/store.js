// Step2 Pro Store - Supplement Products & Pricing
export const STORE_PRODUCTS = [
  {
    id: "p1",
    name: "ON Gold Standard Whey",
    category: "Protein",
    price: 6899,
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&q=80",
    description: "24g of high-quality whey protein per serving to support muscle growth and recovery.",
    tags: ["Best Seller", "Post-Workout"]
  },
  {
    id: "p2",
    name: "MuscleBlaze Biozyme Whey",
    category: "Protein",
    price: 4999,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    description: "Designed for Indian bodies with enhanced absorption. Low carb, high purity.",
    tags: ["Indian Favorite", "Low Carb"]
  },
  {
    id: "p3",
    name: "Creatine Monohydrate (250g)",
    category: "Performance",
    price: 1299,
    image: "https://images.unsplash.com/photo-1579722822860-13e58b265999?w=400&q=80",
    description: "Pure micronized creatine to increase strength and explosive power.",
    tags: ["Must-Have", "Strength"]
  },
  {
    id: "p4",
    name: "C4 Original Pre-Workout",
    category: "Performance",
    price: 2499,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
    description: "Explosive energy and focus for high-intensity training sessions.",
    tags: ["Energy", "Focus"]
  },
  {
    id: "p5",
    name: "HealthKart Multivitamin",
    category: "Wellness",
    price: 899,
    image: "https://images.unsplash.com/photo-1471864190281-ad5f9f307b0d?w=400&q=80",
    description: "Daily essential vitamins and minerals with Ashwagandha and Ginseng.",
    tags: ["Wellness", "Daily"]
  },
  {
    id: "p6",
    name: "Omega-3 Triple Strength",
    category: "Wellness",
    price: 1199,
    image: "https://images.unsplash.com/photo-1550573104-1561bd5fb3af?w=400&q=80",
    description: "High EPA/DHA concentration for heart, joint, and brain health.",
    tags: ["Heart Health", "Anti-Inflammatory"]
  },
  {
    id: "p7",
    name: "L-Carnitine 3000 (Liquid)",
    category: "Fat Loss",
    price: 1899,
    image: "https://images.unsplash.com/photo-1610738753729-32b6fb5610e1?w=400&q=80",
    description: "Speeds up fat metabolism. Best used before fasted cardio.",
    tags: ["Fat Loss", "Metabolism"]
  },
  {
    id: "p8",
    name: "BCAA 6000 (Intra-workout)",
    category: "Performance",
    price: 1799,
    image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=400&q=80",
    description: "Prevents muscle breakdown during long training sessions. Zero sugar.",
    tags: ["Recovery", "Endurance"]
  }
];

export const BUNDLES = [
  {
    id: "b1",
    name: "Beginner Fat Loss Stack",
    price: 3500,
    items: ["p7", "p5", "p6"],
    description: "Start your weight loss journey with this balanced supplement combo."
  },
  {
    id: "b2",
    name: "Advanced Mass Builder",
    price: 10500,
    items: ["p1", "p3", "p4"],
    description: "The ultimate combo for maximum muscle and strength gains."
  }
];
