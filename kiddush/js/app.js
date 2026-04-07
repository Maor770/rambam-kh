/* app.js — Main application logic (modes, rendering, UI state) */

const PAGE_LANG = document.documentElement.lang || 'he';
const IS_EN = PAGE_LANG === 'en';
const LANG_MODE = IS_EN ? ((window.RambamSettings && RambamSettings.get('language')) || 'en') : 'he';
const IS_BILINGUAL = LANG_MODE === 'he+en';

let currentMode = 'overview';
let currentCh = 1;
let dailyChapters = null; // e.g. [6,7,8] when in KH

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-tab').forEach((t,i) => {
    const modes = ['overview','study','continuous'];
    t.classList.toggle('active', modes[i] === mode);
  });
  document.getElementById('chScroll').style.display = mode === 'overview' ? 'none' : 'flex';
  renderAll();
}

function buildChScroll() {
  const el = document.getElementById('chScroll');
  el.innerHTML = '';
  for (let i = 1; i <= 19; i++) {
    const b = document.createElement('button');
    b.className = 'ch-btn' + (i === currentCh ? ' active' : '');
    b.textContent = `${HEB_CH[i]} ${CH_TITLES[i] || ''}`;
    b.onclick = () => { currentCh = i; renderAll(); scrollToChapter(i); };
    el.appendChild(b);
  }
}

