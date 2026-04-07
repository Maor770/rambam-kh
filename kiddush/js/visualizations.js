function fmtSt(s) {
  return s.replace(/【([^】]+)】/g, '<strong class="st-quote">$1</strong>');
}

function fmtRef(s) {
  return s.replace(/\(\(([^)]+)\)\)/g, '<span style="font-family:Alef,sans-serif;font-size:.75em;font-weight:400;color:var(--txt3)">($1)</span>');
}

/* ===== STEINSALTZ INTERACTIVE MARKERS ===== */

// Strip niqqud and cantillation marks for fuzzy matching
function stripNiqqud(s) {
  return s.replace(/[\u0591-\u05C7]/g, '');
}

// Extract quotes and their explanations from steinsaltz array
function extractStQuotes(stArr) {
  if (!stArr || !stArr.length) return [];
  return stArr.map(s => {
    const m = s.match(/【([^】]+)】/);
    if (!m) return null;
    let quote = m[1];
    // Remove trailing וכו' / וגו' and trim
    const explanation = s.replace(/【[^】]+】\.?\s*/, '');
    return { quote, explanation };
  }).filter(Boolean);
}

// Mark quoted words in halacha text with interactive spans
function markStInText(hebrewHtml, stArr) {
  if (!stArr || !stArr.length) return hebrewHtml;
  const quotes = extractStQuotes(stArr);
  if (!quotes.length) return hebrewHtml;

  // Work on stripped-of-html text for matching, but apply to original
  // First, strip fmtRef output to get clean text for searching
  let result = hebrewHtml;

  quotes.forEach((q, idx) => {
    // Clean the quote for searching: remove וכו' / וגו' at end
    let searchQuote = q.quote.replace(/\s*וכו['׳]?\s*$/,'').replace(/\s*וגו['׳]?\s*$/,'').trim();
    if (!searchQuote) return;

    // Try exact match first (with niqqud as-is)
    let pos = result.indexOf(searchQuote);

    // If not found, try matching without niqqud
    if (pos === -1) {
      const strippedResult = stripNiqqud(result);
      const strippedQuote = stripNiqqud(searchQuote);
      const strippedPos = strippedResult.indexOf(strippedQuote);
      if (strippedPos === -1) return; // Can't find it

      // Map stripped position back to original string position
      let origIdx = 0, strIdx = 0;
      while (strIdx < strippedPos && origIdx < result.length) {
        if (stripNiqqud(result[origIdx]) === '') { origIdx++; continue; }
        origIdx++; strIdx++;
      }
      pos = origIdx;

      // Find end position
      let endOrigIdx = origIdx, endStrIdx = strIdx;
      while (endStrIdx < strippedPos + strippedQuote.length && endOrigIdx < result.length) {
        if (stripNiqqud(result[endOrigIdx]) === '') { endOrigIdx++; continue; }
        endOrigIdx++; endStrIdx++;
      }
      // Include trailing niqqud
      while (endOrigIdx < result.length && /[\u0591-\u05C7]/.test(result[endOrigIdx])) endOrigIdx++;

      searchQuote = result.substring(pos, endOrigIdx);
    }

    // Don't wrap if already inside an HTML tag or already wrapped
    const before = result.substring(0, pos);
    if (before.lastIndexOf('<') > before.lastIndexOf('>')) return;

    // Escape the explanation for data attribute
    const escapedExp = q.explanation.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escapedQuote = q.quote.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const wrapped = `<span class="st-marked" data-st-idx="${idx}" data-st-quote="${escapedQuote}" data-st-exp="${escapedExp}">${searchQuote}</span>`;
    result = result.substring(0, pos) + wrapped + result.substring(pos + searchQuote.length);
  });

  return result;
}

// Popup singleton
let _stPopup = null;
let _stOverlay = null;

function ensureStPopup() {
  if (_stPopup) return;
  // Overlay
  _stOverlay = document.createElement('div');
  _stOverlay.className = 'st-popup-overlay';
  _stOverlay.onclick = closeStPopup;
  document.body.appendChild(_stOverlay);
  // Popup
  _stPopup = document.createElement('div');
  _stPopup.className = 'st-popup';
  _stPopup.innerHTML = '<button class="st-popup-close" onclick="closeStPopup()">&times;</button><div class="st-popup-quote"></div><div class="st-popup-body"></div>';
  document.body.appendChild(_stPopup);
}

