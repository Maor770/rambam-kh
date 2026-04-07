/* new-visualizations.js — New visualization templates + Canvas animations */

window.NEW_VIZ_MAP = {

  /* ============================================= */
  /* DEGREE SYSTEM DIAGRAM (11:6)                  */
  /* ============================================= */
  degreeSystem: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 420 280" style="width:100%;max-width:420px">' +
    '<circle cx="140" cy="140" r="110" fill="none" stroke="var(--sky)" stroke-opacity="0.25" stroke-width="1.5"/>' +
    '<line x1="140" y1="140" x2="250" y2="140" stroke="var(--gold)" stroke-width="1.5" stroke-opacity="0.6"/>' +
    '<line x1="140" y1="140" x2="245" y2="105" stroke="var(--sky)" stroke-width="1.5" stroke-opacity="0.6"/>' +
    '<path d="M 180 140 A 40 40 0 0 0 178 125" fill="none" stroke="var(--gold)" stroke-width="1.5"/>' +
    '<text x="192" y="135" fill="var(--gold)" font-size="11" font-weight="700">1\u00B0</text>' +
    '<text x="140" y="268" text-anchor="middle" fill="var(--txt3)" font-size="11">360\u00B0 = \u05DE\u05E2\u05D2\u05DC \u05E9\u05DC\u05DD</text>' +
    '<text x="252" y="143" fill="var(--txt3)" font-size="10" text-anchor="start">0\u00B0</text>' +
    '<text x="140" y="24" fill="var(--txt3)" font-size="10" text-anchor="middle">90\u00B0</text>' +
    '<text x="24" y="143" fill="var(--txt3)" font-size="10" text-anchor="middle">180\u00B0</text>' +
    '<text x="140" y="262" fill="var(--txt3)" font-size="10" text-anchor="middle">270\u00B0</text>' +
    '<!-- Zoom box -->' +
    '<rect x="280" y="20" width="130" height="120" rx="8" fill="var(--card2)" stroke="var(--border)" stroke-width="1"/>' +
    '<text x="345" y="42" text-anchor="middle" fill="var(--gold)" font-size="11" font-weight="700">1\u00B0 \u05DE\u05E2\u05DC\u05D4</text>' +
    '<line x1="295" y1="55" x2="415" y2="55" stroke="var(--border)" stroke-width="0.5"/>' +
    '<text x="345" y="75" text-anchor="middle" fill="var(--sky)" font-size="10">= 60\u2032 (\u05D3\u05E7\u05D5\u05EA)</text>' +
    '<text x="345" y="95" text-anchor="middle" fill="var(--purple)" font-size="10">1\u2032 = 60\u2033 (\u05E9\u05E0\u05D9\u05D5\u05EA)</text>' +
    '<text x="345" y="120" text-anchor="middle" fill="var(--txt3)" font-size="9">1\u2033 = 60\u2034 (\u05E9\u05DC\u05D9\u05E9\u05D9\u05D5\u05EA)</text>' +
    '<line x1="250" y1="120" x2="280" y2="70" stroke="var(--gold)" stroke-dasharray="4 3" stroke-width="1" stroke-opacity="0.5"/>' +
    '</svg></div>',

  /* ============================================= */
  /* DEGREE ARITHMETIC EXAMPLE (11:10)             */
  /* ============================================= */
  degreeArithmetic: '<div class="worked-example">' +
    '<div style="font-size:.82rem;color:var(--purple);font-weight:600;margin-bottom:8px;text-align:right;direction:rtl">\u05D3\u05D5\u05D2\u05DE\u05D4: \u05D7\u05D9\u05D1\u05D5\u05E8 \u05DE\u05E2\u05DC\u05D5\u05EA \u05D5\u05D3\u05E7\u05D5\u05EA</div>' +
    '<div class="step"><div class="step-num">1</div><div class="step-txt">245\u00B0 30\u2032 + 128\u00B0 45\u2032</div></div>' +
    '<div class="step"><div class="step-num">2</div><div class="step-txt">\u05D3\u05E7\u05D5\u05EA: 30\u2032 + 45\u2032 = 75\u2032 = <span style="color:var(--gold)">1\u00B0 15\u2032</span> (\u05D4\u05E2\u05D1\u05E8 1\u00B0)</div></div>' +
    '<div class="step"><div class="step-num">3</div><div class="step-txt">\u05DE\u05E2\u05DC\u05D5\u05EA: 245 + 128 + 1 = <span style="color:var(--sky)">374\u00B0</span></div></div>' +
    '<div class="step"><div class="step-num">4</div><div class="step-txt">374 > 360, \u05DC\u05DB\u05DF: 374 \u2212 360 = <span style="color:var(--gold);font-weight:700">14\u00B0 15\u2032</span></div></div>' +
    '<div style="margin-top:8px;padding:6px;background:var(--gold-bg);border-radius:6px;text-align:center;color:var(--gold);font-weight:600;direction:rtl">\u05EA\u05E9\u05D5\u05D1\u05D4: 14\u00B0 15\u2032 \u2014 \u05D4\u05E2\u05D5\u05D3\u05E3 \u05E0\u05DE\u05D7\u05E7 \u05DB\u05D9 \u05E2\u05D1\u05E8\u05E0\u05D5 \u05E1\u05D9\u05D1\u05D5\u05D1 \u05E9\u05DC\u05DD</div>' +
    '</div>',

  /* ============================================= */
  /* EPICYCLE CONCEPT DIAGRAM (11:13)              */
  /* ============================================= */
  epicycleConcept: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 400 340" style="width:100%;max-width:400px">' +
    '<!-- Stars -->' +
    '<rect width="400" height="340" rx="12" fill="#080c18"/>' +
    '<!-- Deferent -->' +
    '<circle cx="200" cy="160" r="120" fill="none" stroke="rgba(135,206,235,0.2)" stroke-width="1.5" stroke-dasharray="6 3"/>' +
    '<text x="200" y="296" text-anchor="middle" fill="rgba(135,206,235,0.5)" font-size="10">\u05DE\u05E2\u05D2\u05DC \u05D2\u05D3\u05D5\u05DC (Deferent)</text>' +
    '<!-- Epicycle at ~45deg -->' +
    '<circle cx="285" cy="75" r="28" fill="none" stroke="rgba(244,208,63,0.35)" stroke-width="1.5"/>' +
    '<text x="285" y="115" text-anchor="middle" fill="rgba(244,208,63,0.5)" font-size="9">\u05D2\u05DC\u05D2\u05DC \u05E7\u05D8\u05DF (Epicycle)</text>' +
    '<!-- Epicycle center -->' +
    '<circle cx="285" cy="75" r="3" fill="rgba(135,206,235,0.6)"/>' +
    '<!-- Mean direction -->' +
    '<line x1="200" y1="160" x2="285" y2="75" stroke="rgba(135,206,235,0.3)" stroke-width="1" stroke-dasharray="4 4"/>' +
    '<text x="230" y="100" fill="rgba(135,206,235,0.6)" font-size="9" transform="rotate(-45,230,100)">\u05D0\u05DE\u05E6\u05E2</text>' +
    '<!-- Moon on epicycle -->' +
    '<circle cx="305" cy="55" r="5" fill="#e8e8d8"/>' +
    '<text x="318" y="50" fill="#f4d03f" font-size="10">\u05D9\u05E8\u05D7</text>' +
    '<!-- True direction -->' +
    '<line x1="200" y1="160" x2="305" y2="55" stroke="rgba(244,208,63,0.5)" stroke-width="1.5"/>' +
    '<text x="268" y="130" fill="rgba(244,208,63,0.6)" font-size="9" transform="rotate(-52,268,130)">\u05D0\u05DE\u05D9\u05EA\u05D9</text>' +
    '<!-- Earth -->' +
    '<circle cx="200" cy="160" r="10" fill="#2244aa"/>' +
    '<text x="200" y="180" text-anchor="middle" fill="#87CEEB" font-size="10">\u05D0\u05E8\u05E5</text>' +
    '<!-- Equation arc -->' +
    '<path d="M 240 125 A 50 50 0 0 0 246 118" fill="none" stroke="rgba(52,211,153,0.6)" stroke-width="1.5"/>' +
    '<text x="255" y="115" fill="rgba(52,211,153,0.7)" font-size="9">\u05DE\u05E0\u05D4</text>' +
    '<!-- Legend -->' +
    '<rect x="15" y="305" width="370" height="25" rx="6" fill="rgba(255,255,255,0.05)"/>' +
    '<circle cx="35" cy="317" r="3" fill="rgba(135,206,235,0.6)"/>' +
    '<text x="45" y="321" fill="rgba(135,206,235,0.6)" font-size="9">\u05DE\u05D9\u05E7\u05D5\u05DD \u05D0\u05DE\u05E6\u05E2\u05D9</text>' +
    '<circle cx="150" cy="317" r="3" fill="#f4d03f"/>' +
    '<text x="160" y="321" fill="rgba(244,208,63,0.7)" font-size="9">\u05DE\u05D9\u05E7\u05D5\u05DD \u05D0\u05DE\u05D9\u05EA\u05D9</text>' +
    '<circle cx="275" cy="317" r="3" fill="rgba(52,211,153,0.6)"/>' +
    '<text x="285" y="321" fill="rgba(52,211,153,0.7)" font-size="9">\u05DE\u05E0\u05D4 = \u05D4\u05D4\u05E4\u05E8\u05E9</text>' +
    '</svg></div>',

  /* ============================================= */
  /* ANOMALY RULE DIAGRAM (13:5)                   */
  /* ============================================= */
  anomalyRule: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 360 300" style="width:100%;max-width:360px">' +
    '<rect width="360" height="300" rx="12" fill="#080c18"/>' +
    '<!-- Circle -->' +
    '<circle cx="180" cy="150" r="110" fill="none" stroke="rgba(135,206,235,0.15)" stroke-width="1.5"/>' +
    '<!-- Top half shading (0-180: subtract) -->' +
    '<path d="M 290 150 A 110 110 0 0 0 70 150" fill="rgba(135,206,235,0.06)" stroke="none"/>' +
    '<!-- Bottom half shading (180-360: add) -->' +
    '<path d="M 70 150 A 110 110 0 0 0 290 150" fill="rgba(244,208,63,0.06)" stroke="none"/>' +
    '<!-- Divider line -->' +
    '<line x1="70" y1="150" x2="290" y2="150" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4 3"/>' +
    '<!-- Apogee marker -->' +
    '<circle cx="180" cy="40" r="6" fill="none" stroke="var(--gold)" stroke-width="2"/>' +
    '<text x="180" y="28" text-anchor="middle" fill="var(--gold)" font-size="10" font-weight="700">\u05D2\u05D5\u05D1\u05D4 (Apogee)</text>' +
    '<!-- 0/360 -->' +
    '<text x="300" y="147" fill="var(--txt3)" font-size="9">0\u00B0 / 360\u00B0</text>' +
    '<!-- 180 -->' +
    '<text x="30" y="147" fill="var(--txt3)" font-size="9">180\u00B0</text>' +
    '<!-- 90 -->' +
    '<text x="180" y="258" text-anchor="middle" fill="var(--txt3)" font-size="9">90\u00B0</text>' +
    '<!-- Labels -->' +
    '<text x="180" y="105" text-anchor="middle" fill="var(--sky)" font-size="13" font-weight="700">0\u00B0\u201390\u00B0: \u05D7\u05E1\u05E8 \u05D0\u05EA \u05D4\u05DE\u05E0\u05D4</text>' +
    '<text x="180" y="210" text-anchor="middle" fill="var(--gold)" font-size="13" font-weight="700">180\u00B0\u2013360\u00B0: \u05D4\u05D5\u05E1\u05E3 \u05D0\u05EA \u05D4\u05DE\u05E0\u05D4</text>' +
    '<!-- Max correction at 90/270 -->' +
    '<text x="180" y="275" text-anchor="middle" fill="var(--green)" font-size="10">\u05EA\u05D9\u05E7\u05D5\u05DF \u05DE\u05E7\u05E1\u05D9\u05DE\u05DC\u05D9 \u2248 2\u00B05\u2032 (\u05E9\u05DE\u05E9) / 5\u00B0 (\u05D9\u05E8\u05D7)</text>' +
    '<!-- Arrow showing direction -->' +
    '<path d="M 295 120 L 295 80" fill="none" stroke="var(--sky)" stroke-width="1.5" marker-end="url(#arrowBlue)"/>' +
    '<text x="310" y="100" fill="var(--sky)" font-size="8">\u2212</text>' +
    '<path d="M 295 180 L 295 220" fill="none" stroke="var(--gold)" stroke-width="1.5" marker-end="url(#arrowGold)"/>' +
    '<text x="310" y="200" fill="var(--gold)" font-size="8">+</text>' +
    '<defs><marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="var(--sky)"/></marker>' +
    '<marker id="arrowGold" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="var(--gold)"/></marker></defs>' +
    '</svg></div>',

  /* ============================================= */
  /* INTERPOLATION EXAMPLE (13:8)                  */
  /* ============================================= */
  interpolationExample: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 400 160" style="width:100%;max-width:400px">' +
    '<rect width="400" height="160" rx="10" fill="var(--card2)"/>' +
    '<text x="200" y="22" text-anchor="middle" fill="var(--purple)" font-size="11" font-weight="700">\u05D0\u05D9\u05E0\u05D8\u05E8\u05E4\u05D5\u05DC\u05E6\u05D9\u05D4 \u2014 \u05D3\u05D5\u05D2\u05DE\u05D4</text>' +
    '<!-- Number line -->' +
    '<line x1="50" y1="70" x2="350" y2="70" stroke="var(--txt3)" stroke-width="1.5"/>' +
    '<!-- 50 mark -->' +
    '<line x1="80" y1="60" x2="80" y2="80" stroke="var(--sky)" stroke-width="2"/>' +
    '<text x="80" y="55" text-anchor="middle" fill="var(--sky)" font-size="10" font-weight="600">50\u00B0</text>' +
    '<text x="80" y="95" text-anchor="middle" fill="var(--sky)" font-size="9">1\u00B029\u2032</text>' +
    '<!-- 54 mark -->' +
    '<line x1="152" y1="60" x2="152" y2="80" stroke="var(--gold)" stroke-width="2"/>' +
    '<text x="152" y="50" text-anchor="middle" fill="var(--gold)" font-size="11" font-weight="700">54\u00B0</text>' +
    '<text x="152" y="95" text-anchor="middle" fill="var(--gold)" font-size="10" font-weight="700">?</text>' +
    '<!-- 60 mark -->' +
    '<line x1="260" y1="60" x2="260" y2="80" stroke="var(--sky)" stroke-width="2"/>' +
    '<text x="260" y="55" text-anchor="middle" fill="var(--sky)" font-size="10" font-weight="600">60\u00B0</text>' +
    '<text x="260" y="95" text-anchor="middle" fill="var(--sky)" font-size="9">1\u00B041\u2032</text>' +
    '<!-- Bracket -->' +
    '<path d="M 80 105 L 80 115 L 152 115" fill="none" stroke="var(--green)" stroke-width="1"/>' +
    '<text x="116" y="130" text-anchor="middle" fill="var(--green)" font-size="9">4/10 = 40%</text>' +
    '<!-- Calculation -->' +
    '<text x="200" y="150" text-anchor="middle" fill="var(--txt2)" font-size="9">1\u00B029\u2032 + 40% \u00D7 (1\u00B041\u2032 \u2212 1\u00B029\u2032) = 1\u00B029\u2032 + 4\u2032.8 \u2248 <tspan fill="var(--gold)" font-weight="700">1\u00B034\u2032</tspan></text>' +
    '</svg></div>',

  /* ============================================= */
  /* DOUBLE ELONGATION DIAGRAM (15:1)              */
  /* ============================================= */
  doubleElongation: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 400 300" style="width:100%;max-width:400px">' +
    '<rect width="400" height="300" rx="12" fill="#080c18"/>' +
    '<!-- Earth -->' +
    '<circle cx="200" cy="150" r="10" fill="#2244aa"/>' +
    '<text x="200" y="172" text-anchor="middle" fill="#87CEEB" font-size="10">\u05D0\u05E8\u05E5</text>' +
    '<!-- Sun direction -->' +
    '<line x1="200" y1="150" x2="350" y2="150" stroke="rgba(255,153,51,0.4)" stroke-width="1.5"/>' +
    '<circle cx="350" cy="150" r="14" fill="#ff9933" opacity="0.8"/>' +
    '<text x="350" y="175" text-anchor="middle" fill="#ff9933" font-size="10">\u05E9\u05DE\u05E9</text>' +
    '<!-- Moon direction -->' +
    '<line x1="200" y1="150" x2="120" y2="60" stroke="rgba(232,232,216,0.3)" stroke-width="1.5"/>' +
    '<circle cx="120" cy="60" r="6" fill="#e8e8d8"/>' +
    '<text x="105" y="52" fill="#e8e8d8" font-size="10">\u05D9\u05E8\u05D7</text>' +
    '<!-- Elongation angle -->' +
    '<path d="M 250 150 A 50 50 0 0 0 228 118" fill="none" stroke="rgba(52,211,153,0.6)" stroke-width="2"/>' +
    '<text x="255" y="120" fill="rgba(52,211,153,0.8)" font-size="11" font-weight="600">\u03B1</text>' +
    '<!-- Double elongation label -->' +
    '<rect x="20" y="220" width="360" height="60" rx="8" fill="rgba(255,255,255,0.04)"/>' +
    '<text x="200" y="243" text-anchor="middle" fill="var(--gold)" font-size="12" font-weight="700">\u05DB\u05E4\u05DC \u05D4\u05DE\u05E8\u05D7\u05E7 = 2 \u00D7 \u03B1</text>' +
    '<text x="200" y="265" text-anchor="middle" fill="var(--txt3)" font-size="10">\u05DE\u05E9\u05DE\u05E9 \u05DC\u05EA\u05D9\u05E7\u05D5\u05DF \u05DE\u05D9\u05E7\u05D5\u05DD \u05D4\u05D9\u05E8\u05D7 \u05D4\u05D0\u05DE\u05D9\u05EA\u05D9</text>' +
    '</svg></div>',

  /* ============================================= */
  /* LATITUDE NORTH/SOUTH DIAGRAM (16:7)           */
  /* ============================================= */
  latitudeNorthSouth: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 400 250" style="width:100%;max-width:400px">' +
    '<rect width="400" height="250" rx="12" fill="#080c18"/>' +
    '<!-- Ecliptic line -->' +
    '<line x1="30" y1="125" x2="370" y2="125" stroke="rgba(244,208,63,0.4)" stroke-width="2"/>' +
    '<text x="385" y="128" fill="rgba(244,208,63,0.5)" font-size="9" text-anchor="end">\u05D0\u05E7\u05DC\u05D9\u05E4\u05D8\u05D9\u05E7\u05D4</text>' +
    '<!-- North region -->' +
    '<text x="200" y="35" text-anchor="middle" fill="var(--sky)" font-size="11" font-weight="600">\u05E6\u05E4\u05D5\u05DF</text>' +
    '<path d="M 30 125 Q 200 50 370 125" fill="none" stroke="rgba(135,206,235,0.4)" stroke-width="1.5" stroke-dasharray="5 3"/>' +
    '<!-- Moon north -->' +
    '<circle cx="200" cy="70" r="5" fill="#e8e8d8"/>' +
    '<text x="215" y="68" fill="#e8e8d8" font-size="9">\u05D9\u05E8\u05D7</text>' +
    '<!-- Latitude line north -->' +
    '<line x1="200" y1="75" x2="200" y2="125" stroke="var(--sky)" stroke-width="1" stroke-dasharray="3 2"/>' +
    '<text x="212" y="100" fill="var(--sky)" font-size="9">5\u00B0 \u05DE\u05E7\u05E1\u05D9\u05DE\u05D5\u05DD</text>' +
    '<!-- South region -->' +
    '<text x="200" y="220" text-anchor="middle" fill="var(--red)" font-size="11" font-weight="600">\u05D3\u05E8\u05D5\u05DD</text>' +
    '<path d="M 30 125 Q 200 200 370 125" fill="none" stroke="rgba(239,68,68,0.3)" stroke-width="1.5" stroke-dasharray="5 3"/>' +
    '<!-- Nodes -->' +
    '<circle cx="60" cy="125" r="6" fill="none" stroke="var(--gold)" stroke-width="2"/>' +
    '<text x="60" y="148" text-anchor="middle" fill="var(--gold)" font-size="9">\u05E8\u05D0\u05E9 \u2191</text>' +
    '<circle cx="340" cy="125" r="6" fill="none" stroke="var(--red)" stroke-width="2"/>' +
    '<text x="340" y="148" text-anchor="middle" fill="var(--red)" font-size="9">\u05D6\u05E0\u05D1 \u2193</text>' +
    '<!-- 0 at nodes label -->' +
    '<text x="200" y="242" text-anchor="middle" fill="var(--txt3)" font-size="9">\u05D1\u05E6\u05DE\u05EA\u05D9\u05DD: \u05E8\u05D5\u05D7\u05D1 = 0\u00B0 | \u05D1\u05DE\u05E8\u05D7\u05E7 \u05D4\u05DE\u05E7\u05E1\u05D9\u05DE\u05DC\u05D9: \u05E8\u05D5\u05D7\u05D1 = 5\u00B0</text>' +
    '</svg></div>',

  /* ============================================= */
  /* PARALLAX CONCEPT DIAGRAM (17:1)               */
  /* ============================================= */
  parallaxConcept: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 400 300" style="width:100%;max-width:400px">' +
    '<rect width="400" height="300" rx="12" fill="#080c18"/>' +
    '<!-- Earth -->' +
    '<circle cx="100" cy="200" r="50" fill="#1a3366" stroke="#2244aa" stroke-width="1.5"/>' +
    '<text x="100" y="205" text-anchor="middle" fill="#87CEEB" font-size="11">\u05D0\u05E8\u05E5</text>' +
    '<!-- Center of earth -->' +
    '<circle cx="100" cy="200" r="3" fill="var(--gold)"/>' +
    '<text x="85" y="218" fill="var(--gold)" font-size="8">\u05DE\u05E8\u05DB\u05D6</text>' +
    '<!-- Observer on surface -->' +
    '<circle cx="130" cy="158" r="4" fill="var(--green)"/>' +
    '<text x="145" y="155" fill="var(--green)" font-size="8">\u05E6\u05D5\u05E4\u05D4</text>' +
    '<!-- Moon -->' +
    '<circle cx="330" cy="60" r="8" fill="#e8e8d8"/>' +
    '<text x="345" y="58" fill="#e8e8d8" font-size="10">\u05D9\u05E8\u05D7</text>' +
    '<!-- Line from center to moon -->' +
    '<line x1="100" y1="200" x2="330" y2="60" stroke="var(--gold)" stroke-width="1" stroke-dasharray="5 3"/>' +
    '<!-- Line from observer to moon -->' +
    '<line x1="130" y1="158" x2="330" y2="60" stroke="var(--green)" stroke-width="1.5"/>' +
    '<!-- Parallax angle -->' +
    '<path d="M 280 85 A 80 80 0 0 1 290 95" fill="none" stroke="var(--red)" stroke-width="2"/>' +
    '<text x="260" y="100" fill="var(--red)" font-size="10" font-weight="700">\u05E4\u05E8\u05DC\u05E7\u05E1\u05D4</text>' +
    '<!-- Explanation -->' +
    '<rect x="20" y="260" width="360" height="30" rx="6" fill="rgba(255,255,255,0.04)"/>' +
    '<text x="200" y="280" text-anchor="middle" fill="var(--txt3)" font-size="9">\u05D4\u05E6\u05D5\u05E4\u05D4 \u05E8\u05D5\u05D0\u05D4 \u05D0\u05EA \u05D4\u05D9\u05E8\u05D7 \u05D1\u05D6\u05D5\u05D5\u05D9\u05EA \u05E9\u05D5\u05E0\u05D4 \u05DE\u05D4\u05DE\u05E8\u05DB\u05D6 \u2014 \u05D6\u05D5 \u05D4\u05E4\u05E8\u05DC\u05E7\u05E1\u05D4</text>' +
    '</svg></div>',

  /* ============================================= */
  /* THREE LONGITUDES FLOW (17:11)                 */
  /* ============================================= */
  threeLongitudes: '<div class="flow-diagram" style="direction:rtl">' +
    '<div class="flow-step" style="border-color:var(--sky);color:var(--sky);font-weight:600">\u05D0\u05D5\u05E8\u05DA \u05E8\u05D0\u05E9\u05D5\u05DF<br><span style="font-size:.7rem;color:var(--txt3)">\u05DE\u05D9\u05E7\u05D5\u05DD \u05D0\u05DE\u05E6\u05E2\u05D9</span></div>' +
    '<div class="flow-arrow">\u2190</div>' +
    '<div class="flow-step" style="font-size:.7rem;color:var(--green)">\u05EA\u05D9\u05E7\u05D5\u05DF<br>\u05D0\u05E0\u05D5\u05DE\u05DC\u05D9\u05D4</div>' +
    '<div class="flow-arrow">\u2190</div>' +
    '<div class="flow-step" style="border-color:var(--purple);color:var(--purple);font-weight:600">\u05D0\u05D5\u05E8\u05DA \u05E9\u05E0\u05D9<br><span style="font-size:.7rem;color:var(--txt3)">\u05DE\u05D9\u05E7\u05D5\u05DD \u05D0\u05DE\u05D9\u05EA\u05D9</span></div>' +
    '<div class="flow-arrow">\u2190</div>' +
    '<div class="flow-step" style="font-size:.7rem;color:var(--green)">\u05EA\u05D9\u05E7\u05D5\u05DF<br>\u05E4\u05E8\u05DC\u05E7\u05E1\u05D4</div>' +
    '<div class="flow-arrow">\u2190</div>' +
    '<div class="flow-step" style="border-color:var(--gold);color:var(--gold);font-weight:600">\u05D0\u05D5\u05E8\u05DA \u05E9\u05DC\u05D9\u05E9\u05D9<br><span style="font-size:.7rem;color:var(--txt3)">\u05DE\u05D9\u05E7\u05D5\u05DD \u05E0\u05E8\u05D0\u05D4</span></div>' +
    '</div>',

  /* ============================================= */
  /* SUNSET ARC SCENE (17:7)                       */
  /* ============================================= */
  sunsetArc: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 400 240" style="width:100%;max-width:400px">' +
    '<!-- Sky gradient -->' +
    '<defs><linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="#0a1628"/><stop offset="60%" stop-color="#1a2a4a"/><stop offset="100%" stop-color="#cc5500"/>' +
    '</linearGradient></defs>' +
    '<rect width="400" height="240" rx="12" fill="url(#skyGrad)"/>' +
    '<!-- Horizon -->' +
    '<line x1="0" y1="190" x2="400" y2="190" stroke="rgba(204,85,0,0.6)" stroke-width="2"/>' +
    '<text x="380" y="205" text-anchor="end" fill="rgba(204,85,0,0.5)" font-size="9">\u05D0\u05D5\u05E4\u05E7</text>' +
    '<!-- Sun (half below horizon) -->' +
    '<circle cx="320" cy="192" r="18" fill="#ff6600" opacity="0.7"/>' +
    '<text x="320" y="218" text-anchor="middle" fill="#ff9933" font-size="9">\u05E9\u05DE\u05E9 \u05E9\u05D5\u05E7\u05E2\u05EA</text>' +
    '<!-- Moon crescent -->' +
    '<circle cx="200" cy="100" r="8" fill="#e8e8d8"/>' +
    '<circle cx="204" cy="98" r="7" fill="#0a1628"/>' +
    '<text x="220" y="98" fill="#e8e8d8" font-size="9">\u05E1\u05D4\u05E8</text>' +
    '<!-- Arc between sun and moon -->' +
    '<path d="M 310 185 Q 260 130 208 105" fill="none" stroke="var(--gold)" stroke-width="2" stroke-dasharray="5 3"/>' +
    '<text x="270" y="140" fill="var(--gold)" font-size="12" font-weight="700">\u05E7\u05E9\u05EA \u05E8\u05D0\u05D9\u05D9\u05D4</text>' +
    '<!-- Rules -->' +
    '<rect x="15" y="15" width="180" height="68" rx="8" fill="rgba(0,0,0,0.4)"/>' +
    '<text x="105" y="33" text-anchor="middle" fill="var(--red)" font-size="10">\u2264 9\u00B0 \u2014 \u05DC\u05D0 \u05D9\u05D9\u05E8\u05D0\u05D4</text>' +
    '<text x="105" y="50" text-anchor="middle" fill="var(--txt3)" font-size="10">9\u00B0\u201314\u00B0 \u2014 \u05EA\u05DC\u05D5\u05D9 \u05D1\u05D2\u05D5\u05E8\u05DE\u05D9\u05DD</text>' +
    '<text x="105" y="67" text-anchor="middle" fill="var(--green)" font-size="10">\u2265 14\u00B0 \u2014 \u05D9\u05D9\u05E8\u05D0\u05D4 \u05D1\u05D5\u05D5\u05D3\u05D0\u05D5\u05EA</text>' +
    '</svg></div>',

  /* ============================================= */
  /* ECLIPTIC TILT DIAGRAM (19:2)                  */
  /* ============================================= */
  eclipticTilt: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 400 280" style="width:100%;max-width:400px">' +
    '<rect width="400" height="280" rx="12" fill="#080c18"/>' +
    '<!-- Celestial equator -->' +
    '<ellipse cx="200" cy="140" rx="170" ry="30" fill="none" stroke="rgba(135,206,235,0.3)" stroke-width="1.5"/>' +
    '<text x="385" y="138" text-anchor="end" fill="rgba(135,206,235,0.5)" font-size="9">\u05E7\u05D5 \u05D4\u05DE\u05E9\u05D5\u05D5\u05D4</text>' +
    '<!-- Ecliptic (tilted) -->' +
    '<ellipse cx="200" cy="140" rx="170" ry="30" fill="none" stroke="rgba(244,208,63,0.3)" stroke-width="1.5" transform="rotate(-23.5,200,140)"/>' +
    '<text x="340" y="80" fill="rgba(244,208,63,0.5)" font-size="9">\u05D0\u05E7\u05DC\u05D9\u05E4\u05D8\u05D9\u05E7\u05D4</text>' +
    '<!-- Tilt angle -->' +
    '<path d="M 370 140 A 15 15 0 0 0 365 130" fill="none" stroke="var(--green)" stroke-width="1.5"/>' +
    '<text x="348" y="128" fill="var(--green)" font-size="9">23.5\u00B0</text>' +
    '<!-- Equinox points -->' +
    '<circle cx="30" cy="140" r="5" fill="var(--gold)"/>' +
    '<text x="30" y="160" text-anchor="middle" fill="var(--gold)" font-size="8">\u05E0\u05E7\u05D5\u05D3\u05EA \u05E9\u05D5\u05D5\u05D9\u05D5\u05DF</text>' +
    '<circle cx="370" cy="140" r="5" fill="var(--gold)"/>' +
    '<text x="370" y="160" text-anchor="middle" fill="var(--gold)" font-size="8">\u05E0\u05E7\u05D5\u05D3\u05EA \u05E9\u05D5\u05D5\u05D9\u05D5\u05DF</text>' +
    '<!-- Summer solstice -->' +
    '<text x="200" y="35" text-anchor="middle" fill="var(--sky)" font-size="9">\u05E6\u05E4\u05D5\u05DF \u2014 \u05E7\u05D9\u05E5 (\u05E1\u05E8\u05D8\u05DF)</text>' +
    '<path d="M 200 45 L 200 90" fill="none" stroke="var(--sky)" stroke-width="1" stroke-dasharray="3 2"/>' +
    '<!-- Winter solstice -->' +
    '<text x="200" y="260" text-anchor="middle" fill="var(--red)" font-size="9">\u05D3\u05E8\u05D5\u05DD \u2014 \u05D7\u05D5\u05E8\u05E3 (\u05D2\u05D3\u05D9)</text>' +
    '<path d="M 200 245 L 200 200" fill="none" stroke="var(--red)" stroke-width="1" stroke-dasharray="3 2"/>' +
    '</svg></div>',

  /* ============================================= */
  /* CRESCENT DIRECTION VISUAL (19:12)             */
  /* ============================================= */
  crescentDirVisual: '<div class="concept-diagram">' +
    '<svg viewBox="0 0 400 200" style="width:100%;max-width:400px">' +
    '<rect width="400" height="200" rx="12" fill="#080c18"/>' +
    '<!-- Case 1: On equator -->' +
    '<circle cx="70" cy="80" r="22" fill="#e8e8d8"/>' +
    '<circle cx="70" cy="80" r="20" fill="#080c18" transform="translate(0,-4)"/>' +
    '<text x="70" y="120" text-anchor="middle" fill="var(--txt3)" font-size="9">\u05E2\u05DC \u05E7\u05D5 \u05D4\u05DE\u05E9\u05D5\u05D5\u05D4</text>' +
    '<text x="70" y="135" text-anchor="middle" fill="var(--sky)" font-size="9">\u05E7\u05E8\u05E0\u05D9\u05D9\u05DD \u05DC\u05DE\u05E2\u05DC\u05D4</text>' +
    '<!-- Case 2: North -->' +
    '<g transform="translate(200,80) rotate(-20)">' +
    '<circle cx="0" cy="0" r="22" fill="#e8e8d8"/>' +
    '<circle cx="4" cy="-3" r="20" fill="#080c18"/>' +
    '</g>' +
    '<text x="200" y="120" text-anchor="middle" fill="var(--txt3)" font-size="9">\u05E6\u05E4\u05D5\u05E0\u05D9\u05EA \u05DC\u05E7\u05D5 \u05D4\u05DE\u05E9\u05D5\u05D5\u05D4</text>' +
    '<text x="200" y="135" text-anchor="middle" fill="var(--gold)" font-size="9">\u05E0\u05D5\u05D8\u05D4 \u05D3\u05E8\u05D5\u05DD-\u05DE\u05D6\u05E8\u05D7</text>' +
    '<!-- Case 3: South -->' +
    '<g transform="translate(330,80) rotate(20)">' +
    '<circle cx="0" cy="0" r="22" fill="#e8e8d8"/>' +
    '<circle cx="-4" cy="-3" r="20" fill="#080c18"/>' +
    '</g>' +
    '<text x="330" y="120" text-anchor="middle" fill="var(--txt3)" font-size="9">\u05D3\u05E8\u05D5\u05DE\u05D9\u05EA \u05DC\u05E7\u05D5 \u05D4\u05DE\u05E9\u05D5\u05D5\u05D4</text>' +
    '<text x="330" y="135" text-anchor="middle" fill="var(--red)" font-size="9">\u05E0\u05D5\u05D8\u05D4 \u05E6\u05E4\u05D5\u05DF-\u05DE\u05D6\u05E8\u05D7</text>' +
    '<!-- Equator line -->' +
    '<line x1="20" y1="165" x2="380" y2="165" stroke="rgba(135,206,235,0.3)" stroke-width="1"/>' +
    '<text x="200" y="185" text-anchor="middle" fill="rgba(135,206,235,0.4)" font-size="8">\u05E7\u05D5 \u05D4\u05DE\u05E9\u05D5\u05D5\u05D4 \u05D4\u05E9\u05DE\u05D9\u05DE\u05D9</text>' +
    '</svg></div>',

  moonCalc: '<div class="calc-tool">' +
    '<div style="font-size:.82rem;color:var(--purple);font-weight:600;margin-bottom:8px">\u05D7\u05D9\u05E9\u05D5\u05D1 \u05DE\u05E7\u05D5\u05DD \u05D4\u05D9\u05E8\u05D7 \u05D4\u05D0\u05DE\u05D9\u05EA\u05D9 \u2014 \u05E4\u05E8\u05E7 \u05D8\u05F4\u05D5</div>' +
    '<div class="inline-row">' +
      '<label>\u05D9\u05DE\u05D9\u05DD \u05DE\u05D4\u05E2\u05D9\u05E7\u05E8:</label>' +
      '<input type="number" id="moonD" value="100" min="0">' +
      '<button class="btn-calc" onclick="runMoonCalc()">\u05D7\u05E9\u05D1 \u05DE\u05E7\u05D5\u05DD \u05D9\u05E8\u05D7</button>' +
    '</div>' +
    '<div id="moonResult"></div>' +
  '</div>',

  latitudeCalc: '<div class="calc-tool">' +
    '<div style="font-size:.82rem;color:var(--purple);font-weight:600;margin-bottom:8px">\u05D7\u05D9\u05E9\u05D5\u05D1 \u05E8\u05D5\u05D7\u05D1 \u05D4\u05D9\u05E8\u05D7 \u2014 \u05E4\u05E8\u05E7 \u05D8\u05F4\u05D6</div>' +
    '<div class="inline-row">' +
      '<label>\u05D9\u05DE\u05D9\u05DD \u05DE\u05D4\u05E2\u05D9\u05E7\u05E8:</label>' +
      '<input type="number" id="latD" value="100" min="0">' +
      '<button class="btn-calc" onclick="runLatitudeCalc()">\u05D7\u05E9\u05D1 \u05E8\u05D5\u05D7\u05D1</button>' +
    '</div>' +
    '<div id="latResult"></div>' +
  '</div>',

  orbitCanvas: '<div class="viz-container" id="viz-orbit">' +
    '<canvas id="orbitCvs" style="width:100%;height:320px;display:block;border-radius:12px;background:#080c18"></canvas>' +
    '<div class="scene-ctrl">' +
      '<button class="sc-btn on" id="orbitPlayBtn" onclick="toggleOrbitPlay()">\u23F8</button>' +
      '<label style="font-size:.72rem;color:var(--txt3);margin:0 6px">\u05DE\u05D4\u05D9\u05E8\u05D5\u05EA:</label>' +
      '<input type="range" min="1" max="20" value="5" id="orbitSpeedSlider" style="accent-color:var(--gold);width:100px">' +
    '</div>' +
    '<div style="display:flex;justify-content:space-around;font-size:.72rem;color:var(--txt3);padding:4px 8px">' +
      '<span>\u05D0\u05DE\u05E6\u05E2: <span id="orbitMeanLbl" style="color:var(--sky)">0\u00B0</span></span>' +
      '<span>\u05D0\u05DE\u05D9\u05EA\u05D9: <span id="orbitTrueLbl" style="color:var(--gold)">0\u00B0</span></span>' +
      '<span>\u05DE\u05E0\u05D4: <span id="orbitEqLbl" style="color:var(--green)">0\u00B0</span></span>' +
    '</div>' +
  '</div>',

  nodesAnim: '<div class="viz-container" id="viz-nodes">' +
    '<canvas id="nodesCvs" style="width:100%;height:300px;display:block;border-radius:12px;background:#080c18"></canvas>' +
    '<div class="scene-ctrl">' +
      '<button class="sc-btn on" id="nodesPlayBtn" onclick="toggleNodesPlay()">\u23F8</button>' +
      '<label style="font-size:.72rem;color:var(--txt3);margin:0 6px">\u05DE\u05D4\u05D9\u05E8\u05D5\u05EA:</label>' +
      '<input type="range" min="1" max="20" value="5" id="nodesSpeedSlider" style="accent-color:var(--gold);width:100px">' +
    '</div>' +
    '<div style="display:flex;justify-content:space-around;font-size:.72rem;color:var(--txt3);padding:4px 8px">' +
      '<span>\u05E8\u05D0\u05E9: <span id="nodesHeadLbl" style="color:var(--gold)">0\u00B0</span></span>' +
      '<span>\u05D6\u05E0\u05D1: <span id="nodesTailLbl" style="color:var(--red)">180\u00B0</span></span>' +
      '<span>\u05E8\u05D5\u05D7\u05D1: <span id="nodesLatLbl" style="color:var(--sky)">0\u00B0</span></span>' +
    '</div>' +
  '</div>'
};

