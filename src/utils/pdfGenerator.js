import { LOGO_URI, BRAND, BRAND_DARK, DAYS } from "../data/constants";
import { WORKOUT_SCHEDULES, WORKOUT_DETAILS } from "../data/workouts";
import { IMAGES } from "../data/images";
import { SUPPLEMENT_PLANS, SUPPLEMENT_BRANDS } from "../data/supplements";
import { fetchMemberLogs } from "../hooks/useFoodLogs";

/**
 * Exports client's fitness plan to a PDF by creating a printable browser window
 */
export function exportPDF(client, metrics, meals, shop, gc, duration = "1 Week") {
  const win = window.open("", "_blank");
  const totalCal = meals.reduce((s, m) => s + m.cal, 0);
  const c = gc.color;

  win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Diet Plan for STEP2 FITNESS - ${client.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; color: #333; line-height: 1.5; background: #fdfdfd; }
    .cover { background: linear-gradient(135deg, ${BRAND_DARK}, ${BRAND}); color: #fff; padding: 60px 40px; text-align: center; position: relative; overflow: hidden; min-height: 500px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .cover::before { content: ''; position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: url('https://assets.newsweek.com/wp-content/uploads/2025/08/2180775-workout-healthy-food.png?w=1600&quality=80&webp=1') center/cover; opacity: 0.25; z-index: 1; }
    .cover > * { position: relative; z-index: 2; }
    .premium-badge { position: absolute; top: 30px; right: 0; background: #ffe082; color: #000; padding: 6px 20px; font-weight: 900; font-size: 14px; border-radius: 20px 0 0 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); letter-spacing: 1px; }
    .cover img { height: 100px; margin-bottom: 25px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); }
    .cover h1 { font-family: 'Oswald', sans-serif; font-size: 52px; margin: 0; letter-spacing: 4px; text-transform: uppercase; line-height: 1; }
    .gym-info { margin-top: 15px; font-weight: 700; font-size: 18px; opacity: 0.95; letter-spacing: 1px; }
    
    .section { padding: 40px; }
    .header-banner { position: relative; height: 140px; border-radius: 16px; overflow: hidden; margin-bottom: 25px; background-size: cover; background-position: center; border: 1px solid #eee; }
    .header-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2)); }
    .header-content { position: absolute; bottom: 20px; left: 25px; color: #fff; z-index: 2; }
    .header-title { font-size: 26px; font-weight: 900; margin: 0; font-family: 'Oswald', sans-serif; letter-spacing: 1px; }
    .header-sub { font-size: 14px; opacity: 0.9; margin-top: 5px; font-weight: 500; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
    .stat-card { background: #f9f9f9; padding: 16px; border-radius: 12px; border-left: 5px solid ${c}; box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
    .stat-label { font-size: 11px; color: #999; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; }
    .stat-value { font-size: 18px; font-weight: 900; color: #222; }

    .macros { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 35px; }
    .macro-card { background: ${c}08; border-radius: 14px; padding: 22px; border: 1.5px solid ${c}15; text-align: center; }
    .macro-card .mv { font-size: 32px; font-weight: 900; color: ${c}; font-family: 'Oswald', sans-serif; line-height: 1; }
    .macro-card .ml { font-size: 12px; color: #666; text-transform: uppercase; font-weight: 800; margin-top: 8px; letter-spacing: 0.5px; }

    table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 30px; border-radius: 12px; overflow: hidden; border: 1px solid #eee; }
    th { background: #f8f9fa; color: #555; padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 900; text-transform: uppercase; border-bottom: 2px solid #eee; }
    td { padding: 12px 16px; font-size: 13px; color: #444; border-bottom: 1px solid #f2f2f2; }
    tr:last-child td { border-bottom: none; }
    .total-row { background: #fdf2f2; }
    .total-row td { font-weight: 900; color: #000; font-size: 14px; }
    
    .guides { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; }
    .guide-tip { background: #fdfdfd; padding: 12px 15px; border-radius: 10px; border: 1px solid #f0f0f0; display: flex; align-items: flex-start; gap: 10px; font-size: 12px; }
    .guide-tick { color: ${c}; font-weight: 900; }

    .shop-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .shop-card { background: #fff; border: 1.5px solid #f0f0f0; border-radius: 12px; padding: 15px; border-left: 4px solid ${c}; }
    .shop-cat { font-weight: 900; color: ${c}; font-size: 14px; margin-bottom: 6px; }
    
    .supp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .supp-card { background: linear-gradient(135deg, white, #f9f9f9); border: 1.5px solid ${c}20; border-radius: 16px; padding: 20px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
    .supp-icon { font-size: 32px; margin-bottom: 10px; }
    .supp-title { font-weight: 900; font-size: 14px; color: #1a1a1a; margin-bottom: 5px; }
    .supp-brand { font-size: 11px; color: ${c}; font-weight: 800; background: ${c}10; padding: 3px 10px; border-radius: 8px; display: inline-block; margin-bottom: 8px; }
    .supp-info { font-size: 11px; color: #666; }

    .footer { text-align: center; padding: 40px; background: #fff; border-top: 1px solid #eee; margin-top: 40px; font-size: 11px; color: #777; }
    .footer-brand { color: ${BRAND}; font-weight: 900; font-size: 16px; margin-bottom: 10px; letter-spacing: 1px; }

    .page-break { page-break-before: always; }
    @media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="cover">
    <div class="premium-badge">PREMIUM ${duration.toUpperCase()} PLAN</div>
    <img src="${LOGO_URI}" alt="Step2 Fitness"/>
    <h1>DIET PLAN BRAIN</h1>
    <div class="gym-info">STEP2 FITNESS STUDIO • Valasarawakkam, Chennai - 600087</div>
  </div>

  <div style="background: ${BRAND}; color: #fff; padding: 25px 40px; display: flex; gap: 30px; align-items: flex-start;">
    <div style="flex-shrink: 0;">
      <img src="${LOGO_URI}" alt="Step2 Fitness" style="width: 70px; height: 70px; border-radius: 12px; background: #fff; padding: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);" />
    </div>
    <div style="flex: 1;">
      <div style="font-size: 11px; font-weight: 800; opacity: 0.9; letter-spacing: 1px; margin-bottom: 4px;">STEP2 FITNESS STUDIO • CHENNAI</div>
      <div style="font-size: 13px; opacity: 0.85; line-height: 1.4; margin-bottom: 8px;">
        📍 38, Sri Deivanayagam, Suresh Nagar Main Rd, Radha Avenue, Valasarawakkam • Chennai • Tamil Nadu 600087<br/>
        ⏰ Open: Closes 10 PM | 📞 9962444002
      </div>
      <div style="font-size: 32px; font-weight: 900; font-family: 'Oswald', sans-serif; margin: 8px 0; letter-spacing: 1px;">${client.name}</div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 10px;">
        <span style="background: rgba(255,255,255,0.25); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;">${client.goal}</span>
        <span style="background: rgba(255,255,255,0.25); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;">${client.gender === 'M' ? 'Male' : 'Female'}, ${client.age} yrs</span>
        <span style="background: rgba(255,255,255,0.25); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;">${client.height}cm / ${client.weight}kg</span>
        <span style="background: rgba(255,255,255,0.25); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;">${client.medical || 'Non-Veg'}</span>
        <span style="background: rgba(255,255,255,0.25); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;">Very Active</span>
        <span style="background: rgba(255,255,255,0.25); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;">BMI ${metrics.bmi} — ${metrics.bmiLabel}</span>
      </div>
    </div>
  </div>

  <div style="background: #fff; padding: 30px 40px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; border-bottom: 3px solid ${c};">
    <div style="text-align: center;">
      <div style="font-size: 28px; font-weight: 900; color: ${BRAND}; font-family: 'Oswald', sans-serif; line-height: 1;">${metrics.bmi}</div>
      <div style="font-size: 11px; color: #999; font-weight: 800; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.5px;">BMI</div>
      <div style="font-size: 12px; color: #666; margin-top: 4px; font-weight: 600;">${metrics.bmiLabel}</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 28px; font-weight: 900; color: ${BRAND}; font-family: 'Oswald', sans-serif; line-height: 1;">${metrics.tdee}</div>
      <div style="font-size: 11px; color: #999; font-weight: 800; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.5px;">TDEE</div>
      <div style="font-size: 12px; color: #666; margin-top: 4px; font-weight: 600;">KCAL/DAY</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 28px; font-weight: 900; color: ${BRAND}; font-family: 'Oswald', sans-serif; line-height: 1;">${metrics.targetCal}</div>
      <div style="font-size: 11px; color: #999; font-weight: 800; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.5px;">TARGET</div>
      <div style="font-size: 12px; color: #666; margin-top: 4px; font-weight: 600;">KCAL/DAY</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 28px; font-weight: 900; color: ${BRAND}; font-family: 'Oswald', sans-serif; line-height: 1;">${metrics.water}</div>
      <div style="font-size: 11px; color: #999; font-weight: 800; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.5px;">WATER</div>
      <div style="font-size: 12px; color: #666; margin-top: 4px; font-weight: 600;">PER DAY</div>
    </div>
  </div>

  <div class="section">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:3.5px solid ${c}; padding-bottom:25px; margin-bottom:35px;">
      <div>
        <div style="font-size:12px; color:#888; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Patient / Client Name</div>
        <div style="font-size:42px; font-weight:900; color:#111; font-family:'Oswald',sans-serif; line-height:1;">${client.name}</div>
        <div style="font-size:16px; font-weight:700; color:#555; margin-top:10px; letter-spacing:0.5px;">${client.age} Yrs • ${client.gender === 'M' ? 'Male' : 'Female'} • ${client.height}cm • ${client.weight}kg</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px; color:#888; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Primary Goal</div>
        <div style="font-size:28px; font-weight:900; color:${BRAND}; font-family:'Oswald',sans-serif;">${client.goal}</div>
        <div style="font-size:15px; font-weight:700; color:#444; margin-top:6px;">Plan Valid: <b>${duration}</b></div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">🎯 Goal Type</div><div class="stat-value">${client.goal}</div></div>
      <div class="stat-card"><div class="stat-label">🧬 BMI Score</div><div class="stat-value">${metrics.bmi} — ${metrics.bmiLabel}</div></div>
      <div class="stat-card"><div class="stat-label">💧 Water Req</div><div class="stat-value">${metrics.water} L / Day</div></div>
      <div class="stat-card"><div class="stat-label">🔥 Metabolism</div><div class="stat-value">${metrics.tdee} kcal</div></div>
      <div class="stat-card"><div class="stat-label">⚡ Adj Type</div><div class="stat-value">${(gc.adj > 0 ? "+" : "") + gc.adj} kcal</div></div>
      <div class="stat-card"><div class="stat-label">🩺 Medical</div><div class="stat-value">${client.medical || "None"}</div></div>
    </div>

    <div class="macros">
      <div class="macro-card"><div class="mv">${metrics.targetCal}</div><div class="ml">Daily Target KCAL</div></div>
      <div class="macro-card"><div class="mv">${metrics.protein}g</div><div class="ml">Daily Protein Goal</div></div>
      <div class="macro-card"><div class="mv">${metrics.carbs}g</div><div class="ml">Daily Carb Goal</div></div>
    </div>

    <h3 style="font-family:'Oswald',sans-serif; font-size:18px; color:#333; margin-bottom:15px; border-left:4px solid ${c}; padding-left:12px;">📊 Key Guidelines for ${client.goal}</h3>
    <div class="guides">
      ${[
      "Eat every 2.5–3 hours — never skip meals",
      `Drink ${metrics.water}L water spread throughout the day`,
      "Sleep 7–8 hours for optimal fat burn & recovery",
      "Pre-workout meal 30–45 min before training",
      "Post-workout protein within 45 min of training",
      client.goal === "Body Building" ? "Increase calories on heavy training days" : "Avoid eating 2+ hours before bedtime",
      "Progress photos every Sunday morning",
      "Re-assess plan every 4 weeks with trainer"
    ].map(tip => `
        <div class="guide-tip">
          <span class="guide-tick">✓</span>
          <span>${tip}</span>
        </div>
      `).join("")}
    </div>
  </div>

  <div class="section page-break">
    <div class="header-banner" style="background-image: url('${IMAGES.MealsHeader}');">
      <div class="header-overlay"></div>
      <div class="header-content">
        <h2 class="header-title">🍽️ DAILY MEAL PLAN</h2>
        <p class="header-sub">Custom Macro-Balanced Nutrition for ${client.goal}</p>
      </div>
    </div>
    <table>
      <thead><tr><th>Time</th><th>Meal</th><th>Foods (Chennai Market)</th><th>Cal</th><th>P</th><th>C</th><th>F</th></tr></thead>
      <tbody>
        ${meals.map(m => `
          <tr>
            <td style="font-weight:900; color:${BRAND};">${m.time}</td>
            <td style="font-weight:700;">${m.name}</td>
            <td style="color:#555;">${m.foods}</td>
            <td style="text-align:center; font-weight:800;">${m.cal}</td>
            <td style="text-align:center; color:#E53935;">${m.p}g</td>
            <td style="text-align:center; color:#0288D1;">${m.c}g</td>
            <td style="text-align:center; color:#00897B;">${m.f}g</td>
          </tr>
        `).join("")}
        <tr class="total-row">
          <td colspan="3">DAILY MACRO TOTALS</td>
          <td style="text-align:center;">${totalCal}</td>
          <td style="text-align:center;">${meals.reduce((s, m) => s + m.p, 0)}g</td>
          <td style="text-align:center;">${meals.reduce((s, m) => s + m.c, 0)}g</td>
          <td style="text-align:center;">${meals.reduce((s, m) => s + m.f, 0)}g</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section page-break">
    <div class="header-banner" style="background-image: url('${IMAGES[client.goal]}');">
      <div class="header-overlay"></div>
      <div class="header-content">
        <h2 class="header-title">📅 7-DAY TRAINING PROTOCOL</h2>
        <p class="header-sub">Optimized for ${client.activity} Active Lifestyle</p>
      </div>
    </div>
    <div style="display:flex; flex-direction:column; gap:12px;">
      ${DAYS.map((day, i) => {
      const schedule = (WORKOUT_SCHEDULES[client.goal] || WORKOUT_SCHEDULES.Maintenance);
      const w = schedule[i];
      const rest = w.toLowerCase().includes("rest") || w.toLowerCase().includes("recovery");
      const det = WORKOUT_DETAILS[w] || { img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=200&q=80", min: "45", ex: 8, int: 3 };
      return `
          <div style="display:flex; align-items:center; gap:20px; padding:15px; background:#fff; border-radius:16px; border:1px solid #f0f0f0;">
            <div style="width:70px; height:70px; border-radius:12px; overflow:hidden;">
              ${rest ?
          `<div style="width:100%; height:100%; background:#f5f5f5; display:flex; align-items:center; justify-content:center; font-size:30px;">😴</div>` :
          `<img src="${det.img}" style="width:100%; height:100%; object-fit:cover;" />`
        }
            </div>
            <div style="flex:1;">
              <div style="font-size:11px; font-weight:900; color:${BRAND}; text-transform:uppercase; letter-spacing:1px;">${day}</div>
              <div style="font-size:17px; font-weight:800; color:#111; margin:2px 0;">${w}</div>
              <div style="font-size:12px; color:#777;">${rest ? "Hydration & Active Recovery" : `${det.min} mins • ${det.ex} Exercises • ${"⚡".repeat(det.int)} Intensity`}</div>
            </div>
          </div>
        `;
    }).join("")}
    </div>
  </div>

  <div class="section page-break">
    <div class="header-banner" style="background-image: url('${IMAGES.ShoppingHeader}');">
      <div class="header-overlay"></div>
      <div class="header-content">
        <h2 class="header-title">🛒 WEEKLY SHOPPING LIST</h2>
        <p class="header-sub">Sourced for Local Chennai Markets</p>
      </div>
    </div>
    <div class="shop-grid">
      ${shop.map(s => `
        <div class="shop-card">
          <div class="shop-cat">${s.cat}</div>
          <div style="font-size:13px; color:#333; height: 50px;">${s.items}</div>
          <div style="font-size:11px; color:#888; font-weight:700; margin-top:8px;">Qty: ${s.qty} • Cost: ${s.cost}</div>
        </div>
      `).join("")}
    </div>
  </div>

  <div class="section page-break">
    <div class="header-banner" style="background-image: url('${IMAGES.SupplementsHeader}');">
      <div class="header-overlay"></div>
      <div class="header-content">
        <h2 class="header-title">💊 SUPPLEMENT GUIDE</h2>
        <p class="header-sub">Purity-Driven Dosage & Strategic Timing</p>
      </div>
    </div>
    <div class="supp-grid">
      ${(SUPPLEMENT_PLANS[client.goal] || ["Multivitamin", "Omega-3"]).map(s => {
      const info = SUPPLEMENT_BRANDS[s] || { icon: "💊", brands: "Available Local Stores", dose: "As directed", timing: "Post meal" };
      return `
          <div class="supp-card">
            <div class="supp-icon">${info.icon}</div>
            <div class="supp-title">${s}</div>
            <div class="supp-brand">📦 ${info.brands.split(',')[0]}</div>
            <div class="supp-info">
              <b>Dose:</b> ${info.dose} <br/> <b>Timing:</b> ${info.timing}
            </div>
          </div>
        `;
    }).join("")}
    </div>
    <div style="background:#fff7e6; border-radius:12px; padding:18px; margin-top:25px; border:1px solid #ffe082;">
      <h4 style="margin:0 0 5px 0; color:#f57c00; font-family:'Oswald',sans-serif;">⚠️ IMPORTANT NOTE</h4>
      <p style="margin:0; font-size:12px; color:#666;">Supplements are intended to support, not replace, a whole-food diet. Consult with Step2 Fitness trainers before initialization. ${client.medical !== "None" ? `Medical conditions like ${client.medical} require physician clearance.` : ""}</p>
    </div>
  </div>

  <div class="section page-break">
    <div class="header-banner" style="background-image: url('${IMAGES.TrackerHeader}');">
      <div class="header-overlay"></div>
      <div class="header-content">
        <h2 class="header-title">📈 4-WEEK MEASUREMENT LOG</h2>
        <p class="header-sub">Track Your Progress Every Sunday</p>
      </div>
    </div>
    <table>
      <thead><tr><th>Metric</th><th>Unit</th><th>Start</th><th>Wk 1</th><th>Wk 2</th><th>Wk 3</th><th>Wk 4</th><th>Change</th></tr></thead>
      <tbody>
        ${[["Body Weight", "kg", client.weight], ["Waist", "cm", "—"], ["Chest", "cm", "—"], ["Arms", "cm", "—"], ["Thighs", "cm", "—"], ["BMI Score", "", metrics.bmi], ["Compliance", "%", "—"]].map(([m, u, s]) => `
          <tr>
            <td style="font-weight:800;">${m}</td>
            <td style="color:#999; text-align:center;">${u}</td>
            <td style="font-weight:900; color:${BRAND}; text-align:center;">${s}</td>
            <td></td><td></td><td></td><td></td><td></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:15px; margin-top:30px;">
      ${["🎯 Month 1", "🔥 Month 2", "🏆 Month 3"].map((m, i) => `
        <div style="background:#f8f9fa; padding:15px; border-radius:12px; text-align:center; border:1px solid #eee;">
          <div style="font-weight:900; color:${BRAND}; font-size:14px; margin-bottom:10px;">${m}</div>
          <div style="font-size:11px; color:#666; font-weight:700;">${client.goal.includes("Loss") ? `${client.weight - (i + 1) * 3}kg Target` : "Gain +1.5kg Mass"}</div>
        </div>
      `).join("")}
    </div>
  </div>

  <div class="footer">
    <div class="footer-brand">STEP2 FITNESS STUDIO</div>
    <div style="margin-bottom:15px; font-weight:700; color:#555;">Chennai's Premier Body Construction Center</div>
    <div style="line-height:1.8;">
      📍 Valasarawakkam, Chennai - 600087<br/>
      📞 WhatsApp: 9962444002 | 7299534753<br/>
      🌐 www.step2fitness.in | 📧 step2fitness.official@gmail.com
    </div>
    <p style="margin-top:20px; color:#999; font-style:italic;">This plan is a general guideline. For best results, stay in touch with your coach daily.</p>
    <div style="margin-top:10px; opacity:0.6; font-size:10px;">Personalized plan for ${client.name} • Generated ${new Date().toLocaleDateString("en-IN")}</div>
  </div>
  <script>window.onload=()=>window.print()</script>
</body>
</html>
  `);
  win.document.close();
}

/**
 * Exports a weekly nutrition report for a member based on their food logs.
 */
export function exportWeeklyReport(client, logs, metrics) {
  const win = window.open("", "_blank");
  const c = BRAND; // Use brand color
  
  // Calculate 7-day data
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toDateString();
    const dayLogs = logs.filter(l => new Date(l.logged_at).toDateString() === dStr);
    const total = dayLogs.reduce((s, l) => s + l.calories, 0);
    last7Days.push({ date: dStr, shortDate: d.toLocaleDateString([], { weekday: 'short', day: 'numeric' }), total });
  }

  const avgCal = Math.round(last7Days.reduce((s, d) => s + d.total, 0) / 7);
  const maxCal = Math.max(...last7Days.map(d => d.total), metrics.targetCal);
  const compliance = Math.round((avgCal / metrics.targetCal) * 100);

  win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Weekly Report - ${client.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Roboto', sans-serif; margin: 0; padding: 40px; color: #333; line-height: 1.5; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 4px solid ${c}; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { font-family: 'Oswald', sans-serif; font-size: 32px; margin: 0; color: ${BRAND_DARK}; text-transform: uppercase; }
    .header-sub { font-size: 14px; color: #666; font-weight: 700; margin-top: 5px; }
    
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
    .stat-card { background: #f8f9fa; padding: 20px; border-radius: 16px; border: 1px solid #eee; text-align: center; }
    .stat-label { font-size: 11px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .stat-value { font-size: 28px; font-weight: 900; color: ${c}; font-family: 'Oswald', sans-serif; }
    
    .chart-container { margin-bottom: 40px; }
    .chart-box { height: 250px; display: flex; align-items: flex-end; gap: 15px; padding: 0 10px; border-bottom: 2px solid #eee; position: relative; }
    .bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
    .bar { width: 100%; border-radius: 8px 8px 0 0; transition: height 0.3s; background: linear-gradient(to top, ${BRAND_DARK}, ${c}); }
    .bar-val { font-size: 11px; font-weight: 900; margin-bottom: 5px; color: #555; }
    .bar-label { font-size: 10px; font-weight: 700; color: #888; margin-top: 8px; white-space: nowrap; }
    .target-line { position: absolute; left: 0; right: 0; border-top: 2px dashed #ff5252; z-index: 10; pointer-events: none; }
    .target-label { position: absolute; right: 0; top: -18px; color: #ff5252; font-size: 10px; font-weight: 900; background: #fff; padding: 2px 8px; border-radius: 4px; border: 1px solid #ff525215; }

    .table-section { margin-bottom: 40px; }
    table { width: 100%; border-collapse: collapse; border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
    th { background: #f8f9fa; padding: 12px 15px; text-align: left; font-size: 12px; font-weight: 900; text-transform: uppercase; color: #555; border-bottom: 2px solid #eee; }
    td { padding: 12px 15px; font-size: 13px; border-bottom: 1px solid #f2f2f2; }
    
    .footer { text-align: center; border-top: 1px solid #eee; padding-top: 30px; font-size: 11px; color: #999; margin-top: 40px; }
    .compliance-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 900; margin-top: 8px; }
    
    @media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Weekly Nutrition Report</h1>
      <div class="header-sub">Member: ${client.name} • ${new Date().toLocaleDateString("en-IN")}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-weight: 900; font-size: 18px; color: ${BRAND};">STEP2 FITNESS</div>
      <div style="font-size: 10px; color: #888; letter-spacing: 1px;">BODY CONSTRUCTION CENTER</div>
    </div>
  </div>

  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-label">Daily Avg. Intake</div>
      <div class="stat-value">${avgCal} <span style="font-size: 14px;">kcal</span></div>
      <div class="compliance-pill" style="background: ${compliance >= 90 && compliance <= 110 ? '#e8f5e9' : '#fbe9e7'}; color: ${compliance >= 90 && compliance <= 110 ? '#2e7d32' : '#d84315'};">
        ${compliance}% Compliance
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Your Daily Target</div>
      <div class="stat-value">${metrics.targetCal} <span style="font-size: 14px;">kcal</span></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Meals Tracked</div>
      <div class="stat-value">${logs.length} <span style="font-size: 14px;">Log Entries</span></div>
    </div>
  </div>

  <div class="chart-container">
    <h3 style="font-family: 'Oswald', sans-serif; margin-bottom: 25px; text-transform: uppercase; font-size: 16px; border-left: 5px solid ${c}; padding-left: 15px;">7-Day Calorie Tracker</h3>
    <div class="chart-box">
      <div class="target-line" style="bottom: ${(metrics.targetCal / maxCal) * 250}px;">
        <span class="target-label">Target: ${metrics.targetCal} kcal</span>
      </div>
      ${last7Days.map(d => `
        <div class="bar-wrapper">
          <div class="bar-val">${d.total || "—"}</div>
          <div class="bar" style="height: ${(d.total / maxCal) * 250}px; opacity: ${d.total === 0 ? 0.3 : 1};"></div>
          <div class="bar-label">${d.shortDate}</div>
        </div>
      `).join("")}
    </div>
  </div>

  <div class="table-section">
    <h3 style="font-family: 'Oswald', sans-serif; margin-bottom: 15px; text-transform: uppercase; font-size: 16px; border-left: 5px solid ${c}; padding-left: 15px;">Detailed Breakdown</h3>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Food Logs</th>
          <th>Daily Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${last7Days.slice().reverse().map(d => {
          const status = d.total === 0 ? "No data" : d.total > metrics.targetCal + 200 ? "Over Limit 🔴" : d.total < metrics.targetCal - 200 ? "Under Limit 🟡" : "Target Hit 🟢";
          return `
            <tr>
              <td style="font-weight: 800;">${d.date}</td>
              <td style="font-size: 11px; color: #666;">${logs.filter(l => new Date(l.logged_at).toDateString() === d.date).map(l => l.food_name).join(", ") || "—"}</td>
              <td style="font-weight: 900; color: ${BRAND};">${d.total} kcal</td>
              <td style="font-weight: 700; color: #555;">${status}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  </div>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 16px; border: 1px solid #eee; margin-top: 30px;">
    <h4 style="margin: 0 0 10px 0; font-family: 'Oswald', sans-serif; color: ${BRAND_DARK}; text-transform: uppercase;">Trainer's Recommendations</h4>
    <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.6;">
      ${compliance > 110 ? "You are consistently exceeding your calorie target. Focus on portion control and high-protein/low-calorie snacks to stay within the range." :
        compliance < 90 && avgCal > 0 ? "You are below your maintenance calories. Try to incorporate more calorie-dense whole foods to avoid muscle loss." :
        avgCal === 0 ? "We need more data! Please log every meal for the next 7 days so I can analyze your progress effectively." :
        "Great work! Your consistency is excellent. Maintain this intake for another 2 weeks to see compounding results."
      }
    </p>
  </div>

  <div class="footer">
    <div style="font-weight: 900; letter-spacing: 1px; color: ${BRAND};">STEP2 FITNESS STUDIO • CHENNAI</div>
    <div style="margin-top: 10px;">Generated for ${client.name} • ${new Date().toLocaleTimeString()}</div>
  </div>
  <script>window.onload=()=>window.print()</script>
</body>
</html>
  `);
  win.document.close();
}