function showStPopup(el) {
  ensureStPopup();
  const quote = el.getAttribute('data-st-quote');
  const exp = el.getAttribute('data-st-exp');
  _stPopup.querySelector('.st-popup-quote').textContent = quote;
  _stPopup.querySelector('.st-popup-body').textContent = exp;

  // Position: center horizontally, near the element
  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Show to measure
  _stPopup.style.left = '0';
  _stPopup.style.top = '0';
  _stOverlay.classList.add('show');
  _stPopup.classList.add('show');

  const pw = _stPopup.offsetWidth;
  const ph = _stPopup.offsetHeight;

  // Center horizontally
  let left = Math.max(8, Math.min(vw - pw - 8, rect.left + rect.width / 2 - pw / 2));
  // Position above or below the element
  let top;
  if (rect.top - ph - 12 > 0) {
    top = rect.top - ph - 8;
  } else {
    top = rect.bottom + 8;
  }
  // Keep in viewport
  top = Math.max(8, Math.min(vh - ph - 8, top));

  _stPopup.style.left = left + 'px';
  _stPopup.style.top = top + 'px';
}

function closeStPopup() {
  if (_stPopup) _stPopup.classList.remove('show');
  if (_stOverlay) _stOverlay.classList.remove('show');
}

// Event delegation for st-marked clicks
document.addEventListener('click', function(e) {
  const marked = e.target.closest('.st-marked');
  if (marked) {
    e.preventDefault();
    e.stopPropagation();
    showStPopup(marked);
  }
});

// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeStPopup();
});

