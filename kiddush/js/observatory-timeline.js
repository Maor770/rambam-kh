/* observatory-timeline.js – Time controls, concept panel, and story mode */

(function(){
'use strict';

/* ── Concept selection ── */
let selectedConceptId = null;

window.obsSelectConcept = function(id){
  const concept = OBS_CONCEPTS.find(c => c.id === id);
  if(!concept) return;

  selectedConceptId = id;

  // Highlight in 3D
  if(window.obsHighlightObject) obsHighlightObject(concept.object3d);

  // Update detail panel
  const panel = document.getElementById('obs-detail');
  if(panel){
    panel.innerHTML = `
      <div class="detail-header">
        <span class="detail-layer-badge" style="background:${OBS_LAYERS[concept.layer-1].color}20;color:${OBS_LAYERS[concept.layer-1].color}">
          ${OBS_LAYER_ICONS[concept.layer]} שכבה ${concept.layer}
        </span>
        <span class="detail-ref">הלכה ${concept.ref}</span>
      </div>
      <h3 class="detail-title">${concept.name}</h3>
      <p class="detail-name-en">${concept.nameEn}</p>
      <p class="detail-explain">${concept.explain}</p>
      <p class="detail-explain-en">${concept.explainEn}</p>
    `;
    panel.classList.add('active');
  }

  // Mark active in concept list
  document.querySelectorAll('.concept-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
};

/* ── Build concept panel ── */
window.buildConceptPanel = function(){
  const list = document.getElementById('obs-concepts-list');
  if(!list) return;

  let html = '';
  for(const layer of OBS_LAYERS){
    const concepts = OBS_CONCEPTS.filter(c => c.layer === layer.id);
    html += `
      <div class="layer-group">
        <div class="layer-header" onclick="this.parentElement.classList.toggle('collapsed')" style="border-right-color:${layer.color}">
          <span class="layer-icon">${OBS_LAYER_ICONS[layer.id]}</span>
          <span class="layer-title">${layer.name}</span>
          <span class="layer-chapters">פרקים ${layer.chapters}</span>
          <span class="layer-toggle">▾</span>
        </div>
        <div class="layer-desc">${layer.desc}</div>
        <div class="layer-items">`;

    for(const c of concepts){
      html += `
          <div class="concept-item" data-id="${c.id}" data-layer="${c.layer}" onclick="obsSelectConcept('${c.id}')">
            <span class="concept-name">${c.name}</span>
            <span class="concept-ref">${c.ref}</span>
          </div>`;
    }
    html += `</div></div>`;
  }

  list.innerHTML = html;
};

/* ── Layer toggle buttons ── */
window.buildLayerToggles = function(){
  const bar = document.getElementById('obs-layer-toggles');
  if(!bar) return;

  let html = '';
  for(const layer of OBS_LAYERS){
    html += `
      <button class="layer-btn active" data-layer="${layer.id}"
              style="--lc:${layer.color}"
              onclick="toggleLayerBtn(this, ${layer.id})">
        ${OBS_LAYER_ICONS[layer.id]} ${layer.name}
      </button>`;
  }
  bar.innerHTML = html;
};

window.toggleLayerBtn = function(btn, layerId){
  const visible = obsToggleLayer(layerId);
  btn.classList.toggle('active', visible);
};

/* ── Timeline controls ── */
window.initTimeline = function(){
  const slider = document.getElementById('obs-time-slider');
  const playBtn = document.getElementById('obs-play-btn');
  const speedSlider = document.getElementById('obs-speed-slider');
  const speedLabel = document.getElementById('obs-speed-label');

  if(slider){
    slider.addEventListener('input', () => {
      window.obsTime.day = parseFloat(slider.value);
    });
    // Sync slider to animation
    setInterval(() => {
      if(window.obsTime.playing){
        slider.value = window.obsTime.day % parseFloat(slider.max);
      }
    }, 200);
  }

  if(playBtn){
    playBtn.addEventListener('click', () => {
      window.obsTime.playing = !window.obsTime.playing;
      playBtn.textContent = window.obsTime.playing ? '⏸' : '▶';
      playBtn.title = window.obsTime.playing ? 'השהה' : 'הפעל';
    });
  }

  if(speedSlider){
    speedSlider.addEventListener('input', () => {
      const v = parseFloat(speedSlider.value);
      window.obsTime.speed = v;
      if(speedLabel) speedLabel.textContent = v <= 1 ? `×${v}` : `×${v}`;
    });
  }

  // Preset buttons
  document.querySelectorAll('[data-time-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.dataset.timePreset);
      window.obsTime.day = val;
      if(slider) slider.value = val;
    });
  });
};

