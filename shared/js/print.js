/* Print helper — auto-sizes fonts to fill pages optimally */
function doPrint() {
  // 1. Populate header/footer with title
  var h = document.querySelector('.ph-title');
  var f = document.querySelector('.pf-info');
  var t = document.querySelector('h1');
  if (h && t) h.textContent = t.textContent;
  if (f && t) f.textContent = t.textContent;

  // 2. Open all collapsed sections
  var secs = document.querySelectorAll('[id^="content"]');
  secs.forEach(function(el) { el.style.display = 'block'; });

  // 3. Auto-size fonts to fill pages
  autoSizeFonts();

  // 4. Print after brief delay for reflow
  setTimeout(function() { window.print(); }, 400);
}

function autoSizeFonts() {
  // A4 usable height: 297mm - 6mm top - 10mm bottom = 281mm ≈ 1062px at 96dpi
  // But with footer (fixed, ~25px) we lose that from each page
  var PAGE_H = 1062 - 30; // approximate usable height per page in px

  var mainDiv = document.querySelector('div[style*="max-width:640px"]');
  if (!mainDiv) return;

  // Elements we scale: source text and biur text
  var srcBlocks = document.querySelectorAll('[id^="content"] div[style*="border-right:4px"] div');
  var biurBlocks = document.querySelectorAll('[id^="content"] div[style*="padding:9px"]');
  var secBtns = document.querySelectorAll('[id^="sec"] > button span');

  // Starting sizes (matching print.css defaults)
  var srcBase = 10.5;   // source text px
  var biurBase = 9;     // biur text px
  var btnBase = 9;      // section header px
  var srcLH = 1.55;
  var biurLH = 1.4;

  // Apply a scale factor and measure
  function applyScale(scale) {
    var srcSize = srcBase * scale;
    var biurSize = biurBase * scale;
    var btnSize = btnBase * scale;

    srcBlocks.forEach(function(el) {
      el.style.fontSize = srcSize + 'px';
      el.style.lineHeight = String(srcLH);
    });
    biurBlocks.forEach(function(el) {
      el.style.fontSize = biurSize + 'px';
      el.style.lineHeight = String(biurLH);
    });
    secBtns.forEach(function(el) {
      el.style.fontSize = btnSize + 'px';
    });
  }

  function getContentHeight() {
    return mainDiv.scrollHeight;
  }

  // Binary search for optimal scale
  var lo = 0.7, hi = 1.8, best = 1.0;

  // First, find how many pages at scale=1.0
  applyScale(1.0);
  var baseHeight = getContentHeight();
  var basePages = Math.ceil(baseHeight / PAGE_H);

  // Target: fill exactly basePages pages
  var targetMax = basePages * PAGE_H;

  for (var i = 0; i < 15; i++) {
    var mid = (lo + hi) / 2;
    applyScale(mid);
    var h = getContentHeight();
    if (h <= targetMax) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  // Apply the best scale found
  applyScale(best);
}