// =============================================
// ORBIT CANVAS ANIMATION (Epicycle Model)
// =============================================
var _orbitPlaying = false, _orbitRaf = null, _orbitAngle = 0, _orbitUserPaused = false, _orbitInited = false;

window.toggleOrbitPlay = function(){
  _orbitPlaying = !_orbitPlaying;
  _orbitUserPaused = !_orbitPlaying;
  var btn = document.getElementById('orbitPlayBtn');
  if(btn){ btn.textContent = _orbitPlaying ? '\u23F8' : '\u25B6'; btn.className = _orbitPlaying ? 'sc-btn on' : 'sc-btn'; }
  if(_orbitPlaying) _runOrbitLoop();
  else if(_orbitRaf){ cancelAnimationFrame(_orbitRaf); _orbitRaf = null; }
};

function _runOrbitLoop(){
  if(_orbitRaf) cancelAnimationFrame(_orbitRaf);
  (function loop(){
    if(!_orbitPlaying) return;
    var spd = +(document.getElementById('orbitSpeedSlider')||{value:5}).value;
    _orbitAngle += spd * 0.003;
    _drawOrbit(_orbitAngle);
    _orbitRaf = requestAnimationFrame(loop);
  })();
}

function _drawOrbit(t){
  var cv = document.getElementById('orbitCvs');
  if(!cv) return;
  var rect = cv.getBoundingClientRect();
  var dpr = window.devicePixelRatio||1;
  cv.width = rect.width*dpr; cv.height = rect.height*dpr;
  var ctx = cv.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  var W=rect.width, H=rect.height, cx=W/2, cy=H/2;
  var R = Math.min(W,H)*0.35, r = R*0.18;

  ctx.fillStyle='#080c18'; ctx.fillRect(0,0,W,H);

  // Stars
  ctx.fillStyle='rgba(255,255,255,0.4)';
  for(var i=0;i<60;i++){
    ctx.fillRect((Math.sin(i*137.508)*0.5+0.5)*W, (Math.cos(i*97.3)*0.5+0.5)*H, 1, 1);
  }

  var meanAngle = t*2.3, anomAngle = t*2.18;
  var dcx = cx+R*Math.cos(meanAngle), dcy = cy+R*Math.sin(meanAngle);
  var mx = dcx+r*Math.cos(anomAngle), my = dcy+r*Math.sin(anomAngle);
  var trueAngle = Math.atan2(my-cy, mx-cx);
  var meanDeg = ((meanAngle*180/Math.PI)%360+360)%360;
  var trueDeg = ((trueAngle*180/Math.PI)%360+360)%360;
  var eqDeg = trueDeg-meanDeg; if(eqDeg>180)eqDeg-=360; if(eqDeg<-180)eqDeg+=360;

  // Deferent
  ctx.strokeStyle='rgba(135,206,235,0.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();

  // Epicycle
  ctx.strokeStyle='rgba(244,208,63,0.25)';
  ctx.beginPath(); ctx.arc(dcx,dcy,r,0,Math.PI*2); ctx.stroke();

  // Mean direction (dashed)
  ctx.strokeStyle='rgba(135,206,235,0.3)'; ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(dcx,dcy); ctx.stroke(); ctx.setLineDash([]);

  // True direction
  ctx.strokeStyle='rgba(244,208,63,0.5)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(mx,my); ctx.stroke(); ctx.lineWidth=1;

  // Earth
  ctx.fillStyle='#2244aa'; ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#87CEEB'; ctx.font='10px Heebo'; ctx.textAlign='center'; ctx.fillText('\u05D0\u05E8\u05E5',cx,cy+20);

  // Epicycle center
  ctx.fillStyle='rgba(135,206,235,0.5)'; ctx.beginPath(); ctx.arc(dcx,dcy,3,0,Math.PI*2); ctx.fill();

  // Moon
  ctx.fillStyle='#e8e8d8'; ctx.beginPath(); ctx.arc(mx,my,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#f4d03f'; ctx.font='10px Heebo'; ctx.fillText('\u05D9\u05E8\u05D7',mx,my-10);

  // Labels on circle
  ctx.fillStyle='rgba(135,206,235,0.5)'; ctx.font='9px Heebo';
  ctx.fillText('\u05D0\u05DE\u05E6\u05E2', cx+R*1.15*Math.cos(meanAngle), cy+R*1.15*Math.sin(meanAngle));
  ctx.fillStyle='rgba(244,208,63,0.6)';
  ctx.fillText('\u05D0\u05DE\u05D9\u05EA\u05D9', cx+R*1.15*Math.cos(trueAngle), cy+R*1.15*Math.sin(trueAngle));

  // Update readouts
  var ml=document.getElementById('orbitMeanLbl'), tl=document.getElementById('orbitTrueLbl'), el=document.getElementById('orbitEqLbl');
  if(ml) ml.textContent=Math.round(meanDeg)+'\u00B0';
  if(tl) tl.textContent=Math.round(trueDeg)+'\u00B0';
  if(el) el.textContent=eqDeg.toFixed(1)+'\u00B0';
}

// =============================================
// NODES CANVAS ANIMATION (Lunar Nodes)
// =============================================
var _nodesPlaying = false, _nodesRaf = null, _nodesTime = 0, _nodesUserPaused = false, _nodesInited = false;

window.toggleNodesPlay = function(){
  _nodesPlaying = !_nodesPlaying;
  _nodesUserPaused = !_nodesPlaying;
  var btn = document.getElementById('nodesPlayBtn');
  if(btn){ btn.textContent = _nodesPlaying ? '\u23F8' : '\u25B6'; btn.className = _nodesPlaying ? 'sc-btn on' : 'sc-btn'; }
  if(_nodesPlaying) _runNodesLoop();
  else if(_nodesRaf){ cancelAnimationFrame(_nodesRaf); _nodesRaf = null; }
};

function _runNodesLoop(){
  if(_nodesRaf) cancelAnimationFrame(_nodesRaf);
  (function loop(){
    if(!_nodesPlaying) return;
    var spd = +(document.getElementById('nodesSpeedSlider')||{value:5}).value;
    _nodesTime += spd * 0.002;
    _drawNodes(_nodesTime);
    _nodesRaf = requestAnimationFrame(loop);
  })();
}

function _drawNodes(t){
  var cv = document.getElementById('nodesCvs');
  if(!cv) return;
  var rect = cv.getBoundingClientRect();
  var dpr = window.devicePixelRatio||1;
  cv.width = rect.width*dpr; cv.height = rect.height*dpr;
  var ctx = cv.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  var W=rect.width, H=rect.height, cx=W/2, cy=H/2;
  var R = Math.min(W,H)*0.38;
  var incl = 0.26; // ~15deg visual exaggeration

  ctx.fillStyle='#080c18'; ctx.fillRect(0,0,W,H);

  // Stars
  ctx.fillStyle='rgba(255,255,255,0.3)';
  for(var i=0;i<50;i++){
    ctx.fillRect((Math.sin(i*137.508)*0.5+0.5)*W, (Math.cos(i*97.3)*0.5+0.5)*H, 1, 1);
  }

  var nodeAngle = -t*0.15; // retrograde

  // Ecliptic
  ctx.strokeStyle='rgba(244,208,63,0.3)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.ellipse(cx,cy,R,R*0.15,0,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(244,208,63,0.15)'; ctx.font='10px Heebo'; ctx.textAlign='center';
  ctx.fillText('\u05DE\u05E1\u05DC\u05D5\u05DC \u05D4\u05E9\u05DE\u05E9 (\u05D0\u05E7\u05DC\u05D9\u05E4\u05D8\u05D9\u05E7\u05D4)',cx,cy+R*0.15+18);

  // Moon orbit (tilted)
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(nodeAngle);
  ctx.strokeStyle='rgba(135,206,235,0.35)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.ellipse(0,0,R,R*0.15+R*Math.sin(incl)*0.7,0,0,Math.PI*2); ctx.stroke();
  ctx.restore();

  // Nodes
  var headX=cx+R*Math.cos(nodeAngle), headY=cy+R*0.15*Math.sin(nodeAngle);
  var tailX=cx+R*Math.cos(nodeAngle+Math.PI), tailY=cy+R*0.15*Math.sin(nodeAngle+Math.PI);

  ctx.fillStyle='#f4d03f'; ctx.beginPath(); ctx.arc(headX,headY,6,0,Math.PI*2); ctx.fill();
  ctx.font='bold 11px Heebo'; ctx.textAlign='center'; ctx.fillText('\u05E8\u05D0\u05E9 \u2191',headX,headY-12);

  ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(tailX,tailY,6,0,Math.PI*2); ctx.fill();
  ctx.fillText('\u05D6\u05E0\u05D1 \u2193',tailX,tailY-12);

  // Earth
  ctx.fillStyle='#2244aa'; ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#87CEEB'; ctx.font='10px Heebo'; ctx.fillText('\u05D0\u05E8\u05E5',cx,cy+18);

  // Moon
  var mAngle = t*2.5;
  var mox = R*Math.cos(mAngle), moy_flat = R*0.15*Math.sin(mAngle);
  var tiltPhase = mAngle - nodeAngle;
  var moy_tilt = R*Math.sin(incl)*0.7*Math.sin(tiltPhase);
  var cosN=Math.cos(nodeAngle), sinN=Math.sin(nodeAngle);
  var rmx = mox*cosN - (moy_flat+moy_tilt)*sinN;
  var rmy = mox*sinN + (moy_flat+moy_tilt)*cosN;
  var moonX = cx+rmx, moonY = cy+rmy;

  // Latitude line
  var eclY = cy + R*0.15*Math.sin(Math.atan2(rmy,rmx));
  var latPx = eclY - moonY;
  if(Math.abs(latPx)>2){
    ctx.strokeStyle='rgba(135,206,235,0.4)'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(moonX,moonY); ctx.lineTo(moonX,moonY+latPx); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle='rgba(135,206,235,0.6)'; ctx.font='9px Heebo'; ctx.textAlign='left';
    ctx.fillText(latPx>0?'\u05D3\u05E8\u05D5\u05DD':'\u05E6\u05E4\u05D5\u05DF', moonX+8, moonY+latPx/2);
  }

  ctx.fillStyle='#e8e8d8'; ctx.beginPath(); ctx.arc(moonX,moonY,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#e8e8d8'; ctx.font='10px Heebo'; ctx.textAlign='center'; ctx.fillText('\u05D9\u05E8\u05D7',moonX,moonY-10);

  ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.font='9px Heebo';
  ctx.fillText('\u2190 \u05E0\u05E1\u05D9\u05D2\u05EA \u05D4\u05E8\u05D0\u05E9 (\u05D0\u05D7\u05D5\u05E8\u05E0\u05D9\u05EA)',cx,H-10);

  // Labels
  var headDeg = (((-nodeAngle*180/Math.PI)%360)+360)%360;
  var tailDeg = (headDeg+180)%360;
  var latVal = Math.abs(latPx/(R*Math.sin(incl)*0.7)*5); if(latVal>5)latVal=5;
  var hl=document.getElementById('nodesHeadLbl'), tl2=document.getElementById('nodesTailLbl'), ll=document.getElementById('nodesLatLbl');
  if(hl) hl.textContent=Math.round(headDeg)+'\u00B0';
  if(tl2) tl2.textContent=Math.round(tailDeg)+'\u00B0';
  if(ll) ll.textContent=latVal.toFixed(1)+'\u00B0 '+(latPx>0?'\u05D3\u05E8\u05D5\u05DD':'\u05E6\u05E4\u05D5\u05DF');
}

// =============================================
// MUTATION OBSERVER — start animations when canvas appears
// =============================================
var _vizCanvasObserver = new MutationObserver(function(){
  var orbitCv = document.getElementById('orbitCvs');
  if(orbitCv && !_orbitPlaying && !_orbitUserPaused){
    _orbitInited = true; _orbitPlaying = true; _orbitAngle = 0; _runOrbitLoop();
  }
  if(!orbitCv && _orbitInited){
    _orbitInited = false; _orbitPlaying = false; _orbitUserPaused = false;
    if(_orbitRaf){ cancelAnimationFrame(_orbitRaf); _orbitRaf = null; }
  }
  var nodesCv = document.getElementById('nodesCvs');
  if(nodesCv && !_nodesPlaying && !_nodesUserPaused){
    _nodesInited = true; _nodesPlaying = true; _nodesTime = 0; _runNodesLoop();
  }
  if(!nodesCv && _nodesInited){
    _nodesInited = false; _nodesPlaying = false; _nodesUserPaused = false;
    if(_nodesRaf){ cancelAnimationFrame(_nodesRaf); _nodesRaf = null; }
  }
});
_vizCanvasObserver.observe(document.body, {childList: true, subtree: true});