function renderViz(vizType, ch, hNum) {
  const vizMap = {
    moon3d: `<div class="viz-container" id="viz-moon3d">
      <div id="scene3d">
        <div class="scene-info"><span class="sv">יום 1</span>מולד — הלבנה נסתרת</div>
      </div>
      <div class="scene-ctrl">
        <button class="sc-btn on" onclick="toggleMoonPlay()">⏸</button>
        <input type="range" min="1" max="10" value="3" style="accent-color:var(--gold);width:100px" oninput="moonSpeed=+this.value">
      </div></div>`,

    moladCalc: `<div class="calc-tool">
      <div class="inline-row"><label>שנה:</label><input type="number" id="mcYear" value="5786" min="1"><label>חודש:</label>
      <select id="mcMonth"><option value="0">תשרי</option><option value="1">חשוון</option><option value="2">כסלו</option><option value="3">טבת</option><option value="4">שבט</option><option value="5">אדר</option><option value="7">ניסן</option><option value="8">אייר</option><option value="9">סיוון</option><option value="10">תמוז</option><option value="11">אב</option><option value="12">אלול</option></select>
      <button class="btn-calc" onclick="runMoladCalc()">חשב</button></div>
      <div id="mcResult"></div></div>`,

    cycle19: `<div class="cycle-ring">${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(y => `<div class="cy${[3,6,8,11,14,17,19].includes(y)?' leap':''}">${y}</div>`).join('')}</div>
      <div style="text-align:center;font-size:.75rem;color:var(--txt3);margin:4px 0">🟡 = מעוברת · סימן: גו״ח אדי״ז י״ט</div>`,

    dechiyot: `<div class="calc-tool">
      <div class="inline-row"><label>שנה:</label><input type="number" id="dechY" value="5786" min="1">
      <button class="btn-calc" onclick="runDechCheck()">בדוק דחיות</button></div>
      <div id="dechResult"></div></div>`,

    monthOrder: `<div class="month-bar"><div class="mc full">תשרי<br>30</div><div class="mc var">חשוון<br>?</div><div class="mc var">כסלו<br>?</div><div class="mc def">טבת<br>29</div><div class="mc full">שבט<br>30</div><div class="mc def">אדר<br>29</div></div>
      <div class="month-bar"><div class="mc full">ניסן<br>30</div><div class="mc def">אייר<br>29</div><div class="mc full">סיוון<br>30</div><div class="mc def">תמוז<br>29</div><div class="mc full">אב<br>30</div><div class="mc def">אלול<br>29</div></div>`,

    sunCalc: `<div class="calc-tool">
      <div class="inline-row"><label>ימים מהעיקר:</label><input type="number" id="sunD" value="100" min="0">
      <button class="btn-calc" onclick="runSunCalc()">חשב מקום השמש</button></div>
      <div id="sunResult"></div></div>`,

    visibilityTable: `<table class="vis-tbl"><tr><th>קשת ראייה</th><th>אורך ראשון מינימלי</th></tr>
      <tr><td>9°-10°</td><td style="color:var(--green)">≥ 13°</td></tr>
      <tr><td>10°-11°</td><td style="color:var(--green)">≥ 12°</td></tr>
      <tr><td>11°-12°</td><td style="color:var(--green)">≥ 11°</td></tr>
      <tr><td>12°-13°</td><td style="color:var(--green)">≥ 10°</td></tr>
      <tr><td>13°-14°</td><td style="color:var(--green)">≥ 9°</td></tr></table>
      <div style="font-size:.75rem;color:var(--txt3);text-align:center">≤ 9° = לא ייראה · > 14° = ייראה בוודאות</div>`,

    arcOfVision: `<div class="calc-tool">
      <div class="inline-row"><label>קשת:</label><input type="number" id="arcV" value="11" min="0" max="30" step="0.1">
      <label>אורך:</label><input type="number" id="elongV" value="12" min="0" max="40" step="0.1">
      <button class="btn-calc" onclick="runVisCheck()">בדוק</button></div>
      <div id="visResult"></div><canvas id="sunsetViz"></canvas></div>`,

    sunEqTable: `<div class="data-grid">${[['10°','0°20׳'],['20°','0°40׳'],['30°','0°58׳'],['40°','1°15׳'],['50°','1°29׳'],['60°','1°41׳'],['70°','1°51׳'],['80°','1°57׳'],['90°','1°59׳'],['100°','1°58׳'],['110°','1°53׳'],['120°','1°45׳'],['130°','1°33׳'],['140°','1°19׳'],['150°','1°1׳'],['160°','0°42׳'],['170°','0°20׳'],['180°','0°0׳']].map(r => `<div class="dg-cell"><span class="dl">${r[0]}</span><span class="dv">${r[1]}</span></div>`).join('')}</div>`,

    moonEqTable: `<div class="data-grid">${[['10°','0°50׳'],['20°','1°38׳'],['30°','2°24׳'],['40°','3°6׳'],['50°','3°44׳'],['60°','4°7׳'],['70°','4°14׳'],['80°','4°5׳'],['90°','3°39׳'],['100°','2°59׳'],['110°','2°6׳'],['120°','1°3׳']].map(r => `<div class="dg-cell"><span class="dl">${r[0]}</span><span class="dv">${r[1]}</span></div>`).join('')}</div>`,

    latitudeTable: `<div class="data-grid">${[['10°','0°52׳'],['20°','1°43׳'],['30°','2°30׳'],['40°','3°13׳'],['50°','3°44׳'],['60°','4°20׳'],['70°','4°34׳'],['80°','4°48׳'],['90°','5°0׳']].map(r => `<div class="dg-cell"><span class="dl">${r[0]}</span><span class="dv">${r[1]}</span></div>`).join('')}</div>`,

    parallaxTable: `<div class="data-grid">${[['טלה','0°59׳'],['שור','1°0׳'],['תאומים','0°58׳'],['סרטן','0°52׳'],['אריה','0°43׳'],['בתולה','0°37׳'],['מאזניים','0°34׳'],['עקרב','0°34׳'],['קשת','0°36׳'],['גדי','0°44׳'],['דלי','0°53׳'],['דגים','0°58׳']].map(r => `<div class="dg-cell"><span class="dl">${r[0]}</span><span class="dv">${r[1]}</span></div>`).join('')}</div>`,
  };

  // Simpler vizzes that just show a label
  const simple = {
    moonPhases: `<div style="display:flex;justify-content:center;align-items:center;gap:16px;flex-wrap:wrap;margin:8px 0"><div style="text-align:center"><div style="font-size:2rem">🌑</div><div style="font-size:.75rem;color:var(--txt2)">מולד</div><div style="font-size:.65rem;color:var(--txt3)">יום 1</div></div><div style="text-align:center"><div style="font-size:2rem">🌓</div><div style="font-size:.75rem;color:var(--txt2)">רבע ראשון</div><div style="font-size:.65rem;color:var(--txt3)">יום ~7</div></div><div style="text-align:center"><div style="font-size:2rem">🌕</div><div style="font-size:.75rem;color:var(--txt2)">מילוי</div><div style="font-size:.65rem;color:var(--txt3)">יום ~15</div></div><div style="text-align:center"><div style="font-size:2rem">🌗</div><div style="font-size:.75rem;color:var(--txt2)">רבע אחרון</div><div style="font-size:.65rem;color:var(--txt3)">יום ~22</div></div></div><div style="text-align:center;font-size:.72rem;color:var(--txt3);margin-top:4px">מחזור שלם: כ״ט ימים · י״ב שעות · תשצ״ג חלקים</div>`,
    parts1080: `<div class="calc-tool"><div class="calc-row"><span class="l">1,080 ÷ 2</span><span class="v">540 ✓</span></div><div class="calc-row"><span class="l">1,080 ÷ 3</span><span class="v">360 ✓</span></div><div class="calc-row"><span class="l">1,080 ÷ 4</span><span class="v">270 ✓</span></div><div class="calc-row"><span class="l">1,080 ÷ 5</span><span class="v">216 ✓</span></div><div class="calc-row"><span class="l">1,080 ÷ 8</span><span class="v">135 ✓</span></div><div class="calc-row"><span class="l">1,080 ÷ 9</span><span class="v">120 ✓</span></div><div class="calc-row"><span class="l">1,080 ÷ 10</span><span class="v">108 ✓</span></div></div>`,
    moladNumber: '<div class="result-box">כ״ט ימים · י״ב שעות · תשצ״ג חלקים</div>',
    zodiacRing: `<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin:8px 0">${['♈טלה 0°','♉שור 30°','♊תאומים 60°','♋סרטן 90°','♌אריה 120°','♍בתולה 150°','♎מאזניים 180°','♏עקרב 210°','♐קשת 240°','♑גדי 270°','♒דלי 300°','♓דגים 330°'].map(z => `<span style="padding:3px 7px;border-radius:6px;font-size:.65rem;border:1px solid rgba(255,255,255,.08);color:var(--txt3)">${z}</span>`).join('')}</div>`,
    meanVsTrue: '<div class="calc-tool"><div class="calc-row"><span class="l">אמצע (Mean)</span><span class="v">מהירות ממוצעת קבועה</span></div><div class="calc-row"><span class="l">אמיתי (True)</span><span class="v">כפי שנראה מהארץ</span></div><div class="calc-row"><span class="l">מסלול (Anomaly)</span><span class="v">אמצעי − גובה</span></div><div class="calc-row"><span class="l">מנה (Equation)</span><span class="v">התיקון</span></div></div>',
    sunDaily: '<div class="result-box">0° 59׳ 8״ ביום</div>',
    moonEpicycle: '<div class="calc-tool"><div class="calc-row"><span class="l">אמצע הירח ביום</span><span class="v">13° 10׳ 35″</span></div><div class="calc-row"><span class="l">אמצע המסלול ביום</span><span class="v">13° 3׳ 54″</span></div></div>',
    nodesViz: '<div class="calc-tool"><div class="calc-row"><span class="l">רוחב מרבי</span><span class="v">5 מעלות</span></div><div class="calc-row"><span class="l">מהלך הראש ביום</span><span class="v">0° 3׳ 11″</span></div><div class="calc-row"><span class="l">ראש ↔ זנב</span><span class="v">תמיד 180°</span></div></div>',
    quickFilter: '<div class="calc-tool"><div style="padding:4px;font-size:.82rem;border-bottom:1px solid rgba(239,68,68,.15);color:var(--red)">✗ אורך ≤ 9° → לא ייראה</div><div style="padding:4px;font-size:.82rem;border-bottom:1px solid rgba(52,211,153,.15);color:var(--green)">✓ אורך ≥ 15° (או 24°) → ייראה</div><div style="padding:4px;font-size:.82rem;color:var(--purple)">? ביניים → חשב קשת ראייה</div></div>',
    crescentDir: '<div class="calc-tool"><div class="calc-row"><span class="l">על קו המשווה</span><span class="v">קרניים למעלה/מטה</span></div><div class="calc-row"><span class="l">צפון מקו המשווה</span><span class="v">פגימה דרום-מזרח</span></div><div class="calc-row"><span class="l">דרום מקו המשווה</span><span class="v">פגימה צפון-מזרח</span></div></div>',
  };

  // Check new visualizations (from new-visualizations.js) if not found in existing maps
  const newViz = window.NEW_VIZ_MAP || {};
  return vizMap[vizType] || simple[vizType] || newViz[vizType] || '';
}
