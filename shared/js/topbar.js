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

  if(document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