function scrollToChapter(ch) {
  const el = document.getElementById(`ch-${ch}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderAll() {
  buildChScroll();
  const main = document.getElementById('mainContent');
  if (currentMode === 'overview') renderOverview(main);
  else if (currentMode === 'study') renderStudy(main);
  else renderContinuous(main);
  // Re-attach position tracking after render
  setTimeout(setupRambamPositionTracking, 100);
}

let layerStep = [0,0,0,0]; // current step per layer

function renderOverview(el) {
  const subtitle = IS_EN ? 'Mishneh Torah by Rambam \u00b7 19 Chapters \u00b7 235 Halachot' : 'משנה תורה לרמב"ם · 19 פרקים · 235 הלכות';
  const chLabel = IS_EN ? 'Chapters' : 'פרקים';
  let html = `<div style="text-align:center;padding:10px 0 6px"><span style="font-size:.85rem;color:var(--sky)">${subtitle}</span></div>`;
  LAYER_INFO.forEach((layer, i) => {
    const isOpen = document.getElementById(`layer-${i}`)?.classList.contains('open');
    html += `<div class="layer-section${isOpen?' open':''}" id="layer-${i}">
      <div class="layer-header" onclick="toggleLayer(${i})">
        <div class="layer-num">${i+1}</div>
        <div class="layer-title"><h3>${layer.title}</h3><p>${chLabel} ${HEB_CH[layer.chs[0]]}-${HEB_CH[layer.chs[layer.chs.length-1]]} · ${layer.desc}</p></div>
        <span class="hal-arrow">${IS_EN ? '▶' : '◀'}</span>
      </div>
      <div class="layer-body">${renderLayerSteps(i)}</div>
    </div>`;
  });
  el.innerHTML = html;
}

function toggleLayer(i) {
  document.getElementById(`layer-${i}`).classList.toggle('open');
}

function renderLayerSteps(li) {
  const steps = LAYER_STEPS[li];
  const cur = layerStep[li];
  // Step dots
  let html = '<div class="step-nav">';
  steps.forEach((s,si) => {
    html += `<button class="sd${si===cur?' a':''}${si<cur?' d':''}" onclick="layerStep[${li}]=${si};renderAll()">${si+1}</button>`;
  });
  html += '</div>';
  // Current step content
  const s = steps[cur];
  html += `<div class="hal-card open" style="animation:fu .25s ease">
    <div style="padding:14px 16px">
      <h2 style="font-size:1.15rem;color:var(--gold);margin-bottom:2px">${s.t}</h2>
      <div style="font-size:.8rem;color:var(--sky);margin-bottom:10px">${s.r}</div>
      ${s.src ? `<div class="txt-rambam">${s.src}</div>` : ''}
      <div class="explain" style="font-size:var(--hal-size,1.1rem);line-height:1.85">${s.body}</div>
      ${s.viz ? renderViz(s.viz) : ''}
    </div>
  </div>`;
  // Nav buttons
  const prevLabel = IS_EN ? '\u2190 Previous' : '\u2192 הקודם';
  const nextLabel = IS_EN ? 'Next \u2192' : 'הבא \u2190';
  const finishLabel = IS_EN ? 'Finish \u2713' : 'סיום \u2713';
  const toPartLabel = IS_EN ? ('To Part ' + (li+2) + ' \u2192') : ('לחלק ' + (li+2) + ' \u2190');
  const fwdLabel = cur < steps.length-1 ? nextLabel : li < 3 ? toPartLabel : finishLabel;
  html += `<div style="display:flex;justify-content:space-between;margin-top:8px">
    <button class="nb" ${cur===0?'disabled':''} onclick="layerStep[${li}]--;renderAll()">${prevLabel}</button>
    <button class="nb pr" onclick="${cur<steps.length-1?`layerStep[${li}]++;renderAll()`:`toggleLayer(${li});${li<3?`document.getElementById('layer-${li+1}').classList.add('open');document.getElementById('layer-${li+1}').scrollIntoView({behavior:'smooth'})`:''}`}">${fwdLabel}</button>
  </div>`;
  return html;
}

// ========================
// STUDY MODE
// ========================
function renderStudy(el) {
  const chData = DATA.find(c => c.ch === currentCh);
  if (!chData) return;
  const chPrefix = IS_EN ? 'Chapter' : 'פרק';
  const halLabel = IS_EN ? 'halachot' : 'הלכות';
  let html = `<div class="ch-divider"><h2>${chPrefix} ${HEB_CH[currentCh]} — ${CH_TITLES[currentCh] || ''}</h2>
    <div class="ch-count">${chData.halachot.length} ${halLabel}</div></div>`;
  chData.halachot.forEach(h => {
    const title = HAL_TITLES[`${currentCh}:${h.n}`] || '';
    html += renderHalCard(currentCh, h, title, false);
  });
  el.innerHTML = html;
}

// ========================
// CONTINUOUS MODE
// ========================
function renderContinuous(el) {
  const chapters = dailyChapters
    ? DATA.filter(c => dailyChapters.indexOf(c.ch) !== -1)
    : DATA;
  let html = '<div class="continuous">';
  const dailyLabel = IS_EN ? '📖 Daily Study' : '📖 השיעור היומי';
  const chPrefix = IS_EN ? 'Chapter' : 'פרק';
  const halLabel = IS_EN ? 'halachot' : 'הלכות';
  if(dailyChapters){
    html += `<div style="text-align:center;padding:8px 0 4px"><span style="font-size:.85rem;color:var(--gold);font-weight:600">${dailyLabel}</span></div>`;
  }
  chapters.forEach(chData => {
    html += `<div class="ch-divider" id="ch-${chData.ch}"><h2>${chPrefix} ${HEB_CH[chData.ch]} — ${CH_TITLES[chData.ch] || ''}</h2>
      <div class="ch-count">${chData.halachot.length} ${halLabel}</div></div>`;
    chData.halachot.forEach(h => {
      const title = HAL_TITLES[`${chData.ch}:${h.n}`] || '';
      html += renderHalCard(chData.ch, h, title, true);
    });
  });
  html += '</div>';
  el.innerHTML = html;
  setupScrollSpy();
}

// FONT SIZE
let halFontSize = 1.1; // rem
function changeFontSize(delta) {
  halFontSize = Math.max(0.8, Math.min(1.6, halFontSize + delta * 0.1));
  document.documentElement.style.setProperty('--hal-size', halFontSize + 'rem');
}

// ========================
// HALACHA CARD
// ========================
function renderHalCard(ch, h, preview, isOpen) {
  const id = `${ch}-${h.n}`;
  const openCls = isOpen ? ' open' : '';
  const vizBadge = h.viz ? '<span style="font-size:.65rem;color:var(--purple);margin-' + (IS_EN ? 'right' : 'right') + ':4px">📊</span>' : '';
  const arrowChar = IS_EN ? '▶' : '◀';

  // Bio/explanation block
  let bioHtml = '';
  if (IS_EN) {
    const bio = h.bio_en || h.bio || '';
    if (bio) bioHtml = `<div class="bio-block">${bio}</div>`;
  } else {
    if (h.bio) bioHtml = `<div class="bio-block">${h.bio}</div>`;
  }

  // Rambam source text
  let srcHtml = '';
  if (IS_EN && IS_BILINGUAL) {
    // he+en mode: Hebrew source + English translation
    if (h.he) srcHtml += `<div class="txt-rambam" dir="rtl" style="text-align:right">${fmtRef(h.he)}</div>`;
    if (h.en) srcHtml += `<div class="txt-english">${h.en}</div>`;
  } else if (IS_EN) {
    // English only: show English Rambam text
    if (h.en) srcHtml = `<div class="txt-english">${h.en}</div>`;
  } else {
    // Hebrew: show Hebrew source
    if (h.he) srcHtml = `<div class="txt-rambam">${fmtRef(h.he)}</div>`;
  }

  // Steinsaltz commentary (always Hebrew)
  let stHtml = '';
  if (h.st && h.st.length) {
    const stLabel = IS_EN ? 'Steinsaltz Commentary (Hebrew)' : 'ביאור שטיינזלץ';
    stHtml = `<div class="txt-steinsaltz"><div class="st-label">${stLabel}</div>${h.st.map(s => `<div class="st-item" ${IS_EN ? 'dir="rtl" style="text-align:right"' : ''}>${fmtSt(s)}</div>`).join('')}</div>`;
  }

  return `<div class="hal-card${openCls}" id="hal-${id}">
    <div class="hal-header" onclick="toggleHal('${id}')">
      <div class="hal-num">${h.n}</div>
      <div class="hal-preview">${vizBadge}${preview}</div>
      <span class="hal-arrow">${arrowChar}</span>
    </div>
    <div class="hal-body">
      ${bioHtml}
      ${srcHtml}
      ${stHtml}
      ${h.viz ? renderViz(h.viz, ch, h.n) : ''}
    </div>
  </div>`;
}

function toggleHal(id) {
  const card = document.getElementById('hal-' + id);
  if (card) card.classList.toggle('open');
}
function openHal(id) {
  const card = document.getElementById('hal-' + id);
  if (card) { card.classList.add('open'); card.scrollIntoView({behavior:'smooth',block:'start'}); }
}

// ========================
// SCROLL SPY (continuous)
// ========================
function setupScrollSpy() {
  const prog = document.getElementById('floatProg');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const dividers = document.querySelectorAll('.ch-divider');
      let current = '';
      dividers.forEach(d => {
        if (d.getBoundingClientRect().top < 120) current = d.querySelector('h2')?.textContent || '';
      });
      if (current && currentMode === 'continuous') {
        prog.textContent = current;
        prog.style.opacity = '1';
      } else {
        prog.style.opacity = '0';
      }
      ticking = false;
    });
  });
}

// ========================
// RAMBAM POSITION TRACKING
// ========================
let _rambamPosTimer = null;
let _rambamScrollBound = false;

function setupRambamPositionTracking() {
  if (_rambamScrollBound) return;
  _rambamScrollBound = true;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cards = document.querySelectorAll('.hal-card');
      let best = null;
      cards.forEach(c => {
        const rect = c.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) best = c;
      });
      if (best) {
        const m = best.id.match(/^hal-(\d+)-(\d+)$/);
        if (m) {
          const ch = parseInt(m[1], 10), hal = parseInt(m[2], 10);
          if (_rambamPosTimer) clearTimeout(_rambamPosTimer);
          _rambamPosTimer = setTimeout(() => {
            if (window.RambamSettings) {
              RambamSettings.set('rambamPosition', { ch, hal, ts: Date.now() });
            }
          }, 1500);
        }
      }
      ticking = false;
    });
  }, { passive: true });
}

function restoreRambamPosition() {
  if (!window.RambamSettings) return;
  // Check URL params first (?ch=6&hal=4)
  const params = new URLSearchParams(location.search);
  const paramCh = params.get('ch');
  const paramHal = params.get('hal');
  if (paramCh) {
    const ch = parseInt(paramCh, 10);
    const hal = paramHal ? parseInt(paramHal, 10) : null;
    if (ch >= 1 && ch <= 19) {
      currentCh = ch;
      if (currentMode === 'overview') setMode('study');
      else renderAll();
      if (hal) {
        setTimeout(() => {
          const el = document.getElementById('hal-' + ch + '-' + hal);
          if (el) { el.classList.add('open'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }, 300);
      }
      return true;
    }
  }
  // Fall back to saved position (only if no daily chapters override and no date param)
  if (dailyChapters || params.get('date')) return false;
  const pos = RambamSettings.get('rambamPosition');
  if (!pos || !pos.ch) return false;
  currentCh = pos.ch;
  if (currentMode === 'overview') setMode('study');
  else renderAll();
  if (pos.hal) {
    setTimeout(() => {
      const el = document.getElementById('hal-' + pos.ch + '-' + pos.hal);
      if (el) { el.classList.add('open'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }, 300);
  }
  return true;
}

// ========================
// INITIALIZATION — called when data is ready
// ========================
window.onDataReady = function() {
  // Apply saved settings
  if (window.RambamSettings) {
    const savedSize = RambamSettings.get('fontSize');
    if (savedSize) { halFontSize = savedSize; changeFontSize(0); }
    RambamSettings.applyTheme();
  }
  // Track page view
  if (window.RambamAnalytics) {
    RambamAnalytics.trackPageView('kiddush');
  }
  buildChScroll();

  // Fetch daily Rambam and auto-open if in KH
  // Support ?date=YYYY-M-D from homepage date navigation
  const lang = (window.RambamSettings && RambamSettings.get('language')) || 'he';
  const tz = window.HebrewDate ? HebrewDate.detectTZ(lang) : 'Asia/Jerusalem';
  let d = window.HebrewDate ? HebrewDate.today(tz) : null;
  const dateParam = new URLSearchParams(location.search).get('date');
  if(dateParam && window.HebrewDate){
    const parts = dateParam.split('-').map(Number);
    if(parts.length === 3 && parts[0] > 0) d = HebrewDate.forDate(parts[0], parts[1], parts[2]);
  }
  if(d){
    fetch('https://www.sefaria.org/api/calendars?year='+d.gYear+'&month='+d.gMonth+'&day='+d.gDay+'&timezone='+encodeURIComponent(tz))
      .then(r => r.json())
      .then(data => {
        const items = data.calendar_items || [];
        let rambam3 = items.find(it => it.title && it.title.en === 'Daily Rambam (3 Chapters)');
        if(!rambam3) return;
        // Parse chapter range from ref like "Mishneh Torah, Sanctification of the New Month 6-8"
        const ref = rambam3.ref || '';
        const isKH = /Sanctification of the New Month/i.test(ref);
        if(!isKH){ renderAll(); return; }
        const match = ref.match(/(\d+)(?:-(\d+))?$/);
        if(!match){ renderAll(); return; }
        const from = parseInt(match[1],10);
        const to = match[2] ? parseInt(match[2],10) : from;
        const chs = [];
        for(let i = from; i <= to; i++) chs.push(i);
        dailyChapters = chs;
        currentCh = chs[0];
        setMode('continuous');
      })
      .catch(() => { if (!restoreRambamPosition()) renderAll(); });
  } else {
    if (!restoreRambamPosition()) renderAll();
  }
};
