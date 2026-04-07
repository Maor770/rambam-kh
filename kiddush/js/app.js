/* app.js — Main application logic (modes, rendering, UI state) */

const PAGE_LANG = document.documentElement.lang || 'he';
const IS_EN = PAGE_LANG === 'en';
const LANG_MODE = IS_EN ? ((window.RambamSettings && RambamSettings.get('language')) || 'en') : 'he';
const IS_BILINGUAL = LANG_MODE === 'he+en';

let currentMode = 'overview';
let currentCh = 1;
let dailyChapters = null; // e.g. [6,7,8] when in KH

/* Map halachot to observatory concepts for mini-preview links */
const OBS_HAL_MAP = {
  '1:1':'moonMonth','1:3':'crescent','1:7':'sanctification',
  '2:1':'witnesses','4:1':'leapYear',
  '6:2':'chelek','6:3':'monthLength','6:8':'moladTishrei','6:10':'metonicCycle',
  '7:1':'dechiyot','8:5':'fullMonth',
  '11:6':'degree','11:7':'zodiac','11:13':'epicycle',
  '12:1':'meanSun','13:4':'sunEquation','13:8':'interpolation','13:9':'trueSun',
  '14:1':'meanMoon','15:1':'elongation','15:3':'trueMoon','15:6':'moonEquation',
  '16:1':'ascendingNode','16:7':'moonLatitude','16:12':'moonLatitude',
  '17:1':'parallax','17:15':'arcOfVision',
  '19:2':'eclipticTilt','19:12':'crescentHorns'
};

function setMode(mode) {
  if (mode === 'study') mode = 'continuous'; // legacy fallback
  currentMode = mode;
  // Update tab active states: overview tab, halTab, observatory link
  const overviewTab = document.querySelector('.mode-tabs > .mode-tab');
  const halTab = document.getElementById('halTab');
  if (overviewTab) overviewTab.classList.toggle('active', mode === 'overview');
  if (halTab) halTab.classList.toggle('active', mode === 'continuous');
  const chScroll = document.getElementById('chScroll');
  if (chScroll) chScroll.style.display = 'none'; // deprecated, hidden always
  // Close dropdown when switching modes
  const dd = document.getElementById('chDropdown');
  if (dd) dd.classList.remove('open');
  renderAll();
}

function buildChScroll() {
  // Legacy ch-scroll — keep hidden
  const el = document.getElementById('chScroll');
  if (el) el.innerHTML = '';
  // Build dropdown menu
  buildChDropdown();
}

function buildChDropdown() {
  const dd = document.getElementById('chDropdown');
  if (!dd) return;
  dd.innerHTML = '';
  for (let i = 1; i <= 19; i++) {
    const b = document.createElement('button');
    b.className = 'ch-dropdown-item' + (currentMode === 'continuous' && currentCh === i ? ' active' : '');
    b.innerHTML = `<span class="ch-drop-num">פרק ${HEB_CH[i]}</span> ${CH_TITLES[i] || ''}`;
    b.onclick = () => {
      currentCh = i;
      if (dailyChapters) dailyChapters = null;
      dd.classList.remove('open');
      if (currentMode !== 'continuous') setMode('continuous');
      else { renderAll(); scrollToChapter(i); }
    };
    dd.appendChild(b);
  }
}

function toggleChDropdown() {
  const dd = document.getElementById('chDropdown');
  if (!dd) return;
  const isOpen = dd.classList.toggle('open');
  if (isOpen) buildChDropdown(); // refresh active state
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const wrap = document.querySelector('.ch-dropdown-wrap');
  const dd = document.getElementById('chDropdown');
  if (dd && wrap && !wrap.contains(e.target)) dd.classList.remove('open');
});