/* ── Story Mode ── */
let storyStep = -1;
const STORY_STEPS = [
  {concept:'moonMonth', camera:'moonClose', text:'נתחיל מהבסיס: כדור הארץ והירח. הירח סובב סביב כדור הארץ כל 29.5 ימים — וזה חודש לבנה.'},
  {concept:'molad', camera:'moonClose', text:'ברגע שהירח נמצא בדיוק בין הארץ לשמש — זה המולד. הירח חשוך לגמרי.'},
  {concept:'crescent', camera:'moonClose', text:'יום-יומיים אחרי המולד, רואים פס אור דק — הסהר. זה הסימן שהחודש התחיל!', day:2},
  {concept:'moonPhases', camera:'moonClose', text:'במהלך 29.5 ימים, הירח עובר דרך כל הפאזות — מחשוך למלא וחזרה.', speed:5},
  {concept:'solarYear', camera:'sunOrbit', text:'עכשיו נסתכל רחוק יותר: השמש סובבת (מבחינתנו) סביב הארץ פעם בשנה — 365 ימים.'},
  {concept:'zodiac', camera:'zodiacWide', text:'השמש עוברת דרך 12 מזלות. כל מזל = 30 מעלות. סה"כ 360 מעלות = עיגול שלם.'},
  {concept:'zodiacSigns', camera:'zodiacWide', text:'12 המזלות: טלה, שור, תאומים, סרטן, אריה, בתולה, מאזניים, עקרב, קשת, גדי, דלי, דגים.'},
  {concept:'metonicCycle', camera:'overview', text:'כל 19 שנים, השמש והירח חוזרים לאותו מקום. 7 מתוך 19 שנים הן מעוברות.'},
  {concept:'meanSun', camera:'sunOrbit', text:'השמש האמצעית היא מיקום תיאורטי — כאילו השמש זזה במהירות קבועה.'},
  {concept:'epicycle', camera:'sunOrbit', text:'בפועל, השמש זזה על גלגל קטן (אפיציקל) שנע על גלגל גדול (נושא). זה מסביר למה לפעמים היא מהירה יותר.'},
  {concept:'ascendingNode', camera:'moonClose', text:'מסלול הירח חוצה את גלגל המזלות בשתי נקודות — ראש התלי (ירוק) וזנב התלי (אדום).'},
  {concept:'moonLatitude', camera:'moonClose', text:'הירח נע מעל ומתחת לגלגל המזלות — עד 5 מעלות. כשהוא בדיוק על גלגל המזלות — אפשר ליקוי!'},
  {concept:'elongation', camera:'overview', text:'המרחק (elongation) הוא הזווית בין השמש לירח. הקו הצהוב מראה את הזווית הזו.'},
  {concept:'arcOfVision', camera:'horizon', text:'כדי לראות את הסהר, הוא צריך להיות מספיק גבוה מעל האופק בזמן השקיעה — לפחות 9-14 מעלות.'},
  {concept:'crescentHorns', camera:'moonClose', text:'סוף! הקרניים של הסהר תמיד מצביעות הרחק מהשמש. כשמבינים את כל המערכת — מבינים את כל הלכות קידוש החודש.'}
];

