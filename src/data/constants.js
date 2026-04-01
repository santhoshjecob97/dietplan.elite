// Brand Identity and Styling Constants
export const LOGO_URI = "/logo.jpg";
export const BRAND = "#E53935";
export const BRAND_DARK = "#B71C1C";
export const BRAND_LIGHT = "#FFEBEE";

// Payment / Business Config
// Change this to your actual UPI ID (GPay / PhonePe / Paytm / Razorpay UPI)
export const UPI_ID = "step2fitness@okaxis"; 
export const UPI_NAME = "Step2 Fitness";

// Global Activity Multipliers
export const ACTIVITY_MULTIPLIERS = {
  Sedentary: 1.2,
  Light: 1.375,
  Moderate: 1.55,
  Active: 1.725,
  "Very Active": 1.9,
};

// UI Lists
export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export const ACTIVITIES = Object.keys(ACTIVITY_MULTIPLIERS);
export const MEDICAL_CONDITIONS = [
  "None",
  "Diabetes",
  "PCOS",
  "Thyroid",
  "Hypertension",
  "Gastric Issues",
];
