/* data-loader.js — fetch JSON data and map to short-key format */
(async function loadData(){
  const isEn = document.documentElement.lang === 'en';
  try {
    const v = '?v=2';
    const fetches = [
      fetch('data/rambam_data.json' + v).then(r => r.json()),
      fetch('data/viz_map.json' + v).then(r => r.json()),
      fetch('data/explanations.json' + v).then(r => r.json()).catch(() => ({})),
      fetch('data/sections_map.json' + v).then(r => r.json()).catch(() => ({}))
    ];
    // Load English explanations when on English page
    if (isEn) {
      fetches.push(
        Promise.all([
          fetch('data/explanations_en.json' + v).then(r => r.json()).catch(() => ({})),
          fetch('data/explanations_en_11_15.json' + v).then(r => r.json()).catch(() => ({})),
          fetch('data/explanations_en_16_19.json' + v).then(r => r.json()).catch(() => ({}))
        ]).then(parts => Object.assign({}, ...parts))
      );
    }
    const results = await Promise.all(fetches);
    const [rawData, vizMap, explanations, sectionsMap] = results;
    const explanationsEn = isEn ? (results[4] || {}) : {};

    window.DATA = rawData.map(ch => ({
      ch: ch.chapter,
      halachot: ch.halachot.map(h => {
        const key = ch.chapter + ':' + h.halacha_num;
        return {
          n: h.halacha_num,
          he: h.hebrew,
          en: h.english,
          st: h.steinsaltz,
          viz: vizMap[key] || null,
          bio: explanations[key] || null,
          bio_en: explanationsEn[key] || null,
          sections: sectionsMap[key] ? sectionsMap[key].sections : null
        };
      })
    }));
    if(window.onDataReady) window.onDataReady();
  } catch(e) {
    console.error('Failed to load data:', e);
    const errTitle = isEn ? 'Error loading data' : '\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD';
    const errHint = isEn ? 'Try running a local server: python3 -m http.server' : '\u05E0\u05E1\u05D4 \u05DC\u05D4\u05E4\u05E2\u05D9\u05DC \u05E9\u05E8\u05EA \u05DE\u05E7\u05D5\u05DE\u05D9: python3 -m http.server';
    document.getElementById('mainContent').innerHTML =
      '<div style="text-align:center;padding:40px;color:var(--red);">' +
      '<p style="font-size:1.2rem;">' + errTitle + '</p>' +
      '<p style="font-size:.85rem;color:var(--txt2);margin-top:8px;">' + errHint + '</p></div>';
  }
})();
