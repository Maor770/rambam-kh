/* new-calculators.js
 * Moon True Position (Ch 15) and Moon Latitude (Ch 16)
 * Based on Rambam Hilchot Kiddush HaChodesh
 * All functions are globals — no modules.
 */

// ========================
// SHARED UTILITIES
// ========================

/** Degrees-minutes-seconds formatter (matches existing dms in calculators.js) */
function dmsFormat(v) {
  v = ((v % 360) + 360) % 360;
  var d = Math.floor(v);
  var m = Math.floor((v - d) * 60);
  var s = Math.round(((v - d) * 60 - m) * 60);
  if (s === 60) { m++; s = 0; }
  if (m === 60) { d++; m = 0; }
  return d + '\u00B0' + m + '\u05F3' + s + '\u05F4';
}

/** Normalize angle to 0-360 */
function normDeg(v) {
  return ((v % 360) + 360) % 360;
}

/** Zodiac sign from longitude */
var ZODIAC_SIGNS = [
  '\u05D8\u05DC\u05D4',       // Aries
  '\u05E9\u05D5\u05E8',       // Taurus
  '\u05EA\u05D0\u05D5\u05DE\u05D9\u05DD', // Gemini
  '\u05E1\u05E8\u05D8\u05DF', // Cancer
  '\u05D0\u05E8\u05D9\u05D4', // Leo
  '\u05D1\u05EA\u05D5\u05DC\u05D4', // Virgo
  '\u05DE\u05D0\u05D6\u05E0\u05D9\u05D9\u05DD', // Libra
  '\u05E2\u05E7\u05E8\u05D1', // Scorpio
  '\u05E7\u05E9\u05EA',       // Sagittarius
  '\u05D2\u05D3\u05D9',       // Capricorn
  '\u05D3\u05DC\u05D9',       // Aquarius
  '\u05D3\u05D2\u05D9\u05DD'  // Pisces
];

function zodiacFromLong(lng) {
  lng = normDeg(lng);
  var si = Math.floor(lng / 30);
  var inS = lng - si * 30;
  return ZODIAC_SIGNS[si] + ' ' + Math.floor(inS) + '\u00B0';
}

// ========================
// MOON EQUATION TABLE (15:6)
// ========================
// Entries at every 10 degrees from 0 to 180.
// Values in degrees (decimal). 0 deg = 0, 10 deg = 0+50/60, etc.
var MOON_EQ_TABLE = [
  0,             // 0
  50 / 60,       // 10  = 0deg 50'
  1 + 38 / 60,   // 20  = 1deg 38'
  2 + 24 / 60,   // 30  = 2deg 24'
  3 + 6 / 60,    // 40  = 3deg 06'
  3 + 44 / 60,   // 50  = 3deg 44'
  4 + 16 / 60,   // 60  = 4deg 16'
  4 + 41 / 60,   // 70  = 4deg 41'
  5,             // 80  = 5deg 00'
  5 + 8 / 60,    // 90  = 5deg 08'
  5 + 8 / 60,    // 100 = 5deg 08'
  4 + 59 / 60,   // 110 = 4deg 59'
  4 + 20 / 60,   // 120 = 4deg 20'
  3 + 44 / 60,   // 130 = 3deg 44' (mirror of 50 from other end)
  3 + 6 / 60,    // 140 = 3deg 06' (mirror of 40)
  2 + 24 / 60,   // 150 = 2deg 24' (mirror of 30)
  1 + 38 / 60,   // 160 = 1deg 38' (mirror of 20)
  50 / 60,       // 170 = 0deg 50' (mirror of 10)
  0              // 180 = 0deg 00'
];

/** Interpolate moon equation from anomaly (0-360) */
function moonEquation(anomalyDeg) {
  var a = normDeg(anomalyDeg);
  // If anomaly > 180, mirror: use 360 - a
  var lookupA = a > 180 ? 360 - a : a;
  // Clamp to 0-180
  if (lookupA < 0) lookupA = 0;
  if (lookupA > 180) lookupA = 180;
  // Index into table (entries every 10 degrees)
  var idx = Math.floor(lookupA / 10);
  var frac = (lookupA - idx * 10) / 10;
  if (idx >= 18) idx = 17;
  var eq = MOON_EQ_TABLE[idx] + (MOON_EQ_TABLE[idx + 1] - MOON_EQ_TABLE[idx]) * frac;
  return eq;
}

