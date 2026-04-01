// Workout Schedules and Exercise Details
export const WORKOUT_SCHEDULES = {
  "Weight Loss": ["Cardio 45min + Core", "Strength Lower Body", "Rest / Walk 30min", "Strength Upper Body", "HIIT 30min", "Active Stretch", "Rest"],
  "Body Building": ["Chest + Triceps", "Back + Biceps", "Legs", "Shoulders + Traps", "Arms Iso", "Cardio 20min", "Rest"],
  "CrossFit": ["WOD: Metcon", "WOD: Strength", "WOD: Gymnastics", "Rest", "WOD: Team WOD", "WOD: Long Chipper", "Active Recovery"],
  "Sports Performance": ["Speed + Agility", "Strength Training", "Endurance Run", "Technical Drills", "Game Play", "Recovery Session", "Rest"],
  "Lean Muscle": ["Push Day (Chest/Shoulder)", "Pull Day (Back/Biceps)", "Legs + Glutes", "Rest / Light Cardio", "Full Body Compound", "Active Stretch", "Rest"],
  "Fat Loss + Tone": ["Cardio 40min + Abs", "Toning: Upper Body", "Yoga / Pilates", "Cardio 40min + Legs", "Toning: Full Body", "Walk / Swim", "Rest"],
  Maintenance: ["Full Body Strength", "Cardio 30min", "Flexibility + Yoga", "Active Sport", "Light Cardio", "Rest", "Rest"],
};