window.startStory = function(){
  storyStep = -1;
  nextStoryStep();
  document.getElementById('obs-story-overlay').classList.add('active');
};

window.nextStoryStep = function(){
  storyStep++;
  if(storyStep >= STORY_STEPS.length){
    endStory();
    return;
  }
  const step = STORY_STEPS[storyStep];

  // Select concept
  obsSelectConcept(step.concept);

  // Camera
  if(step.camera) obsCameraPreset(step.camera);

  // Time
  if(step.day !== undefined) window.obsTime.day = step.day;
  if(step.speed !== undefined) window.obsTime.speed = step.speed;
  else window.obsTime.speed = 1;

  // Update overlay
  const overlay = document.getElementById('obs-story-overlay');
  if(overlay){
    const concept = OBS_CONCEPTS.find(c => c.id === step.concept);
    overlay.innerHTML = `
      <div class="story-card">
        <div class="story-progress">${storyStep + 1} / ${STORY_STEPS.length}</div>
        <div class="story-concept-name">${concept ? concept.name : ''}</div>
        <div class="story-text">${step.text}</div>
        <div class="story-btns">
          ${storyStep > 0 ? '<button class="story-btn" onclick="prevStoryStep()">→ הקודם</button>' : ''}
          <button class="story-btn primary" onclick="nextStoryStep()">
            ${storyStep < STORY_STEPS.length - 1 ? 'הבא ←' : 'סיום ✓'}
          </button>
        </div>
        <button class="story-close" onclick="endStory()" title="סגור">✕</button>
      </div>`;
  }
};

window.prevStoryStep = function(){
  storyStep -= 2; // will be incremented in next
  nextStoryStep();
};

window.endStory = function(){
  storyStep = -1;
  window.obsTime.speed = 1;
  const overlay = document.getElementById('obs-story-overlay');
  if(overlay) overlay.classList.remove('active');
  obsCameraPreset('overview');
  obsHighlightObject(null);
};

/* ── Search filter for concepts ── */
window.filterConcepts = function(query){
  const q = query.trim().toLowerCase();
  document.querySelectorAll('.concept-item').forEach(el => {
    if(!q){
      el.style.display = '';
      return;
    }
    const name = el.querySelector('.concept-name').textContent.toLowerCase();
    const concept = OBS_CONCEPTS.find(c => c.id === el.dataset.id);
    const match = name.includes(q) ||
      (concept && concept.nameEn.toLowerCase().includes(q)) ||
      (concept && concept.explain.includes(q));
    el.style.display = match ? '' : 'none';
  });
  // Show all layer groups
  document.querySelectorAll('.layer-group').forEach(g => {
    if(!q) { g.classList.remove('collapsed'); return; }
    const visible = g.querySelectorAll('.concept-item[style=""],.concept-item:not([style])');
    // If all items hidden, collapse
    let anyVisible = false;
    g.querySelectorAll('.concept-item').forEach(ci => {
      if(ci.style.display !== 'none') anyVisible = true;
    });
    g.classList.toggle('collapsed', !anyVisible);
  });
};

/* ── Initialize everything when page loads ── */
window.addEventListener('DOMContentLoaded', () => {
  buildConceptPanel();
  buildLayerToggles();
  initTimeline();
  initObservatoryScene();

  // Check URL for ?concept= parameter
  const params = new URLSearchParams(window.location.search);
  const conceptParam = params.get('concept');
  if(conceptParam){
    // Wait for scene to initialize, then select concept
    setTimeout(() => {
      obsSelectConcept(conceptParam);
      // Find the concept's layer and determine camera
      const concept = OBS_CONCEPTS.find(c => c.id === conceptParam);
      if(concept){
        const cameraMap = {1:'moonClose', 2:'overview', 3:'sunOrbit', 4:'moonClose'};
        obsCameraPreset(cameraMap[concept.layer] || 'overview');
      }
    }, 500);
  }
});

})();