// ========================
// LATITUDE TABLE (16:11)
// ========================
// Entries at every 10 degrees from 0 to 90
var LAT_TABLE = [
  0,             // 0
  52 / 60,       // 10  = 0deg 52'
  1 + 43 / 60,   // 20  = 1deg 43'
  2 + 30 / 60,   // 30  = 2deg 30'
  3 + 13 / 60,   // 40  = 3deg 13'
  3 + 50 / 60,   // 50  = 3deg 50'
  4 + 20 / 60,   // 60  = 4deg 20'
  4 + 42 / 60,   // 70  = 4deg 42'
  4 + 55 / 60,   // 80  = 4deg 55'
  5              // 90  = 5deg 00'
];

/** Interpolate latitude from argument (0-360).
 *  0-90: direct lookup.  90-180: mirror (use 180-arg).
 *  180-270: direct lookup, negate.  270-360: mirror (use 360-arg), negate.
 *  Returns { lat: degrees, north: boolean }
 */
function moonLatitude(argDeg) {
  var a = normDeg(argDeg);
  var north = a <= 180;
  // Map to 0-90 for lookup
  var lookupA;
  if (a <= 90) {
    lookupA = a;
  } else if (a <= 180) {
    lookupA = 180 - a;
  } else if (a <= 270) {
    lookupA = a - 180;
  } else {
    lookupA = 360 - a;
  }
  if (lookupA < 0) lookupA = 0;
  if (lookupA > 90) lookupA = 90;
  var idx = Math.floor(lookupA / 10);
  var frac = (lookupA - idx * 10) / 10;
  if (idx >= 9) idx = 8;
  var lat = LAT_TABLE[idx] + (LAT_TABLE[idx + 1] - LAT_TABLE[idx]) * frac;
  return { lat: lat, north: north };
}

// ========================
// runMoonCalc() — Chapter 15
// ========================

function runMoonCalc() {
  var days = +document.getElementById('moonD').value || 0;

  // Mean moon position (amtza haYareach) — 14:2
  // Daily rate: 13deg 10' 35" = 13 + 10/60 + 35/3600
  var moonDailyRate = 13 + 10 / 60 + 35 / 3600;
  // Epoch value: 1deg 14' 43"
  var moonEpoch = 1 + 14 / 60 + 43 / 3600;
  var meanMoon = normDeg(moonEpoch + moonDailyRate * days);

  // Mean anomaly (amtza haMaslul) — 14:4
  // Daily rate: 13deg 3' 54" = 13 + 3/60 + 54/3600
  var anomDailyRate = 13 + 3 / 60 + 54 / 3600;
  // Epoch value: 84deg 28' 42"
  var anomEpoch = 84 + 28 / 60 + 42 / 3600;
  var meanAnom = normDeg(anomEpoch + anomDailyRate * days);

  // Equation from table (15:6)
  var eq = moonEquation(meanAnom);

  // True position: if anomaly 0-180 add, if 180-360 subtract
  var trueMoon;
  if (meanAnom <= 180) {
    trueMoon = normDeg(meanMoon + eq);
  } else {
    trueMoon = normDeg(meanMoon - eq);
  }

  var el = document.getElementById('moonResult');
  el.innerHTML =
    '<div class="result-box">' + zodiacFromLong(trueMoon) + ' \u2014 ' + dmsFormat(trueMoon) + '</div>' +
    '<div class="calc-tool">' +
      '<div class="calc-row"><span class="l">\u05D0\u05DE\u05E6\u05E2 \u05D4\u05D9\u05E8\u05D7</span><span class="v">' + dmsFormat(meanMoon) + '</span></div>' +
      '<div class="calc-row"><span class="l">\u05D0\u05DE\u05E6\u05E2 \u05D4\u05DE\u05E1\u05DC\u05D5\u05DC</span><span class="v">' + dmsFormat(meanAnom) + '</span></div>' +
      '<div class="calc-row"><span class="l">\u05DE\u05E0\u05EA \u05D4\u05D9\u05E8\u05D7</span><span class="v">' + eq.toFixed(2) + '\u00B0 (' + dmsFormat(eq) + ')</span></div>' +
      '<div class="calc-row"><span class="l">\u05DB\u05D9\u05D5\u05D5\u05DF (0\u00B0\u2013180\u00B0 / 180\u00B0\u2013360\u00B0)</span><span class="v">' + (meanAnom <= 180 ? '\u05D7\u05D9\u05D1\u05D5\u05E8 (+)' : '\u05D7\u05D9\u05E1\u05D5\u05E8 (-)') + '</span></div>' +
      '<div class="calc-row"><span class="l">\u05DE\u05E7\u05D5\u05DD \u05D0\u05DE\u05D9\u05EA\u05D9</span><span class="v" style="font-size:1.1rem;color:var(--gold)">' + dmsFormat(trueMoon) + '</span></div>' +
    '</div>';
}