function scrollToChapter(ch) {
  const el = document.getElementById(`ch-${ch}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderAll() {
  buildChScroll();
  const main = document.getElementById('mainContent');
  if (currentMode === 'overview') renderOverview(main);
  else renderContinuous(main);
  // Re-attach position tracking after render
  setTimeout(setupRambamPositionTracking, 100);
}

// Convert number to Hebrew letters (gematria) — e.g. 1→א׳, 15→ט״ו, 23→כ״ג
function toHebNum(n) {
  if (!n || n < 1) return String(n);
  const ones = ['','א','ב','ג','ד','ה','ו','ז','ח','ט'];
  const tens = ['','י','כ','ל'];
  // Special cases: 15=ט״ו, 16=ט״ז
  let t = Math.floor(n / 10), u = n % 10;
  if (n === 15) return 'ט״ו';
  if (n === 16) return 'ט״ז';
  const letters = (tens[t] || '') + (ones[u] || '');
  if (letters.length > 1) return letters.slice(0,-1) + '״' + letters.slice(-1);
  return letters + '׳';
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

  // If sections exist, render sectioned view
  if (h.sections && h.sections.length) {
    return renderSectionedHalCard(ch, h, preview, isOpen, id, openCls, vizBadge, arrowChar);
  }

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
    if (h.he) srcHtml += `<div class="txt-rambam" dir="rtl" style="text-align:right">${fmtRef(markStInText(h.he, h.st))}</div>`;
    if (h.en) srcHtml += `<div class="txt-english">${h.en}</div>`;
  } else if (IS_EN) {
    // English only: show English Rambam text
    if (h.en) srcHtml = `<div class="txt-english">${h.en}</div>`;
  } else {
    // Hebrew: show Hebrew source
    if (h.he) srcHtml = `<div class="txt-rambam">${fmtRef(markStInText(h.he, h.st))}</div>`;
  }

  // Steinsaltz commentary (always Hebrew)
  let stHtml = '';
  if (h.st && h.st.length) {
    const stLabel = IS_EN ? 'Steinsaltz Commentary — integrated in halacha text' : 'ביאור שטיינזלץ - משולב בטקסט ההלכה <span style="font-weight:400">(מסומן בקו תחתון דק)</span>';
    const stId = `st-${ch}-${h.n}`;
    stHtml = `<div class="txt-steinsaltz"><div class="st-label st-toggle" onclick="document.getElementById('${stId}').classList.toggle('open')">${stLabel} <span class="st-arrow">◀</span></div><div class="st-body" id="${stId}">${h.st.map(s => `<div class="st-item" ${IS_EN ? 'dir="rtl" style="text-align:right"' : ''}>${fmtSt(s)}</div>`).join('')}</div></div>`;
  }

  // Observatory mini-preview link
  const obsKey = `${ch}:${h.n}`;
  const obsConcept = OBS_HAL_MAP[obsKey];
  const obsLink = obsConcept
    ? `<a href="observatory.html?concept=${obsConcept}" class="obs-mini-link" title="${IS_EN ? 'View 3D Model' : 'ראה בדגם התלת-ממדי'}">🌍 ${IS_EN ? 'View in 3D' : 'דגם תלת מימד'}</a>`
    : '';

  return `<div class="hal-card${openCls}" id="hal-${id}">
    <div class="hal-header" onclick="toggleHal('${id}')">
      <div class="hal-num">${IS_EN ? h.n : toHebNum(h.n)}</div>
      <div class="hal-preview">${vizBadge}${preview}</div>
      <span class="hal-arrow">${arrowChar}</span>
    </div>
    <div class="hal-body">
      ${bioHtml}
      ${obsLink}
      ${srcHtml}
      ${stHtml}
      ${h.viz ? renderViz(h.viz, ch, h.n) : ''}
    </div>
  </div>`;
}

// ========================
// SECTIONED HALACHA CARD
// ========================
function stripNiqqud(s) {
  return s.replace(/[\u0591-\u05C7]/g, '');
}

function findBreakIndex(text, breakStr) {
  let idx = text.indexOf(breakStr);
  if (idx !== -1) return { idx: idx, len: breakStr.length };
  const strippedText = stripNiqqud(text);
  const strippedBreak = stripNiqqud(breakStr);
  const sIdx = strippedText.indexOf(strippedBreak);
  if (sIdx === -1) return null;
  let origStart = 0, count = 0;
  while (count < sIdx && origStart < text.length) {
    if (!/[\u0591-\u05C7]/.test(text[origStart])) count++;
    origStart++;
  }
  let origEnd = origStart, bcount = 0;
  while (bcount < strippedBreak.length && origEnd < text.length) {
    if (!/[\u0591-\u05C7]/.test(text[origEnd])) bcount++;
    origEnd++;
  }
  return { idx: origStart, len: origEnd - origStart };
}

function splitTextBySections(fullText, sections, breakKey) {
  if (!fullText) return sections.map(() => '');
  const parts = [];
  let remaining = fullText;
  for (let i = 0; i < sections.length; i++) {
    const brk = sections[i][breakKey];
    if (!brk || i === sections.length - 1) {
      parts.push(remaining);
      remaining = '';
    } else {
      const match = findBreakIndex(remaining, brk);
      if (!match) {
        parts.push(remaining);
        remaining = '';
      } else {
        const cutAt = match.idx + match.len;
        parts.push(remaining.substring(0, cutAt));
        remaining = remaining.substring(cutAt).trimStart();
      }
    }
  }
  while (parts.length < sections.length) parts.push('');
  return parts;
}

function renderSectionTable(table) {
  if (!table || !table.rows) return '';
  const headers = IS_EN ? (table.headers_en || table.headers) : table.headers;
  const rows = table.rows;
  let html = '<table class="calc-table"><thead><tr>';
  headers.forEach(h => { html += `<th>${h}</th>`; });
  html += '</tr></thead><tbody>';
  rows.forEach(r => {
    html += '<tr>';
    r.forEach(c => { html += `<td>${c}</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

function renderSectionedHalCard(ch, h, preview, isOpen, id, openCls, vizBadge, arrowChar) {
  const heParts = splitTextBySections(h.he, h.sections, 'heBreak');
  const enParts = splitTextBySections(h.en, h.sections, 'enBreak');
  const stLabel = IS_EN ? 'Steinsaltz Commentary (Hebrew)' : 'ביאור שטיינזלץ - משולב בטקסט ההלכה <span style="font-weight:400">(מסומן בקו תחתון דק)</span>';
  const sectionArrow = IS_EN ? '▶' : '◀';

  let sectionsHtml = '';
  h.sections.forEach((sec, si) => {
    const secId = `${id}-sec-${si}`;
    const title = IS_EN ? (sec.title_en || sec.title) : sec.title;

    let secBio = '';
    if (IS_EN) {
      const bio = sec.bio_en || sec.bio || '';
      if (bio) secBio = `<div class="section-bio">${bio}</div>`;
    } else {
      if (sec.bio) secBio = `<div class="section-bio">${sec.bio}</div>`;
    }

    let secSrc = '';
    const heTxt = heParts[si] || '';
    const enTxt = enParts[si] || '';
    // Get the steinsaltz slice for this section (for markStInText)
    const secStArr = (h.st && sec.stRange && sec.stRange.length === 2)
      ? h.st.slice(sec.stRange[0], sec.stRange[1] + 1) : [];
    if (IS_EN && IS_BILINGUAL) {
      if (heTxt) secSrc += `<div class="txt-rambam" dir="rtl" style="text-align:right">${typeof markStInText==='function' ? markStInText(fmtRef(heTxt), secStArr) : fmtRef(heTxt)}</div>`;
      if (enTxt) secSrc += `<div class="txt-english">${enTxt}</div>`;
    } else if (IS_EN) {
      if (enTxt) secSrc = `<div class="txt-english">${enTxt}</div>`;
    } else {
      if (heTxt) secSrc = `<div class="txt-rambam">${typeof markStInText==='function' ? markStInText(fmtRef(heTxt), secStArr) : fmtRef(heTxt)}</div>`;
    }

    const secTable = sec.table ? renderSectionTable(sec.table) : '';

    let secSt = '';
    if (secStArr.length) {
      const secStId = `st-${ch}-${h.n}-sec-${si}`;
      const secStLabel = IS_EN ? 'Steinsaltz Commentary' : 'ביאור שטיינזלץ - משולב בטקסט ההלכה <span style="font-weight:400">(מסומן בקו תחתון דק)</span>';
      secSt = `<div class="txt-steinsaltz"><div class="st-label st-toggle" onclick="document.getElementById('${secStId}').classList.toggle('open')">${secStLabel} <span class="st-arrow">◀</span></div><div class="st-body" id="${secStId}">${secStArr.map(s => `<div class="st-item" ${IS_EN ? 'dir="rtl" style="text-align:right"' : ''}>${fmtSt(s)}</div>`).join('')}</div></div>`;
    }

    const secOpen = isOpen ? ' open' : '';

    sectionsHtml += `<div class="hal-section${secOpen}" id="sec-${secId}">
      <div class="section-header" onclick="document.getElementById('sec-${secId}').classList.toggle('open')">
        <div class="section-num">${si + 1}</div>
        <div class="section-title">${title}</div>
        <span class="section-arrow">${sectionArrow}</span>
      </div>
      <div class="section-body">
        ${secBio}
        ${secSrc}
        ${secTable}
        ${secSt}
      </div>
    </div>`;
  });

  let bioHtml = '';
  if (IS_EN) {
    const bio = h.bio_en || h.bio || '';
    if (bio) bioHtml = `<div class="bio-block">${bio}</div>`;
  } else {
    if (h.bio) bioHtml = `<div class="bio-block">${h.bio}</div>`;
  }

  return `<div class="hal-card${openCls}" id="hal-${id}">
    <div class="hal-header" onclick="toggleHal('${id}')">
      <div class="hal-num">${IS_EN ? h.n : toHebNum(h.n)}</div>
      <div class="hal-preview">${vizBadge}${preview}</div>
      <span class="hal-arrow">${arrowChar}</span>
    </div>
    <div class="hal-body">
      ${bioHtml}
      ${sectionsHtml}
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

function scrollToSavedHalacha() {
  if (!window.RambamSettings) return;
  const pos = RambamSettings.get('rambamPosition');
  if (!pos || !pos.ch || !pos.hal) return;
  setTimeout(() => {
    const el = document.getElementById('hal-' + pos.ch + '-' + pos.hal);
    if (el) { el.classList.add('open'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }, 300);
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
      if (currentMode === 'overview') setMode('continuous');
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
  // Fall back to saved position (only if no date param)
  if (params.get('date')) return false;
  const pos = RambamSettings.get('rambamPosition');
  if (!pos || !pos.ch) return false;
  currentCh = pos.ch;
  if (currentMode === 'overview') setMode('continuous');
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
  // Support ?mode=overview to force overview mode (used by home page intro button)
  const modeParam = new URLSearchParams(location.search).get('mode');

  if(d){
    fetch('https://www.sefaria.org/api/calendars?year='+d.gYear+'&month='+d.gMonth+'&day='+d.gDay+'&timezone='+encodeURIComponent(tz))
      .then(r => r.json())
      .then(data => {
        const items = data.calendar_items || [];
        let rambam3 = items.find(it => it.title && it.title.en === 'Daily Rambam (3 Chapters)');
        if(!rambam3) { if(modeParam === 'overview') setMode('overview'); else renderAll(); return; }
        // Parse chapter range from ref like "Mishneh Torah, Sanctification of the New Month 6-8"
        const ref = rambam3.ref || '';
        const isKH = /Sanctification of the New Month/i.test(ref);
        if(!isKH){ if(modeParam === 'overview') setMode('overview'); else renderAll(); return; }
        const match = ref.match(/(\d+)(?:-(\d+))?$/);
        if(!match){ if(modeParam === 'overview') setMode('overview'); else renderAll(); return; }
        const from = parseInt(match[1],10);
        const to = match[2] ? parseInt(match[2],10) : from;
        const chs = [];
        for(let i = from; i <= to; i++) chs.push(i);
        dailyChapters = chs;
        currentCh = chs[0];
        // If ?mode=overview, respect that instead of auto-switching to continuous
        if(modeParam === 'overview') setMode('overview');
        else setMode('continuous');
        scrollToSavedHalacha();
      })
      .catch(() => { if (!restoreRambamPosition()) renderAll(); });
  } else {
    if(modeParam === 'overview') setMode('overview');
    else if (!restoreRambamPosition()) renderAll();
  }
};
