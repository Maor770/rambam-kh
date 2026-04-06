/* app.js — Main application logic (modes, rendering, UI state) */

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
}

let layerStep = [0,0,0,0]; // current step per layer

function renderOverview(el) {
  let html = '<div style="text-align:center;padding:10px 0 6px"><span style="font-size:.85rem;color:var(--sky)">משנה תורה לרמב"ם · 19 פרקים · 235 הלכות</span></div>';
  LAYER_INFO.forEach((layer, i) => {
    const isOpen = document.getElementById(`layer-${i}`)?.classList.contains('open');
    html += `<div class="layer-section${isOpen?' open':''}" id="layer-${i}">
      <div class="layer-header" onclick="toggleLayer(${i})">
        <div class="layer-num">${i+1}</div>
        <div class="layer-title"><h3>${layer.title}</h3><p>פרקים ${HEB_CH[layer.chs[0]]}-${HEB_CH[layer.chs[layer.chs.length-1]]} · ${layer.desc}</p></div>
        <span class="hal-arrow">◀</span>
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
  html += `<div style="display:flex;justify-content:space-between;margin-top:8px">
    <button class="nb" ${cur===0?'disabled':''} onclick="layerStep[${li}]--;renderAll()">→ הקודם</button>
    <button class="nb pr" onclick="${cur<steps.length-1?`layerStep[${li}]++;renderAll()`:`toggleLayer(${li});${li<3?`document.getElementById('layer-${li+1}').classList.add('open');document.getElementById('layer-${li+1}').scrollIntoView({behavior:'smooth'})`:''}`}">${cur<steps.length-1?'הבא ←':li<3?'לחלק '+(li+2)+' ←':'סיום ✓'}</button>
  </div>`;
  return html;
}

// ========================
// STUDY MODE
// ========================
function renderStudy(el) {
  const chData = DATA.find(c => c.ch === currentCh);
  if (!chData) return;
  let html = `<div class="ch-divider"><h2>פרק ${HEB_CH[currentCh]} — ${CH_TITLES[currentCh] || ''}</h2>
    <div class="ch-count">${chData.halachot.length} הלכות</div></div>`;
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
  if(dailyChapters){
    html += '<div style="text-align:center;padding:8px 0 4px"><span style="font-size:.85rem;color:var(--gold);font-weight:600">📖 השיעור היומי</span></div>';
  }
  chapters.forEach(chData => {
    html += `<div class="ch-divider" id="ch-${chData.ch}"><h2>פרק ${HEB_CH[chData.ch]} — ${CH_TITLES[chData.ch] || ''}</h2>
      <div class="ch-count">${chData.halachot.length} הלכות</div></div>`;
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
  const vizBadge = h.viz ? '<span style="font-size:.65rem;color:var(--purple);margin-right:4px">📊</span>' : '';
  return `<div class="hal-card${openCls}" id="hal-${id}">
    <div class="hal-header" onclick="toggleHal('${id}')">
      <div class="hal-num">${h.n}</div>
      <div class="hal-preview">${vizBadge}${preview}</div>
      <span class="hal-arrow">◀</span>
    </div>
    <div class="hal-body">
      ${h.bio ? `<div style="font-size:.9rem;line-height:1.75;color:var(--txt);padding:10px 14px;background:var(--gold-bg);border-right:3px solid var(--gold);border-radius:0 10px 10px 0;margin-bottom:10px">${h.bio}</div>` : ''}
      ${h.he ? `<div class="txt-rambam">${fmtRef(h.he)}</div>` : ''}
      ${h.st && h.st.length ? `<div class="txt-steinsaltz"><div class="st-label">ביאור שטיינזלץ</div>${h.st.map(s => `<div class="st-item">${fmtSt(s)}</div>`).join('')}</div>` : ''}
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
      .catch(() => { renderAll(); });
  } else {
    renderAll();
  }
};