// ========================
// runLatitudeCalc() — Chapter 16
// ========================

function runLatitudeCalc() {
  var days = +document.getElementById('latD').value || 0;

  // First compute true moon position (reuse moon calc logic)
  var moonDailyRate = 13 + 10 / 60 + 35 / 3600;
  var moonEpoch = 1 + 14 / 60 + 43 / 3600;
  var meanMoon = normDeg(moonEpoch + moonDailyRate * days);

  var anomDailyRate = 13 + 3 / 60 + 54 / 3600;
  var anomEpoch = 84 + 28 / 60 + 42 / 3600;
  var meanAnom = normDeg(anomEpoch + anomDailyRate * days);
  var eq = moonEquation(meanAnom);
  var trueMoon = meanAnom <= 180 ? normDeg(meanMoon + eq) : normDeg(meanMoon - eq);

  // Head of dragon (rosh) — 16:2
  // Daily rate: subtract 0deg 3' 11" per day (retrograde)
  var headDailyRate = 3 / 60 + 11 / 3600; // positive value, subtract
  // Epoch: 180deg 57' 28"
  var headEpoch = 180 + 57 / 60 + 28 / 3600;
  var headPos = normDeg(headEpoch - headDailyRate * days);

  // Latitude argument = true moon - head
  var latArg = normDeg(trueMoon - headPos);

  // Look up latitude
  var result = moonLatitude(latArg);

  var dirHe = result.north ? '\u05E6\u05E4\u05D5\u05DF' : '\u05D3\u05E8\u05D5\u05DD';
  var dirColor = result.north ? 'var(--sky)' : 'var(--sun)';

  var el = document.getElementById('latResult');
  el.innerHTML =
    '<div class="result-box" style="color:' + dirColor + '">' + dmsFormat(result.lat) + ' ' + dirHe + '</div>' +
    '<div class="calc-tool">' +
      '<div class="calc-row"><span class="l">\u05DE\u05E7\u05D5\u05DD \u05D9\u05E8\u05D7 \u05D0\u05DE\u05D9\u05EA\u05D9</span><span class="v">' + dmsFormat(trueMoon) + '</span></div>' +
      '<div class="calc-row"><span class="l">\u05DE\u05E7\u05D5\u05DD \u05E8\u05D0\u05E9 (\u05D2\u05D5\u05DC\u05D2\u05D5\u05DC\u05EA)</span><span class="v">' + dmsFormat(headPos) + '</span></div>' +
      '<div class="calc-row"><span class="l">\u05D0\u05E8\u05D2\u05D5\u05DE\u05E0\u05D8 \u05E8\u05D5\u05D7\u05D1</span><span class="v">' + dmsFormat(latArg) + '</span></div>' +
      '<div class="calc-row"><span class="l">\u05E8\u05D5\u05D7\u05D1 \u05D4\u05D9\u05E8\u05D7</span><span class="v" style="font-size:1.1rem;color:' + dirColor + '">' + dmsFormat(result.lat) + ' ' + dirHe + '</span></div>' +
    '</div>';
}
