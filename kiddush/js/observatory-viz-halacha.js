/* observatory-viz-halacha.js – Rich visualizations for halacha-by-halacha mode */

(function(){
'use strict';

/* SVG helper */
function svg(w,h,content){
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:100%" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
}

/* Centered overlay container */
function centered(html, maxW){
  maxW = maxW || 500;
  return `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
    max-width:${maxW}px;width:90%;pointer-events:none">${html}</div>`;
}

/* Bottom annotation */
function bottomNote(html){
  return `<div style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);
    background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);padding:5px 14px;border-radius:8px;
    border:1px solid rgba(255,255,255,0.1);color:#ccc;font-size:0.7rem;text-align:center;
    font-family:var(--font-body);direction:rtl;max-width:400px">${html}</div>`;
}

/* ══════════════════════════════════════════
   CHAPTER 11 vizModes
   ══════════════════════════════════════════ */

const ZODIAC_NAMES = ['טלה','שור','תאומים','סרטן','אריה','בתולה','מאזניים','עקרב','קשת','גדי','דלי','דגים'];
const ZODIAC_COLORS = ['#ef4444','#22c55e','#f59e0b','#3b82f6','#ef4444','#22c55e','#f59e0b','#3b82f6','#ef4444','#22c55e','#f59e0b','#3b82f6'];

function vizDegreeCircle(){
  // Animated circle filling with degrees, zoom to 1° showing minutes
  const r = 120, cx = 200, cy = 150;
  let ticks = '';
  for(let d=0; d<360; d+=10){
    const a = d * Math.PI/180 - Math.PI/2;
    const x1 = cx + Math.cos(a)*(r-8), y1 = cy + Math.sin(a)*(r-8);
    const x2 = cx + Math.cos(a)*(r+2), y2 = cy + Math.sin(a)*(r+2);
    const xl = cx + Math.cos(a)*(r+14), yl = cy + Math.sin(a)*(r+14);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f4d03f" stroke-width="${d%90===0?2:0.5}" opacity="${d%30===0?1:0.4}"/>`;
    if(d % 30 === 0) ticks += `<text x="${xl}" y="${yl+3}" text-anchor="middle" fill="#f4d03f" font-size="8" font-weight="bold">${d}°</text>`;
  }
  // Zoom box showing 1° = 60'
  const zoomBox = `<rect x="300" y="60" width="90" height="70" rx="6" fill="rgba(0,0,0,0.6)" stroke="#f4d03f" stroke-width="1"/>
    <text x="345" y="78" text-anchor="middle" fill="#f4d03f" font-size="9" font-weight="bold">זום: 1 מעלה</text>
    <line x1="310" y1="90" x2="380" y2="90" stroke="#888" stroke-width="1"/>
    ${Array.from({length:6},(_, i) => `<line x1="${310+i*12}" y1="88" x2="${310+i*12}" y2="100" stroke="#87CEEB" stroke-width="0.5"/>`).join('')}
    <text x="345" y="108" text-anchor="middle" fill="#87CEEB" font-size="7">60 דקות = 1°</text>
    <text x="345" y="120" text-anchor="middle" fill="#999" font-size="6">60 שניות = 1 דקה</text>`;

  return centered(svg(400, 300,
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f4d03f" stroke-width="1.5"/>
    ${ticks}
    <text x="${cx}" y="${cy+4}" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">360°</text>
    <text x="${cx}" y="${cy+18}" text-anchor="middle" fill="#999" font-size="8">עיגול שלם</text>
    ${zoomBox}`
  ));
}

function vizZodiacRing(){
  const r = 110, cx = 200, cy = 150;
  let signs = '';
  for(let i=0; i<12; i++){
    const a1 = (i*30) * Math.PI/180 - Math.PI/2;
    const a2 = ((i+1)*30) * Math.PI/180 - Math.PI/2;
    const amid = ((i*30+15)) * Math.PI/180 - Math.PI/2;
    // Sector line
    const x1 = cx + Math.cos(a2)*(r-15), y1 = cy + Math.sin(a2)*(r-15);
    const x2 = cx + Math.cos(a2)*(r+5), y2 = cy + Math.sin(a2)*(r+5);
    signs += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#555" stroke-width="0.5"/>`;
    // Name
    const xl = cx + Math.cos(amid)*(r-30), yl = cy + Math.sin(amid)*(r-30);
    signs += `<text x="${xl}" y="${yl+3}" text-anchor="middle" fill="${ZODIAC_COLORS[i]}" font-size="7" font-weight="bold">${ZODIAC_NAMES[i]}</text>`;
    // Degree label
    const xd = cx + Math.cos(amid)*(r+15), yd = cy + Math.sin(amid)*(r+15);
    signs += `<text x="${xd}" y="${yd+3}" text-anchor="middle" fill="#888" font-size="5">${i*30}°-${(i+1)*30}°</text>`;
  }
  return centered(svg(400, 300,
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#8b5cf6" stroke-width="1.5" opacity="0.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r-15}" fill="none" stroke="#8b5cf6" stroke-width="0.5" opacity="0.3" stroke-dasharray="2,2"/>
    ${signs}
    <text x="${cx}" y="${cy+4}" text-anchor="middle" fill="#8b5cf6" font-size="10">12 מזלות</text>
    <text x="${cx}" y="${cy+16}" text-anchor="middle" fill="#999" font-size="7">כל אחד 30°</text>`
  ));
}

function vizDegreeToSign(deg, signIdx, remainder){
  const r = 100, cx = 180, cy = 140;
  // Highlight the target sign
  let ring = '';
  for(let i=0; i<12; i++){
    const a1 = (i*30)*Math.PI/180-Math.PI/2;
    const a2 = ((i+1)*30)*Math.PI/180-Math.PI/2;
    const amid = ((i*30+15))*Math.PI/180-Math.PI/2;
    const xl = cx+Math.cos(amid)*(r-20), yl = cy+Math.sin(amid)*(r-20);
    const isTarget = i === signIdx;
    ring += `<text x="${xl}" y="${yl+3}" text-anchor="middle" fill="${isTarget?'#f4d03f':'#555'}" font-size="${isTarget?9:6}" font-weight="${isTarget?'bold':'normal'}">${ZODIAC_NAMES[i]}</text>`;
    if(isTarget){
      // Highlight arc
      const x1s=cx+Math.cos(a1)*r, y1s=cy+Math.sin(a1)*r;
      const x2s=cx+Math.cos(a2)*r, y2s=cy+Math.sin(a2)*r;
      ring += `<path d="M${x1s},${y1s} A${r},${r} 0 0,1 ${x2s},${y2s}" fill="none" stroke="#f4d03f" stroke-width="3"/>`;
    }
  }
  // Calculation box
  const calc = `<rect x="290" y="50" width="100" height="90" rx="8" fill="rgba(0,0,0,0.6)" stroke="#f4d03f" stroke-width="1"/>
    <text x="340" y="72" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">${deg}°</text>
    <text x="340" y="88" text-anchor="middle" fill="#ccc" font-size="8">÷ 30 =</text>
    <text x="340" y="106" text-anchor="middle" fill="#f4d03f" font-size="10" font-weight="bold">${signIdx} מזלות + ${remainder}°</text>
    <text x="340" y="122" text-anchor="middle" fill="#87CEEB" font-size="9">→ ${ZODIAC_NAMES[signIdx]} ${remainder}°</text>`;

  return centered(svg(400,280,
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#555" stroke-width="0.5"/>
    ${ring} ${calc}`
  ));
}

function vizAddDegrees(){
  return centered(`<div style="background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:16px 20px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body)">
    <div style="text-align:center;margin-bottom:12px;color:#f4d03f;font-size:0.9rem;font-weight:700">חיבור מעלות ודקות</div>
    <div style="display:flex;flex-direction:column;gap:8px;font-size:0.8rem;color:#ccc">
      <div style="display:flex;justify-content:space-between;padding:4px 8px;background:rgba(135,206,235,0.1);border-radius:6px">
        <span>200° 45\'</span><span style="color:#87CEEB">מספר ראשון</span>
      </div>
      <div style="text-align:center;color:#f4d03f;font-size:1rem">+</div>
      <div style="display:flex;justify-content:space-between;padding:4px 8px;background:rgba(135,206,235,0.1);border-radius:6px">
        <span>170° 30\'</span><span style="color:#87CEEB">מספר שני</span>
      </div>
      <div style="border-top:1px solid #555;padding-top:6px;display:flex;justify-content:space-between">
        <span style="color:#f4d03f;font-weight:700">370° 75\'</span><span style="color:#999">תוצאה ראשונית</span>
      </div>
      <div style="padding:4px 8px;background:rgba(239,68,68,0.1);border-radius:6px;border:1px solid rgba(239,68,68,0.3)">
        <span style="color:#ef4444">75\' > 60\' → 75\'-60\' = 15\', +1°</span>
      </div>
      <div style="padding:4px 8px;background:rgba(239,68,68,0.1);border-radius:6px;border:1px solid rgba(239,68,68,0.3)">
        <span style="color:#ef4444">371° > 360° → 371°-360° = 11°</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 8px;background:rgba(52,211,153,0.1);border-radius:6px;border:1px solid rgba(52,211,153,0.3)">
        <span style="color:#34d399;font-weight:700;font-size:1rem">11° 15\'</span><span style="color:#34d399">✓ תוצאה סופית</span>
      </div>
    </div>
  </div>`, 340);
}

function vizSubDegrees(){
  return centered(`<div style="background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:16px 20px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body)">
    <div style="text-align:center;margin-bottom:12px;color:#f4d03f;font-size:0.9rem;font-weight:700">חיסור מעלות ודקות</div>
    <div style="display:flex;flex-direction:column;gap:8px;font-size:0.8rem;color:#ccc">
      <div style="display:flex;justify-content:space-between;padding:4px 8px;background:rgba(135,206,235,0.1);border-radius:6px">
        <span>100° 30\'</span><span style="color:#87CEEB">ממספר</span>
      </div>
      <div style="text-align:center;color:#ef4444;font-size:1rem">−</div>
      <div style="display:flex;justify-content:space-between;padding:4px 8px;background:rgba(135,206,235,0.1);border-radius:6px">
        <span>200° 50\'</span><span style="color:#87CEEB">מחסירים</span>
      </div>
      <div style="padding:4px 8px;background:rgba(244,208,63,0.1);border-radius:6px;border:1px solid rgba(244,208,63,0.3)">
        <span style="color:#f4d03f">100° < 200° → מוסיפים 360° → 460°</span>
      </div>
      <div style="padding:4px 8px;background:rgba(244,208,63,0.1);border-radius:6px;border:1px solid rgba(244,208,63,0.3)">
        <span style="color:#f4d03f">30\' < 50\' → לוקחים 1° = 60\' → 459° 90\'</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 8px;background:rgba(52,211,153,0.1);border-radius:6px;border:1px solid rgba(52,211,153,0.3)">
        <span style="color:#34d399;font-weight:700;font-size:1rem">259° 40\'</span><span style="color:#34d399">✓ תוצאה</span>
      </div>
    </div>
  </div>`, 340);
}

function vizEpicycleAnim(){
  // This uses the 3D model, but adds clear labels
  return `<div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);
    padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);max-width:200px">
    <div style="font-size:0.75rem;color:#ff9933;font-weight:700;margin-bottom:4px">⟲ גלגל גדול (נושא)</div>
    <div style="font-size:0.6rem;color:#999;margin-bottom:6px">מסלול השמש — מרכזו מוזז מהארץ</div>
    <div style="font-size:0.75rem;color:#ffcc44;font-weight:700;margin-bottom:4px">⟳ גלגל קטן</div>
    <div style="font-size:0.6rem;color:#999;margin-bottom:6px">השמש זזה עליו בפועל</div>
    <div style="border-top:1px solid #444;padding-top:6px;margin-top:4px">
      <div style="font-size:0.65rem;color:#34d399">📍 בצד הפנימי = <b>קרוב</b> → נראה מהיר</div>
      <div style="font-size:0.65rem;color:#ef4444;margin-top:2px">📍 בצד החיצוני = <b>רחוק</b> → נראה איטי</div>
    </div>
  </div>`;
}

function vizMeanVsTrue(){
  return `<div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:16px;align-items:center;direction:rtl;
    background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);padding:8px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);font-family:var(--font-body)">
    <div style="display:flex;align-items:center;gap:6px">
      <div style="width:12px;height:12px;border-radius:50%;background:#ff9933"></div>
      <span style="color:#ff9933;font-size:0.75rem;font-weight:700">אמצעי</span>
      <span style="color:#999;font-size:0.6rem">(תיאורטי, קצב קבוע)</span>
    </div>
    <div style="color:#555;font-size:1rem">≠</div>
    <div style="display:flex;align-items:center;gap:6px">
      <div style="width:12px;height:12px;border-radius:50%;background:#f4d03f"></div>
      <span style="color:#f4d03f;font-size:0.75rem;font-weight:700">אמיתי</span>
      <span style="color:#999;font-size:0.6rem">(מה שרואים בשמיים)</span>
    </div>
  </div>`;
}

function vizCorrectionArrow(){
  return centered(`<div style="background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);text-align:center">
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:10px">
      <div style="padding:6px 14px;border-radius:20px;background:rgba(255,150,50,0.15);border:1px solid rgba(255,150,50,0.3)">
        <span style="color:#ff9933;font-weight:700;font-size:0.85rem">מיקום אמצעי</span>
      </div>
      <div style="font-size:1.2rem;color:#f4d03f">→ ± →</div>
      <div style="padding:6px 14px;border-radius:20px;background:rgba(244,208,63,0.15);border:1px solid rgba(244,208,63,0.3)">
        <span style="color:#f4d03f;font-weight:700;font-size:0.85rem">מיקום אמיתי</span>
      </div>
    </div>
    <div style="display:flex;justify-content:center;gap:20px;font-size:0.7rem">
      <div style="color:#34d399">בצד הקרוב → <b>מוסיפים</b> (+)</div>
      <div style="color:#ef4444">בצד הרחוק → <b>מחסירים</b> (−)</div>
    </div>
    <div style="color:#888;font-size:0.6rem;margin-top:6px">ההפרש = "מנת המסלול" = התיקון</div>
  </div>`, 420);
}

function vizJerusalemMap(){
  return bottomNote('📍 ירושלים — 32° צפון, 35° מזרח<br><span style="color:#f4d03f">כל החישובים נעשים עבור מיקום זה</span>');
}

function vizLongitudeShift(){
  return centered(`<div style="background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:14px 18px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);text-align:center">
    <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:8px">
      <div style="text-align:center">
        <div style="font-size:1.2rem">🌍</div>
        <div style="color:#87CEEB;font-size:0.7rem">מזרח</div>
        <div style="color:#34d399;font-size:0.6rem">רואה מוקדם</div>
      </div>
      <div style="font-size:0.8rem;color:#f4d03f">← ירושלים →</div>
      <div style="text-align:center">
        <div style="font-size:1.2rem">🌍</div>
        <div style="color:#ff9933;font-size:0.7rem">מערב</div>
        <div style="color:#ef4444;font-size:0.6rem">רואה מאוחר</div>
      </div>
    </div>
    <div style="color:#999;font-size:0.6rem">כל 1° אורך = ~4 דקות הפרש</div>
  </div>`, 350);
}

/* ══════════════════════════════════════════
   CHAPTER 12 vizModes
   ══════════════════════════════════════════ */

function vizSunMotionTable(){
  return centered(`<div style="background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body)">
    <div style="text-align:center;color:#ffcc44;font-size:0.85rem;font-weight:700;margin-bottom:8px">☀ מהלך השמש האמצעי</div>
    <table style="width:100%;border-collapse:collapse;font-size:0.7rem;color:#ccc">
      <tr style="background:rgba(255,200,50,0.1)"><td style="padding:3px 6px">יום אחד</td><td style="text-align:left;color:#f4d03f;font-weight:700">0° 59\' 8"</td></tr>
      <tr><td style="padding:3px 6px">10 ימים</td><td style="text-align:left">9° 51\' 23"</td></tr>
      <tr style="background:rgba(255,255,255,0.03)"><td style="padding:3px 6px">100 ימים</td><td style="text-align:left">98° 33\' 53"</td></tr>
      <tr><td style="padding:3px 6px">29 ימים (חודש)</td><td style="text-align:left">28° 35\' 1"</td></tr>
      <tr style="background:rgba(255,255,255,0.03)"><td style="padding:3px 6px">שנה רגילה (354)</td><td style="text-align:left">348° 55\' 15"</td></tr>
      <tr><td style="padding:3px 6px">שנה מעוברת (383)</td><td style="text-align:left">377° 30\' 16"</td></tr>
    </table>
  </div>`, 320);
}

function vizApogeePoint(){
  return `<div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);
    padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);max-width:180px">
    <div style="color:#ff9933;font-size:0.75rem;font-weight:700">📍 נקודת הגובה (אפוגיאום)</div>
    <div style="color:#999;font-size:0.6rem;margin-top:2px">הנקודה הכי רחוקה מהארץ</div>
    <div style="color:#f4d03f;font-size:0.65rem;margin-top:4px">מיקום: 86° 45\' (סוף תאומים)</div>
    <div style="color:#888;font-size:0.55rem;margin-top:2px">זזה ~1° כל 70 שנה</div>
  </div>`;
}

/* ══════════════════════════════════════════
   CHAPTER 13 vizModes
   ══════════════════════════════════════════ */

function vizCourseCalc(){
  return centered(`<div style="background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);text-align:center">
    <div style="color:#f4d03f;font-size:0.85rem;font-weight:700;margin-bottom:10px">חישוב מנת המסלול</div>
    <div style="display:flex;align-items:center;justify-content:center;gap:10px;font-size:1rem">
      <div style="padding:6px 12px;border-radius:8px;background:rgba(135,206,235,0.15);border:1px solid rgba(135,206,235,0.3);color:#87CEEB">שמש אמצעית</div>
      <span style="color:#ef4444;font-weight:700">−</span>
      <div style="padding:6px 12px;border-radius:8px;background:rgba(255,150,50,0.15);border:1px solid rgba(255,150,50,0.3);color:#ff9933">גובה השמש</div>
      <span style="color:#f4d03f;font-weight:700">=</span>
      <div style="padding:6px 12px;border-radius:8px;background:rgba(244,208,63,0.15);border:1px solid rgba(244,208,63,0.3);color:#f4d03f;font-weight:700">מנת המסלול</div>
    </div>
    <div style="color:#999;font-size:0.6rem;margin-top:8px">מנת המסלול קובעת כמה לתקן</div>
  </div>`, 500);
}

function vizAddSubRule(){
  // Half circle diagram: top = subtract, bottom = add
  const r = 80, cx = 150, cy = 120;
  return centered(svg(300, 240,
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#555" stroke-width="1"/>
    <line x1="${cx-r}" y1="${cy}" x2="${cx+r}" y2="${cy}" stroke="#888" stroke-width="1" stroke-dasharray="3,3"/>
    <!-- Top half: subtract -->
    <path d="M${cx-r},${cy} A${r},${r} 0 0,1 ${cx+r},${cy}" fill="rgba(239,68,68,0.1)" stroke="none"/>
    <text x="${cx}" y="${cy-30}" text-anchor="middle" fill="#ef4444" font-size="14" font-weight="bold">−</text>
    <text x="${cx}" y="${cy-15}" text-anchor="middle" fill="#ef4444" font-size="8">מחסירים (0°-180°)</text>
    <!-- Bottom half: add -->
    <path d="M${cx+r},${cy} A${r},${r} 0 0,1 ${cx-r},${cy}" fill="rgba(52,211,153,0.1)" stroke="none"/>
    <text x="${cx}" y="${cy+35}" text-anchor="middle" fill="#34d399" font-size="14" font-weight="bold">+</text>
    <text x="${cx}" y="${cy+50}" text-anchor="middle" fill="#34d399" font-size="8">מוסיפים (180°-360°)</text>
    <!-- Labels -->
    <text x="${cx}" y="${cy-r-8}" text-anchor="middle" fill="#f4d03f" font-size="9" font-weight="bold">0°</text>
    <text x="${cx}" y="${cy+r+14}" text-anchor="middle" fill="#f4d03f" font-size="9" font-weight="bold">180°</text>
    <text x="${cx-r-12}" y="${cy+3}" text-anchor="middle" fill="#999" font-size="7">270°</text>
    <text x="${cx+r+12}" y="${cy+3}" text-anchor="middle" fill="#999" font-size="7">90°</text>
    <circle cx="${cx}" cy="${cy-r}" r="4" fill="#f4d03f"/>
    <circle cx="${cx}" cy="${cy+r}" r="4" fill="#f4d03f"/>
    `
  ), 300);
}

function vizSunCorrTable(){
  const data = [[10,'0°20\''], [20,'0°40\''], [30,'0°58\''], [40,'1°15\''], [50,'1°29\''],
                [60,'1°59\''], [70,'2°5\''], [80,'2°8\''], [90,'2°5\''],
                [100,'1°59\''], [110,'1°49\''], [120,'1°37\''], [130,'1°22\''], [140,'1°4\''],
                [150,'0°45\''], [160,'0°30\''], [170,'0°15\''], [180,'0°0\'']];
  const rows = data.map(([deg,corr],i) => {
    const bg = deg===80 ? 'background:rgba(244,208,63,0.15)' : (i%2===0 ? 'background:rgba(255,255,255,0.03)' : '');
    const peak = deg===80 ? ';color:#f4d03f;font-weight:700' : '';
    return `<tr style="${bg}"><td style="padding:2px 6px;font-size:0.6rem;color:#999">${deg}°</td><td style="padding:2px 6px;text-align:left;font-size:0.65rem;color:#ccc${peak}">${corr}${deg===80?' ← שיא!':''}</td></tr>`;
  }).join('');
  return centered(`<div style="background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);max-height:280px;overflow-y:auto">
    <div style="text-align:center;color:#ffcc44;font-size:0.8rem;font-weight:700;margin-bottom:6px">טבלת תיקוני השמש</div>
    <table style="width:100%;border-collapse:collapse"><tr style="border-bottom:1px solid #444"><th style="padding:2px 6px;text-align:right;font-size:0.6rem;color:#888">מנה</th><th style="padding:2px 6px;text-align:left;font-size:0.6rem;color:#888">תיקון</th></tr>${rows}</table>
  </div>`, 260);
}

function vizMoonCorrTable(){
  const data = [[10,'0°52\''], [20,'1°43\''], [30,'2°30\''], [40,'3°13\''], [50,'3°50\''],
                [60,'4°20\''], [70,'4°46\''], [80,'5°1\''], [90,'5°8\''],
                [100,'5°1\''], [110,'4°46\''], [120,'4°20\''], [130,'3°50\''], [140,'3°13\''],
                [150,'2°30\''], [160,'1°43\''], [170,'0°52\''], [180,'0°0\'']];
  const rows = data.map(([deg,corr],i) => {
    const bg = deg===90 ? 'background:rgba(135,206,235,0.15)' : (i%2===0 ? 'background:rgba(255,255,255,0.03)' : '');
    const peak = deg===90 ? ';color:#87CEEB;font-weight:700' : '';
    return `<tr style="${bg}"><td style="padding:2px 6px;font-size:0.6rem;color:#999">${deg}°</td><td style="padding:2px 6px;text-align:left;font-size:0.65rem;color:#ccc${peak}">${corr}${deg===90?' ← שיא!':''}</td></tr>`;
  }).join('');
  return centered(`<div style="background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);max-height:280px;overflow-y:auto">
    <div style="text-align:center;color:#87CEEB;font-size:0.8rem;font-weight:700;margin-bottom:6px">טבלת תיקוני הירח</div>
    <table style="width:100%;border-collapse:collapse"><tr style="border-bottom:1px solid #444"><th style="padding:2px 6px;text-align:right;font-size:0.6rem;color:#888">מנה</th><th style="padding:2px 6px;text-align:left;font-size:0.6rem;color:#888">תיקון</th></tr>${rows}</table>
    <div style="text-align:center;color:#ef4444;font-size:0.6rem;margin-top:4px">שיא: 5°8\' — פי 2.5 מהשמש!</div>
  </div>`, 260);
}

function vizInterpCalc(){
  return centered(`<div style="background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);text-align:center">
    <div style="color:#f4d03f;font-size:0.85rem;font-weight:700;margin-bottom:8px">אינטרפולציה — חישוב בין שני ערכים</div>
    <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px">
      <div style="padding:4px 10px;border-radius:6px;background:rgba(135,206,235,0.1);border:1px solid rgba(135,206,235,0.3);color:#87CEEB;font-size:0.75rem">60° → 1°59\'</div>
      <div style="color:#f4d03f;font-size:0.8rem">⟵ <b>65°</b> ⟶</div>
      <div style="padding:4px 10px;border-radius:6px;background:rgba(135,206,235,0.1);border:1px solid rgba(135,206,235,0.3);color:#87CEEB;font-size:0.75rem">70° → 2°5\'</div>
    </div>
    <div style="font-size:0.7rem;color:#ccc;line-height:1.6">
      הפרש: 2°5\' - 1°59\' = <b style="color:#f4d03f">6\'</b><br>
      65° = 50% מהדרך → 50% × 6\' = <b style="color:#f4d03f">3\'</b><br>
      תוצאה: 1°59\' + 3\' = <b style="color:#34d399;font-size:0.85rem">2°2\'</b>
    </div>
  </div>`, 400);
}

function vizDoubleElong(){
  return `<div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);
    background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);padding:8px 16px;border-radius:10px;
    border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);text-align:center">
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:0.8rem">
      <span style="color:#87CEEB">ירח</span>
      <span style="color:#ccc">−</span>
      <span style="color:#ffcc44">שמש</span>
      <span style="color:#ccc">= מרחק</span>
      <span style="color:#f4d03f;font-weight:700">× 2</span>
      <span style="color:#ccc">= כפל מרחק</span>
    </div>
    <div style="color:#999;font-size:0.6rem;margin-top:4px">כפל המרחק משמש למציאת התיקון הראשון</div>
  </div>`;
}

/* ══════════════════════════════════════════
   Register all vizModes
   ══════════════════════════════════════════ */

window.halachaVizModes = {
  // Chapter 11
  degreeCircle: vizDegreeCircle,
  zodiacRing: vizZodiacRing,
  degreeToSign: () => vizDegreeToSign(200, 6, 20),
  degreeToSign2: () => vizDegreeToSign(320, 10, 20),
  addDegrees: vizAddDegrees,
  subDegrees: vizSubDegrees,
  subExample: vizSubDegrees, // same visualization
  epicycleAnim: vizEpicycleAnim,
  meanVsTrue: vizMeanVsTrue,
  correctionArrow: vizCorrectionArrow,
  jerusalemMap: vizJerusalemMap,
  longitudeShift: vizLongitudeShift,
  // Chapter 12
  sunMotionTable: vizSunMotionTable,
  apogeePoint: vizApogeePoint,
  // Chapter 13
  courseCalc: vizCourseCalc,
  addSubRule: vizAddSubRule,
  sunCorrTable: vizSunCorrTable,
  interpCalc: vizInterpCalc,
  interpIntro: vizInterpCalc,
  corrExample1: vizCourseCalc, // uses same layout
  fullSunExample: vizCourseCalc,
  // Chapter 14 — uses existing 3D vizModes from scene.js
  // Chapter 15
  moonCorrTable: vizMoonCorrTable,
  doubleElong: vizDoubleElong,
  fullMoonExample: vizCourseCalc
};

})();
