/* observatory-viz-halacha.js – Rich visualizations for halacha-by-halacha mode
   Uses 3D scene objects (via vizGroup) for astronomical halachot,
   and HTML overlays only for math/calculation halachot */

(function(){
'use strict';

/* ══════════════════════════════════════════
   3D vizModes — modify the actual 3D model
   These call scene.js helper functions
   ══════════════════════════════════════════ */

function viz_degreeCircle(){
  // Add degree marks to the zodiac ring in 3D
  if(window.showDegreeMarks) showDegreeMarks();
  // Add a "360° = עיגול שלם" label at center
  if(window.add3DText) add3DText('360°', 0, 3, 0, {fontSize:36, color:'#f4d03f', scale:4});
  return ''; // no HTML overlay needed
}

function viz_zodiacRing(){
  // Show zodiac names + degree marks in 3D
  if(window.showZodiacNames) showZodiacNames();
  if(window.showDegreeMarks) showDegreeMarks();
  return '';
}

function viz_degreeToSign(){
  // Highlight sign 6 (Libra/מאזניים) at 200°
  if(window.highlightSign) highlightSign(6);
  if(window.showDegreeMarks) showDegreeMarks();
  if(window.add3DText){
    add3DText('200°', 0, 3, 0, {fontSize:30, color:'#f4d03f', scale:3.5});
    add3DText('÷30 = 6 + 20°', 0, 1.5, 0, {fontSize:18, color:'#ccc', scale:3});
  }
  return '';
}

function viz_degreeToSign2(){
  // Highlight sign 10 (Aquarius/דלי) at 320°
  if(window.highlightSign) highlightSign(10);
  if(window.showDegreeMarks) showDegreeMarks();
  if(window.add3DText){
    add3DText('320°', 0, 3, 0, {fontSize:30, color:'#f4d03f', scale:3.5});
    add3DText('÷30 = 10 + 20°', 0, 1.5, 0, {fontSize:18, color:'#ccc', scale:3});
  }
  return '';
}

function viz_epicycleAnim(){
  // Brighten the epicycle and deferent in 3D
  if(window.brightenEpicycle) brightenEpicycle();
  // Add "close=fast, far=slow" labels
  if(window.add3DText){
    add3DText('קרוב = מהיר ←', SUN_ORBIT_R - 3, 2, 0, {fontSize:14, color:'#34d399', scale:2});
    add3DText('→ רחוק = איטי', SUN_ORBIT_R + 3, 2, 0, {fontSize:14, color:'#ef4444', scale:2});
  }
  return '';
}

function viz_meanVsTrue(){
  // Add two markers on sun orbit showing mean vs true
  const meanAngle = 1.2; // radians
  const trueAngle = 1.25;
  if(window.addMeanMarker) addMeanMarker(SUN_ORBIT_R, meanAngle, 'אמצעי');
  if(window.addTrueMarker) addTrueMarker(SUN_ORBIT_R, trueAngle, 'אמיתי');
  if(window.addArrow3D){
    const mx = Math.cos(meanAngle)*SUN_ORBIT_R, mz = -Math.sin(meanAngle)*SUN_ORBIT_R;
    const tx = Math.cos(trueAngle)*SUN_ORBIT_R, tz = -Math.sin(trueAngle)*SUN_ORBIT_R;
    addArrow3D({x:mx, y:0.5, z:mz}, {x:tx, y:0.5, z:tz}, 0xf4d03f);
  }
  return '';
}

function viz_correctionArrow(){
  // Show mean + true + arrow between them in 3D
  const meanA = 1.0, trueA = 1.08;
  if(window.addMeanMarker) addMeanMarker(SUN_ORBIT_R, meanA, 'אמצעי');
  if(window.addTrueMarker) addTrueMarker(SUN_ORBIT_R, trueA, 'אמיתי');
  if(window.add3DText){
    add3DText('± תיקון', 0, 3, 0, {fontSize:24, color:'#f4d03f', scale:3});
    const midA = (meanA+trueA)/2;
    const x = Math.cos(midA)*SUN_ORBIT_R, z = -Math.sin(midA)*SUN_ORBIT_R;
    add3DText('→', x, 2, z, {fontSize:28, color:'#f4d03f', scale:2});
  }
  return '';
}

function viz_jerusalemMap(){
  // Highlight Jerusalem dot on Earth
  if(window.add3DText){
    add3DText('📍 ירושלים', 0, -2.8, 0, {fontSize:18, color:'#f4d03f', scale:2.5});
    add3DText('32°N  35°E', 0, -3.8, 0, {fontSize:14, color:'#999', scale:2});
  }
  return '';
}

function viz_longitudeShift(){
  // Add east/west labels
  if(window.add3DText){
    add3DText('← מזרח (מוקדם)', 4, -1, 0, {fontSize:14, color:'#34d399', scale:2.5});
    add3DText('מערב (מאוחר) →', -4, -1, 0, {fontSize:14, color:'#ef4444', scale:2.5});
    add3DText('ירושלים', 0, -2.5, 0, {fontSize:16, color:'#f4d03f', scale:2});
  }
  return '';
}

function viz_apogeePoint(){
  // Mark apogee point on sun orbit in 3D
  const apogeeAngle = 86.75 * Math.PI/180; // 86°45'
  if(window.add3DText){
    const x = Math.cos(apogeeAngle) * SUN_ORBIT_R;
    const z = -Math.sin(apogeeAngle) * SUN_ORBIT_R;
    // Big dot at apogee
    if(window.vizGroup){
      const geo = new THREE.SphereGeometry(0.5, 16, 16);
      const mat = new THREE.MeshBasicMaterial({color:0xff9933});
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, 0, z);
      vizGroup.add(mesh);
    }
    add3DText('נקודת הגובה', x, 2.5, z, {fontSize:16, color:'#ff9933', scale:2.5});
    add3DText('הכי רחוק מהארץ', x, 1.2, z, {fontSize:12, color:'#999', scale:2});
    add3DText('86° 45\'', x, 0, z-2, {fontSize:14, color:'#f4d03f', scale:2});
  }
  return '';
}

function viz_doubleElong(){
  // Show elongation angle doubled in 3D
  if(window.add3DText){
    add3DText('זווית × 2 = כפל מרחק', 0, 3, 0, {fontSize:18, color:'#f4d03f', scale:3.5});
  }
  return '';
}

/* Constants from scene.js (must match) */
const SUN_ORBIT_R = 14;
const ZODIAC_R = 18;
const DEG = Math.PI / 180;

/* ══════════════════════════════════════════
   HTML overlay vizModes — for calculation halachot
   (Only used when there's no 3D equivalent)
   ══════════════════════════════════════════ */

function viz_addDegrees(){
  return `<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);font-size:0.7rem;color:#ccc;max-width:260px;line-height:1.6">
    <div style="color:#f4d03f;font-weight:700;margin-bottom:4px;font-size:0.75rem">חיבור מעלות</div>
    <div>200° 45\' + 170° 30\' = 370° 75\'</div>
    <div style="color:#ef4444;font-size:0.6rem">75\' > 60\' → +1°, -60\' → 371° 15\'</div>
    <div style="color:#ef4444;font-size:0.6rem">371° > 360° → -360° → <b style="color:#34d399">11° 15\'</b></div>
  </div>`;
}

function viz_subDegrees(){
  return `<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);font-size:0.7rem;color:#ccc;max-width:260px;line-height:1.6">
    <div style="color:#f4d03f;font-weight:700;margin-bottom:4px;font-size:0.75rem">חיסור מעלות</div>
    <div>100° 30\' − 200° 50\'</div>
    <div style="color:#f4d03f;font-size:0.6rem">100° < 200° → +360° → 460° 30\'</div>
    <div style="color:#f4d03f;font-size:0.6rem">30\' < 50\' → שוברים 1° → 459° 90\'</div>
    <div style="color:#34d399;font-size:0.65rem;font-weight:700">459° 90\' − 200° 50\' = 259° 40\' ✓</div>
  </div>`;
}

function viz_courseCalc(){
  return `<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);font-size:0.7rem;color:#ccc;max-width:280px;line-height:1.6">
    <div style="color:#f4d03f;font-weight:700;margin-bottom:4px;font-size:0.75rem">חישוב מנת המסלול</div>
    <div><span style="color:#87CEEB">שמש אמצעית</span> − <span style="color:#ff9933">גובה</span> = <span style="color:#f4d03f;font-weight:700">מנה</span></div>
    <div style="margin-top:4px;font-size:0.6rem;color:#999">המנה קובעת כמה לתקן ולאיזה כיוון</div>
  </div>`;
}

function viz_addSubRule(){
  // Half circle — small overlay in corner
  return `<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);font-size:0.7rem;color:#ccc;max-width:220px">
    <div style="color:#f4d03f;font-weight:700;margin-bottom:4px">כלל התיקון</div>
    <div style="color:#ef4444">0°-180° → <b>מחסירים</b> (−)</div>
    <div style="color:#34d399">180°-360° → <b>מוסיפים</b> (+)</div>
    <div style="color:#888;font-size:0.55rem;margin-top:3px">ב-0° וב-180° → אין תיקון</div>
  </div>`;
}

function viz_sunCorrTable(){
  const data = [[10,'0°20\''], [20,'0°40\''], [30,'0°58\''], [40,'1°15\''], [50,'1°29\''],
                [60,'1°59\''], [70,'2°5\''], [80,'2°8\''], [90,'2°5\'']];
  const rows = data.map(([d,c]) => {
    const peak = d===80;
    return `<div style="display:flex;justify-content:space-between;padding:1px 0;${peak?'color:#f4d03f;font-weight:700':''}"><span>${d}°</span><span>${c}${peak?' ←שיא':''}</span></div>`;
  }).join('');
  return `<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);font-size:0.6rem;color:#ccc;max-width:160px">
    <div style="color:#ffcc44;font-weight:700;margin-bottom:3px;font-size:0.7rem">טבלת תיקוני שמש</div>
    ${rows}
  </div>`;
}

function viz_moonCorrTable(){
  const data = [[10,'0°52\''], [20,'1°43\''], [30,'2°30\''], [40,'3°13\''], [50,'3°50\''],
                [60,'4°20\''], [70,'4°46\''], [80,'5°1\''], [90,'5°8\'']];
  const rows = data.map(([d,c]) => {
    const peak = d===90;
    return `<div style="display:flex;justify-content:space-between;padding:1px 0;${peak?'color:#87CEEB;font-weight:700':''}"><span>${d}°</span><span>${c}${peak?' ←שיא':''}</span></div>`;
  }).join('');
  return `<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);font-size:0.6rem;color:#ccc;max-width:160px">
    <div style="color:#87CEEB;font-weight:700;margin-bottom:3px;font-size:0.7rem">טבלת תיקוני ירח</div>
    ${rows}
    <div style="color:#ef4444;font-size:0.5rem;margin-top:2px">שיא: 5°8\' — פי 2.5 מהשמש!</div>
  </div>`;
}

function viz_interpCalc(){
  return `<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);font-size:0.65rem;color:#ccc;max-width:260px;line-height:1.5">
    <div style="color:#f4d03f;font-weight:700;margin-bottom:4px;font-size:0.75rem">אינטרפולציה</div>
    <div><span style="color:#87CEEB">60°→1°59\'</span> ⟵ <b style="color:#f4d03f">65°</b> ⟶ <span style="color:#87CEEB">70°→2°5\'</span></div>
    <div style="margin-top:3px;font-size:0.6rem">הפרש = 6\' · 50% = 3\'</div>
    <div style="color:#34d399;font-weight:700">תוצאה: 1°59\' + 3\' = 2°2\' ✓</div>
  </div>`;
}

function viz_sunMotionTable(){
  return `<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);direction:rtl;font-family:var(--font-body);font-size:0.6rem;color:#ccc;max-width:200px">
    <div style="color:#ffcc44;font-weight:700;margin-bottom:3px;font-size:0.7rem">☀ מהלך השמש</div>
    <div style="color:#f4d03f;font-weight:700">יום: 0° 59\' 8"</div>
    <div>10 ימים: 9° 51\' 23"</div>
    <div>100 ימים: 98° 33\' 53"</div>
    <div>שנה: 348° 55\' 15"</div>
  </div>`;
}

/* ══════════════════════════════════════════
   Register all vizModes
   Key rule: 3D vizModes call scene functions and return ''
             HTML vizModes return HTML string
   ══════════════════════════════════════════ */

window.halachaVizModes = {
  // Chapter 11 — 3D modes
  degreeCircle: viz_degreeCircle,
  zodiacRing: viz_zodiacRing,
  degreeToSign: viz_degreeToSign,
  degreeToSign2: viz_degreeToSign2,
  epicycleAnim: viz_epicycleAnim,
  meanVsTrue: viz_meanVsTrue,
  correctionArrow: viz_correctionArrow,
  jerusalemMap: viz_jerusalemMap,
  longitudeShift: viz_longitudeShift,
  // Chapter 11 — HTML modes (math)
  addDegrees: viz_addDegrees,
  subDegrees: viz_subDegrees,
  subExample: viz_subDegrees,
  // Chapter 12
  sunMotionTable: viz_sunMotionTable,
  apogeePoint: viz_apogeePoint,
  // Chapter 13
  courseCalc: viz_courseCalc,
  addSubRule: viz_addSubRule,
  sunCorrTable: viz_sunCorrTable,
  interpCalc: viz_interpCalc,
  interpIntro: viz_interpCalc,
  corrExample1: viz_courseCalc,
  fullSunExample: viz_courseCalc,
  // Chapter 14 — use scene.js vizModes (dualSpeed, moonEpicycle, etc.)
  // Chapter 15
  moonCorrTable: viz_moonCorrTable,
  doubleElong: viz_doubleElong,
  fullMoonExample: viz_courseCalc
};

/* Expose helpers to global scope for scene.js access */
window.showDegreeMarks = window.showDegreeMarks || function(){};
window.showZodiacNames = window.showZodiacNames || function(){};
window.highlightSign = window.highlightSign || function(){};
window.brightenEpicycle = window.brightenEpicycle || function(){};
window.add3DText = window.add3DText || function(){};
window.addMeanMarker = window.addMeanMarker || function(){};
window.addTrueMarker = window.addTrueMarker || function(){};
window.addArrow3D = window.addArrow3D || function(){};

})();