export const WORKOUT_DETAILS = {
  "Cardio 45min + Core": { img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=80", min: "45", ex: 12, int: 3 },
  "Strength Lower Body": { img: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=300&q=80", min: "50", ex: 8, int: 4 },
  "Strength Upper Body": { img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&q=80", min: "50", ex: 8, int: 4 },
  "HIIT 30min": { img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80", min: "30", ex: 10, int: 5 },
  "Active Stretch": { img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80", min: "20", ex: 15, int: 1 },
  "Chest + Triceps": { img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80", min: "60", ex: 9, int: 4 },
  "Back + Biceps": { img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=300&q=80", min: "60", ex: 9, int: 4 },
  Legs: { img: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=300&q=80", min: "65", ex: 8, int: 5 },
  "Shoulders + Traps": { img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&q=80", min: "55", ex: 8, int: 4 },
  "Arms Iso": { img: "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=300&q=80", min: "45", ex: 8, int: 3 },
  "Cardio 20min": { img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=80", min: "20", ex: 1, int: 2 },
  "WOD: Metcon": { img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=80", min: "45", ex: 5, int: 5 },
  "WOD: Strength": { img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80", min: "50", ex: 4, int: 5 },
  "WOD: Gymnastics": { img: "https://images.unsplash.com/photo-1552825181-7928213cf8ac?w=300&q=80", min: "40", ex: 6, int: 4 },
  "WOD: Team WOD": { img: "https://images.unsplash.com/photo-1526506114620-1ca3cb43f140?w=300&q=80", min: "60", ex: 8, int: 5 },
  "WOD: Long Chipper": { img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&q=80", min: "45", ex: 10, int: 5 },
  "Speed + Agility": { img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80", min: "60", ex: 12, int: 4 },
  "Strength Training": { img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&q=80", min: "60", ex: 8, int: 4 },
  "Endurance Run": { img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80", min: "60", ex: 1, int: 4 },
  "Technical Drills": { img: "https://images.unsplash.com/photo-1535743918118-d57be63c5f59?w=300&q=80", min: "45", ex: 8, int: 3 },
  "Game Play": { img: "https://images.unsplash.com/photo-1526506114620-1ca3cb43f140?w=300&q=80", min: "90", ex: 1, int: 5 },
  "Push Day (Chest/Shoulder)": { img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80", min: "60", ex: 9, int: 4 },
  "Pull Day (Back/Biceps)": { img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&q=80", min: "60", ex: 9, int: 4 },
  "Legs + Glutes": { img: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=300&q=80", min: "65", ex: 8, int: 5 },
  "Full Body Compound": { img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&q=80", min: "60", ex: 7, int: 5 },
  "Cardio 40min + Abs": { img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80", min: "55", ex: 8, int: 3 },
  "Toning: Upper Body": { img: "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=300&q=80", min: "45", ex: 10, int: 3 },
  "Yoga / Pilates": { img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80", min: "45", ex: 15, int: 2 },
  "Cardio 40min + Legs": { img: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=300&q=80", min: "55", ex: 8, int: 4 },
  "Toning: Full Body": { img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80", min: "50", ex: 12, int: 4 },
  "Walk / Swim": { img: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&q=80", min: "40", ex: 1, int: 2 },
  "Full Body Strength": { img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&q=80", min: "50", ex: 8, int: 4 },
  "Cardio 30min": { img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=80", min: "30", ex: 1, int: 3 },
  "Flexibility + Yoga": { img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80", min: "40", ex: 12, int: 1 },
  "Active Sport": { img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80", min: "60", ex: 1, int: 4 },
  "Light Cardio": { img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=80", min: "30", ex: 1, int: 2 },
  Rest: { img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80", min: "0", ex: 0, int: 0 },
  "Active Recovery": { img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80", min: "30", ex: 1, int: 1 },
  "Rest / Walk 30min": { img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=80", min: "30", ex: 1, int: 2 },
  "Rest / Light Cardio": { img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=80", min: "30", ex: 1, int: 2 },
};

/**
 * Generates an array of 9 specific exercises with YouTube search links based on the workout category.
 * Used for detailed expansive views in PlanView.jsx.
 */
export function getExercisesForWorkout(workoutName) {
  const name = workoutName.toLowerCase();
  let exList = [];

  if (name.includes("rest") || name.includes("recovery")) {
    return [];
  } else if (name.includes("chest") || name.includes("push") || name.includes("upper")) {
    exList = [
      "Incline Dumbbell Press", "Flat Barbell Bench Press", "Pec Deck Flyes",
      "Cable Crossovers", "Pushups", "Overhead Tricep Extension",
      "Tricep Pushdowns", "Dumbbell Lateral Raises", "Front Plate Raises"
    ];
  } else if (name.includes("back") || name.includes("pull")) {
    exList = [
      "Lat Pulldowns", "Barbell Rows", "Seated Cable Rows",
      "Face Pulls", "Dumbbell Pullovers", "Barbell Bicep Curls",
      "Hammer Curls", "Preacher Curls", "Hyperextensions"
    ];
  } else if (name.includes("leg") || name.includes("lower") || name.includes("glute")) {
    exList = [
      "Barbell Squats", "Leg Press", "Walking Lunges",
      "Leg Extensions", "Lying Leg Curls", "Romanian Deadlifts",
      "Standing Calf Raises", "Seated Calf Raises", "Hip Thrusts"
    ];
  } else if (name.includes("shoulder") || name.includes("trap")) {
    exList = [
      "Seated Dumbbell Press", "Arnold Press", "Lateral Raises",
      "Front Raises", "Reverse Pec Deck", "Upright Rows",
      "Dumbbell Shrugs", "Face Pulls", "Cable Lateral Raises"
    ];
  } else if (name.includes("cardio") || name.includes("hiit") || name.includes("metcon") || name.includes("crossfit")) {
    exList = [
      "Jumping Jacks", "Burpees", "High Knees",
      "Mountain Climbers", "Jump Squats", "Kettlebell Swings",
      "Box Jumps", "Battle Ropes", "Rowing Machine Sprint"
    ];
  } else if (name.includes("core") || name.includes("abs")) {
    exList = [
      "Plank Hold", "Bicycle Crunches", "Leg Raises",
      "Russian Twists", "Ab Roller", "Hanging Knee Raises",
      "Cable Crunches", "Reverse Crunches", "Toe Touches"
    ];
  } else if (name.includes("arm") || name.includes("bicep") || name.includes("tricep")) {
    exList = [
      "Barbell Bicep Curls", "Hammer Curls", "Preacher Curls",
      "Concentration Curls", "Tricep Pushdowns", "Overhead Tricep Ext",
      "Skull Crushers", "Close Grip Bench Press", "Dips"
    ];
  } else if (name.includes("yoga") || name.includes("stretch") || name.includes("flexibility")) {
    exList = [
      "Downward Dog", "Child's Pose", "Cobra Stretch",
      "Cat-Cow Stretch", "Pigeon Pose", "Seated Forward Fold",
      "Spinal Twist", "Butterfly Stretch", "Corpse Pose (Savasana)"
    ];
  } else {
    // Generic Full Body Fallback
    exList = [
      "Goblet Squats", "Pushups", "Dumbbell Rows",
      "Shoulder Press", "Lunges", "Plank",
      "Bicep Curls", "Tricep Extensions", "Jumping Jacks"
    ];
  }

  // Format into objects with fixed Sets/Reps and dynamic YouTube Link
  return exList.map(ex => ({
    name: ex,
    sets: 3,
    reps: 15,
    link: `https://www.youtube.com/results?search_query=${encodeURIComponent(ex + " workout form tutorial shorts")}`
  }));
}
