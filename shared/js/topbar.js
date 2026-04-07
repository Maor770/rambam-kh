/**
 * topbar.js — Injects a sticky topbar with home icon, page title, and font/language buttons.
 * Include this script in any inner page. It auto-detects the page context.
 *
 * Usage: <script src="../shared/js/topbar.js"></script>  (or adjust path)
 */
(function(){
  function init(){
  // Detect context from URL
  var path = location.pathname;
  var title = '';
  var homeHref = '../';

  if(/sotah/.test(path)){
    title = 'מסכת סוטה';
  } else if(/tanya/.test(path)){
    title = 'תניא יומי';
  } else if(/kiddush/.test(path)){
    title = 'הלכות קידוש החודש';
  } else if(/admin/.test(path)){
    title = 'הגדרות';
  } else {
    title = 'בית המדרש';
    homeHref = './';
  }

  // Inject styles
  var style = document.createElement('style');
  style.textContent =
    'body{overflow-x:hidden}' +
    '._tb{position:sticky;top:0;z-index:9999;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid #e0e0e0;padding:6px 12px;font-family:inherit}' +
    '._tb-row{display:flex;align-items:center;justify-content:space-between;max-width:860px;margin:0 auto}' +
    '._tb-title{font-size:1rem;font-weight:700;color:#b8941f}' +
    '._tb-home{text-decoration:none;font-size:1.2rem;min-width:36px;min-height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px;color:#888}' +
    '._tb-btn{min-width:36px;height:36px;border-radius:8px;border:1px solid #ddd;background:none;color:#888;font-family:inherit;font-size:.9rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0 4px}' +
    '._tb-btn:active{border-color:#b8941f;color:#b8941f}' +
    '._tb-lang{background:none;border:1px solid #ddd;color:#888;padding:6px 14px;border-radius:8px;font-family:inherit;font-size:.78rem;cursor:pointer;white-space:nowrap}' +
    '@media(max-width:400px){._tb-title{font-size:.85rem}._tb-btn{min-width:32px;height:32px;font-size:.8rem}}';
  document.head.appendChild(style);

  // Build topbar HTML
  var bar = document.createElement('div');
  bar.className = '_tb';
  bar.innerHTML =
    '<div class="_tb-row">' +
      '<div style="display:flex;align-items:center;gap:8px">' +
        '<a href="' + homeHref + '" class="_tb-home" aria-label="דף הבית">🏠</a>' +
        '<span class="_tb-title">' + title + '</span>' +
      '</div>' +
      '<div style="display:flex;gap:4px;align-items:center">' +
        '<button class="_tb-btn" onclick="_tbFontSize(-1)">א\u200E-</button>' +
        '<button class="_tb-btn" onclick="_tbFontSize(1)">א+</button>' +
      '</div>' +
    '</div>';

  // Insert at top of body
  document.body.insertBefore(bar, document.body.firstChild);

  // Font size function
  window._tbFontSize = function(delta){
    var el = document.body;
    var current = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = (current + delta) + 'px';
  };
  }

  // --- Sotah position tracking ---
  // Uses localStorage directly (settings.js may not be loaded on daf pages)
  var POS_KEY = 'rambam_sotahPosition';
  var VISITED_KEY = 'rambam_sotahVisited';

  function initSotahTracking(){
    var match = location.pathname.match(/sotah_daf_(\d+)/);
    if(!match) return;
    var dafNum = parseInt(match[1], 10);

    // Track visited daf
    try {
      var visited = JSON.parse(localStorage.getItem(VISITED_KEY) || '[]');
      if(visited.indexOf(dafNum) === -1){ visited.push(dafNum); localStorage.setItem(VISITED_KEY, JSON.stringify(visited)); }
    } catch(e){}

    // Scroll-based tracking of last visible section
    var saveTimer = null;
    function savePosition(secIdx){
      if(saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function(){
        try {
          localStorage.setItem(POS_KEY, JSON.stringify({ daf: dafNum, sec: secIdx, ts: Date.now() }));
        } catch(e){}
      }, 1500);
    }

    function setupScrollTracker(){
      var sections = document.querySelectorAll('[id^="sec"]');
      if(!sections.length) return;
      var ticking = false;
      window.addEventListener('scroll', function(){
        if(ticking) return;
        ticking = true;
        requestAnimationFrame(function(){
          var best = -1;
          for(var i = 0; i < sections.length; i++){
            var rect = sections[i].getBoundingClientRect();
            if(rect.top < window.innerHeight * 0.5) best = i;
          }
          if(best >= 0){
            var idx = parseInt(sections[best].id.replace('sec',''), 10);
            if(!isNaN(idx)) savePosition(idx);
          }
          ticking = false;
        });
      }, { passive: true });
    }

    // Restore position on load
    function restorePosition(){
      var pos;
      try { pos = JSON.parse(localStorage.getItem(POS_KEY)); } catch(e){ return; }
      if(!pos || pos.daf !== dafNum) return;
      var target = document.getElementById('sec' + pos.sec);
      if(!target) return;
      // Open the section if it's collapsed
      var content = document.getElementById('content' + pos.sec);
      if(content && content.style.display === 'none' && typeof window.toggle === 'function'){
        window.toggle(pos.sec);
      }
      setTimeout(function(){
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }

    // Run after DOM is fully loaded
    if(document.readyState === 'complete'){
      restorePosition();
      setupScrollTracker();
    } else {
      window.addEventListener('load', function(){
        restorePosition();
        setupScrollTracker();
      });
    }
  }

  if(document.body) init();
  else document.addEventListener('DOMContentLoaded', init);

  // Start Sotah tracking after settings.js is available
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initSotahTracking);
  } else {
    initSotahTracking();
  }
})();
