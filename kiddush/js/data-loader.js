/* data-loader.js — fetch JSON data and map to short-key format */
(async function loadData(){
  try {
    const [rawData, vizMap] = await Promise.all([
      fetch('data/rambam_data.json').then(r => r.json()),
      fetch('data/viz_map.json').then(r => r.json())
    ]);
    window.DATA = rawData.map(ch => ({
      ch: ch.chapter,
      halachot: ch.halachot.map(h => ({
        n: h.halacha_num,
        he: h.hebrew,
        en: h.english,
        st: h.steinsaltz,
        viz: vizMap[ch.chapter + ':' + h.halacha_num] || null
      }))
    }));
    if(window.onDataReady) window.onDataReady();
  } catch(e) {
    console.error('Failed to load data:', e);
    document.getElementById('mainContent').innerHTML =
      '<div style="text-align:center;padding:40px;color:var(--red);">' +
      '<p style="font-size:1.2rem;">\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD</p>' +
      '<p style="font-size:.85rem;color:var(--txt2);margin-top:8px;">\u05E0\u05E1\u05D4 \u05DC\u05D4\u05E4\u05E2\u05D9\u05DC \u05E9\u05E8\u05EA \u05DE\u05E7\u05D5\u05DE\u05D9: python3 -m http.server</p></div>';
  }
})();
