# Step2 Fitness — World-Class AI Diet & Workout Brain 🧠💪

The **Step2 Fitness Diet Plan Brain** is an enterprise-grade, multi-tenant SaaS platform built for the **Step2 Fitness Studio Network**. It transforms professional nutrition and workout coaching into a high-end digital experience with AI-driven flexibility and real-time tracking.

---

## 💎 World-Class Features

### 1. 👥 Multi-Tenant SaaS Architecture
- **Franchise Support**: Integrated branch-level isolation (e.g., Valasarawakkam branch).
- **Trainer Portals**: Real-time member activity feeds and bulk plan assignment.
- **Supabase Backend**: Persistence with Row-Level Security (RLS) for data privacy.

### 2. 🔄 AI Meal Swap Engine (Elite Tier)
- **Macro-Matching**: Replace any meal with a macro-equivalent alternative from a 220+ food database.
- **Portion Math**: Automatically scales quantities to match original calories.
- **Cloud Persistence**: Remembers member swaps across all devices.

### 3. 🍱 Deeply Indian Food Database
- **220+ Items**: Specialized South Indian/Tamil Nadu database (Idli, Dosa, Chicken Biryani, etc.).
- **Medical Intelligence**: Custom logic for Diabetes, PCOS, Hypertension, and Celiac.

### 4. 📈 Real-Time Tracking & Reporting
- **Food Diaries**: Real-time member logging with trainer oversight.
- **Weekly Auto-Reports**: Generates analytical nutrition PDFs with 7-day trend charts.
- **PDF Blueprints**: Multi-page, branded PDF exports for print/sharing.

### 5. 📱 Production Launch (PWA & Payments)
- **PWA Installer**: Members can install the app on their phone home screens.
- **Razorpay Integration**: Professional checkout flow for plan unlocks and store products.
- **SEO & Social**: Branded OpenGraph previews for WhatsApp/Instagram sharing.

---

## 🛠️ Tech Stack

- **Framework**: React 18 / Vite 5
- **Backend**: Supabase (PostgreSQL + RLS)
- **Styling**: Vanilla CSS (Premium Micro-animations & Skeleton UIs)
- **Payments**: Razorpay Checkout SDK
- **Reporting**: jsPDF + Recharts

---

## 🚀 Getting Started

### 1. Database Setup
The app requires a **Supabase** instance. Run the following in your SQL Editor:
```sql
-- Core SaaS & Franchise Schema
-- [Location: src/lib/schema_tier4.sql]
```

### 2. Environment Variables (`.env`)
Create a `.env` file in the root with:
```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Installation
```bash
npm install
npm run dev
```

### 4. Production Launch Polish
- **Razorpay**: Replace the `rzp_test_...` key in `DietPlanBrain.jsx` with your **Live Key ID**.
- **SEO**: Update the `og:image` URL in `index.html` with your hosted brand logo.

---

## 🏢 Step2 Fitness Ecosystem
- **Trainer**: Manage 50+ members at scale.
- **Member**: Track nutrition, swap meals, and shop for supplements.
- **Manager**: Oversee branch-level revenue and member retention.

**Built for Step2 Fitness Studio, Chennai — The Future of Southern Performance Coaching.** 🚀🔥