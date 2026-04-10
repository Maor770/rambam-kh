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
    const lang = window.obsLang || 'he';
    panel.innerHTML = `
      <div class="detail-header">
        <span class="detail-layer-badge" style="background:${OBS_LAYERS[concept.layer-1].color}20;color:${OBS_LAYERS[concept.layer-1].color}">
          ${OBS_LAYER_ICONS[concept.layer]} ${lang === 'he' ? 'שכבה' : 'Layer'} ${concept.layer}
        </span>
        <span class="detail-ref">${lang === 'he' ? 'הלכה' : 'Halacha'} ${concept.ref}</span>
      </div>
      <h3 class="detail-title">${lang === 'he' ? concept.name : concept.nameEn}</h3>
      <p class="detail-explain">${lang === 'he' ? concept.explain : concept.explainEn}</p>
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
      if(speedLabel) speedLabel.textContent = `×${v}`;
    });
  }

  document.querySelectorAll('[data-time-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.dataset.timePreset);
      window.obsTime.day = val;
      if(slider) slider.value = val;
    });
  });
};

/* ══════════════════════════════════════════════════════════
   STORY MODE — 32 steps covering all of Hilchot Kiddush HaChodesh
   ══════════════════════════════════════════════════════════ */
let storyStep = -1;

const STORY_STEPS = [
  /* ── Step 0: Introduction ── */
  {id:'intro', concept:'moonMonth', camera:'sideView', vizMode:'sideView', playing:true, speed:0.5,
   title:'למה הירח משנה צורה?',
   titleEn:'Why Does the Moon Change Shape?',
   text:'הירח לא מאיר מעצמו — הוא מחזיר אור מהשמש. הצד שפונה לשמש מואר, הצד השני חשוך. מה שאנחנו רואים מהארץ תלוי בזווית בין שלושתם: שמש, ירח, ארץ.\n\nכל ההלכות הבאות מלמדות לחשב את הזווית הזו במדויק — כדי לדעת: האם נראה את הסהר הערב?',
   textEn:'The moon doesn\'t produce its own light — it reflects sunlight. The side facing the sun is lit, the other side is dark. What we see from Earth depends on the angle between the three: Sun, Moon, Earth.\n\nAll the following laws teach how to calculate this angle precisely — to know: will we see the crescent tonight?'},

  /* ── Part 1: What is a Month? (Ch 1-5) ── */
  {id:'s1', ref:'א:א', concept:'moonMonth', camera:'moonClose', day:0, speed:1, playing:true,
   title:'חודש לבנה',
   titleEn:'Lunar Month',
   text:'חודשי השנה העברית נקבעים לפי הירח. הירח סובב סביב הארץ כל 29.5 ימים — וזה חודש אחד.',
   textEn:'The months of the Hebrew year follow the moon. The moon orbits Earth every 29.5 days — that\'s one month.'},

  {id:'s2', ref:'א:א', concept:'molad', camera:'moonClose', day:0, vizMode:'conjunction',
   title:'המולד',
   titleEn:'The Conjunction (Molad)',
   text:'המולד הוא הרגע שבו הירח בדיוק בין הארץ לשמש. באותו רגע הירח חשוך לגמרי — לא רואים אותו.',
   textEn:'The Molad is the moment the moon is exactly between Earth and the Sun. At that instant the moon is completely dark — invisible.'},

  {id:'s3', ref:'א:ג', concept:'crescent', camera:'moonClose', day:2, speed:0.5, vizMode:'crescentHighlight',
   title:'לידת הסהר',
   titleEn:'Birth of the Crescent',
   text:'יום-יומיים אחרי המולד, נראה פס אור דק בצד הירח — הסהר. זו "לידת הלבנה" — סימן שהחודש החדש התחיל.',
   textEn:'A day or two after the Molad, a thin sliver of light appears on the moon\'s edge — the crescent. This is the "birth of the moon" — the sign that the new month has begun.'},

  {id:'s4', ref:'א:ג-ד', concept:'moonPhases', camera:'moonClose', speed:8, playing:true, vizMode:'showPhases',
   title:'פאזות הירח',
   titleEn:'Moon Phases',
   text:'הירח עובר 8 שלבים בכל חודש:\nמולד → סהר → רבע ראשון → מתמלאת → מלא → חסרה → רבע אחרון → סהר אחרון → חזרה למולד.',
   textEn:'The moon goes through 8 phases each month:\nNew → Crescent → First Quarter → Waxing Gibbous → Full → Waning Gibbous → Last Quarter → Waning Crescent → back to New.'},

  {id:'s5', ref:'א:ב', concept:'solarYear', camera:'sunOrbit', vizMode:'gapMarker',
   title:'שנת חמה ושנת לבנה',
   titleEn:'Solar Year vs. Lunar Year',
   text:'שנת חמה = 365 ימים. שנת לבנה = 354 ימים.\nהפרש: 11 ימים חסרים!\nאם לא מתקנים — פסח יזוז לחורף!',
   textEn:'Solar year = 365 days. Lunar year = 354 days.\nDifference: 11 missing days!\nWithout correction — Passover would drift into winter!'},

  {id:'s6', ref:'ד:א-ב', concept:'leapYear', camera:'overview', vizMode:'cycle19',
   title:'עיבור — חודש 13',
   titleEn:'Leap Year — Month 13',
   text:'הפתרון: כל כמה שנים מוסיפים חודש שלם (אדר שני).\n7 שנים מעוברות בכל מחזור של 19 שנים: שנים 3, 6, 8, 11, 14, 17, 19.',
   textEn:'The solution: every few years we add a full month (Adar II).\n7 leap years in every 19-year cycle: years 3, 6, 8, 11, 14, 17, 19.'},

  {id:'s6b', ref:'ט:א-ג · י:א', concept:'solarYear', camera:'sunOrbit', vizMode:'seasons', playing:true, speed:5,
   title:'תקופות — מתי העונות?',
   titleEn:'Seasons — When Do They Change?',
   text:'תקופה = תחילת עונה חדשה. יש 4 תקופות בשנה:\nתקופת ניסן (אביב), תמוז (קיץ), תשרי (סתיו), טבת (חורף).\n\nלמה זה חשוב? כי התורה אומרת "שמור את חודש האביב" — פסח חייב ליפול אחרי תחילת האביב (תקופת ניסן). זו הסיבה העיקרית שמעברים שנים!',
   textEn:'Tekufah = the start of a new season. There are 4 per year:\nTekufat Nisan (spring), Tammuz (summer), Tishrei (fall), Tevet (winter).\n\nWhy does this matter? The Torah says "guard the month of spring" — Passover must fall after the start of spring. This is the main reason we add leap years!'},

  {id:'s7', ref:'ב:א · ה:א-ב', concept:'witnesses', camera:'horizon', vizMode:'witnessScene', day:2,
   title:'עדים ובית דין',
   titleEn:'Witnesses and the Court',
   text:'בזמן בית המקדש: שני עדים שראו את הסהר באו לירושלים. בית הדין חקר אותם — ואם העדות נכונה, הכריז "מקודש! מקודש!"',
   textEn:'During Temple times: two witnesses who saw the crescent came to Jerusalem. The court examined them — and if the testimony was valid, declared "Sanctified! Sanctified!"'},

  /* ── Part 2: Molad Calculations (Ch 6-10) ── */
  {id:'s8', ref:'ו:ב', concept:'chelek', camera:'overview', vizMode:'clock1080',
   title:'חלקים — יחידת הזמן',
   titleEn:'Parts — The Time Unit',
   text:'הרמב"ם מחלק כל שעה ל-1,080 חלקים (לא דקות!).\nלמה? כי 1,080 מתחלק ב-2, 3, 4, 5, 6, 8, 9, 10 — אפס שברים!',
   textEn:'The Rambam divides each hour into 1,080 parts (not minutes!).\nWhy? Because 1,080 is divisible by 2, 3, 4, 5, 6, 8, 9, 10 — zero fractions!'},

  {id:'s9', ref:'ו:ג', concept:'monthLength', camera:'moonClose', vizMode:'monthCounter', playing:true, speed:2,
   title:'אורך חודש מדויק',
   titleEn:'Exact Month Length',
   text:'חודש לבנה מדויק =\n29 ימים · 12 שעות · 793 חלקים\n\nמספר זה קבוע לנצח — תמיד אותו דבר.\n(כל שעה = 1,080 חלקים)',
   textEn:'An exact lunar month =\n29 days · 12 hours · 793 parts\n\nThis number is constant forever — always the same.\n(Each hour = 1,080 parts)'},

  {id:'s10', ref:'ו:ח', concept:'moladTishrei', camera:'overview', vizMode:'timeline',
   title:'מולד תשרי — נקודת ההתחלה',
   titleEn:'Molad of Tishrei — The Starting Point',
   text:'כל המולדות בהיסטוריה מחושבים מנקודה אחת:\nמולד תשרי שנת הבריאה — יום ב׳, שעה 5, 204 חלקים (בה"ד).\n\nכדי למצוא כל מולד — סופרים כמה חודשים עברו ומוסיפים את אורך החודש שוב ושוב.',
   textEn:'All Molads in history are calculated from one point:\nMolad Tishrei of Creation — Monday, hour 5, 204 parts (BeHaRD).\n\nTo find any Molad — count how many months passed and add the month length again and again.'},

  {id:'s11', ref:'ז:א-ז', concept:'dechiyot', camera:'overview', vizMode:'weekDays',
   title:'דחיות',
   titleEn:'Postponement Rules',
   text:'4 כללים שדוחים את ראש השנה:\n(1) אד"ו — לא ביום א׳, ד׳, ו׳\n(2) מולד ישן — אחרי שעה 18\n(3) גטר"ד — שנה רגילה, יום ג׳ אחרי 9:204\n(4) בט"ו תקפ"ת — אחרי מעוברת, יום ב׳ אחרי 15:589',
   textEn:'4 rules that postpone Rosh Hashanah:\n(1) ADU — not on Sun, Wed, Fri\n(2) Old Molad — after hour 18\n(3) GaTRaD — regular year, Tue after 9:204\n(4) BeTU TaKPaT — post-leap, Mon after 15:589'},

  {id:'s12', ref:'ח:ה-ט', concept:'fullMonth', camera:'overview', vizMode:'monthBars',
   title:'חודשים מלאים וחסרים',
   titleEn:'Full and Deficient Months',
   text:'חודש מלא = 30 ימים. חודש חסר = 29 ימים.\nלסירוגין: תשרי מלא, חשוון?, כסלו?, טבת חסר...\nחשוון וכסלו משתנים בין השנים.',
   textEn:'Full month = 30 days. Deficient month = 29 days.\nAlternating: Tishrei full, Cheshvan?, Kislev?, Tevet deficient...\nCheshvan and Kislev vary between years.'},

  /* ── Part 3: Solar Orbit (Ch 11-13) ── */
  {id:'s13', ref:'יא:ו-ט', concept:'degree', camera:'zodiacWide', vizMode:'degreeLabels', playing:true, speed:1,
   title:'מערכת המעלות',
   titleEn:'The Degree System',
   text:'העיגול מחולק ל-360 מעלות.\nכל מעלה = 60 דקות (לא דקות של זמן!).\nכל דקה = 60 שניות.\nככה מודדים מיקום בשמיים.',
   textEn:'The circle is divided into 360 degrees.\nEach degree = 60 minutes (not time minutes!).\nEach minute = 60 seconds.\nThis is how we measure positions in the sky.'},

  {id:'s14', ref:'יא:ז-ח', concept:'zodiac', camera:'zodiacWide', speed:3, vizMode:'zodiacLabels',
   title:'גלגל המזלות',
   titleEn:'The Zodiac Belt',
   text:'12 מזלות על טבעת בשמיים, כל אחד 30°.\nהשמש עוברת מזל אחד בחודש:\nטלה ≈ מרץ, שור ≈ אפריל, תאומים ≈ מאי, סרטן ≈ יוני, אריה ≈ יולי, בתולה ≈ אוגוסט, מאזניים ≈ ספטמבר, עקרב ≈ אוקטובר, קשת ≈ נובמבר, גדי ≈ דצמבר, דלי ≈ ינואר, דגים ≈ פברואר.',
   textEn:'12 zodiac signs on a belt in the sky, each 30°.\nThe sun passes one sign per month:\nAries ≈ Mar, Taurus ≈ Apr, Gemini ≈ May, Cancer ≈ Jun, Leo ≈ Jul, Virgo ≈ Aug, Libra ≈ Sep, Scorpio ≈ Oct, Sagittarius ≈ Nov, Capricorn ≈ Dec, Aquarius ≈ Jan, Pisces ≈ Feb.'},

  {id:'s15', ref:'יב:א', concept:'dailyMotion', camera:'sunOrbit', speed:2, playing:true, vizMode:'sunDailyMotion',
   title:'מהלך השמש — כמעלה אחת ביום',
   titleEn:'The Sun\'s Daily Motion — About 1° Per Day',
   text:'השמש זזה כמעלה אחת ביום (בדיוק: 0° 59\' 8").\nתוך שנה — סיבוב שלם של 360°.',
   textEn:'The sun moves about one degree per day (exactly: 0° 59\' 8").\nIn one year — a full 360° rotation.'},

  {id:'s16', ref:'יב:א-ב', concept:'meanSun', camera:'sunOrbit', playing:true, speed:2, vizMode:'meanSunMarker',
   title:'שמש אמצעית',
   titleEn:'Mean Sun',
   text:'שמש אמצעית = איפה השמש היא היתה אם היתה זזה במהירות קבועה.\n\nזה רק חישוב ראשוני — עוד לא המיקום האמיתי!',
   textEn:'Mean sun = where the sun would be if it moved at a constant speed.\n\nThis is only an initial calculation — not the true position yet!'},

  {id:'s17', ref:'יא:יג-טו', concept:'epicycle', camera:'sunOrbit', speed:2, vizMode:'epicycleExplain',
   title:'למה השמש לא אחידה? — גלגל קטן וגלגל גדול',
   titleEn:'Why Isn\'t the Sun Uniform? — Small Wheel and Big Wheel',
   text:'השמש לא זזה במהירות קבועה — לפעמים מהירה, לפעמים איטית.\n\nהרמב"ם מסביר: השמש נעה על גלגל קטן שמרכזו נע על גלגל גדול.\nהגלגל הגדול (הנושא) — מרכזו מוזז מהארץ.\nהגלגל הקטן — עליו נעה השמש בפועל.\nהשילוב יוצר תנועה שנראית לא-אחידה.',
   textEn:'The sun doesn\'t move at a constant speed — sometimes faster, sometimes slower.\n\nThe Rambam explains: the sun moves on a small wheel whose center moves on a big wheel.\nThe big wheel (the carrier) — its center is offset from Earth.\nThe small wheel — the sun actually moves on it.\nThe combination creates non-uniform motion.'},

  {id:'s18', ref:'יג:א-ד', concept:'sunEquation', camera:'sunOrbit', vizMode:'equationArrow',
   title:'תיקון השמש — מאמצע לאמיתי',
   titleEn:'Sun\'s Correction — From Mean to True',
   text:'ההפרש בין "אמצעית" ל"אמיתית" = תיקון (מקסימום ~2°).\n\nההגיון: כשהשמש בנקודת הגובה (הכי רחוקה מהארץ) — היא נראית זזה לאט, אז היא בפיגור מהממוצע → מחסירים.\nכשהשמש בנקודת השפל (הכי קרובה) — היא נראית זזה מהר → מוסיפים.',
   textEn:'The difference between "mean" and "true" = correction (max ~2°).\n\nThe logic: when the sun is at the high point (farthest from Earth) — it appears to move slowly, so it lags behind the average → subtract.\nWhen at the low point (closest) — it appears to move fast → add.'},

  /* ── Part 4: Lunar Orbit (Ch 14-15) ── */
  {id:'s19', ref:'יד:א', concept:'meanMoon', camera:'moonClose', speed:3, vizMode:'dualSpeed',
   title:'ירח אמצעי — 13° ביום',
   titleEn:'Mean Moon — 13° Per Day',
   text:'הירח הרבה יותר מהיר מהשמש — 13° 10\' ביום!\n(השמש רק 1°)\nלכן הירח "עוקף" את השמש כל חודש.',
   textEn:'The moon is much faster than the sun — 13° 10\' per day!\n(The sun only 1°)\nSo the moon "laps" the sun every month.'},

  {id:'s20', ref:'יד:א-ב', concept:'anomaly', camera:'moonClose', vizMode:'moonEpicycle',
   title:'גלגל קטן של הירח',
   titleEn:'The Moon\'s Small Wheel',
   text:'גם לירח יש גלגל קטן!\n\nהרמב"ם כותב: "הירח עצמו מסבב בגלגל קטן שאינו מקיף את העולם כולו".\n\nכתוצאה — לפעמים הירח קרוב לארץ (ונראה ממהר) ולפעמים רחוק (ונראה מאט).\nהמרחק של הירח מנקודת השיא בגלגל הקטן = "מנת חריגה".',
   textEn:'The moon also has a small wheel!\n\nThe Rambam writes: "The moon itself revolves on a small wheel that does not encompass the whole world."\n\nAs a result — sometimes the moon is closer to Earth (and appears faster) and sometimes farther (appears slower).\nThe moon\'s distance from the peak of the small wheel = "anomaly."'},

  {id:'s21', ref:'טו:א-ו', concept:'moonEquation', camera:'moonClose', vizMode:'equationArrowMoon',
   title:'תיקון הירח',
   titleEn:'Moon\'s Correction',
   text:'כמו בשמש — גם לירח יש תיקון.\nמקסימום: 5° 8\' — גדול פי 2.5 מתיקון השמש!\n\nאותו הגיון: כשהירח בחצי הקרוב של הגלגל הקטן — נראה מהיר מהממוצע. בחצי הרחוק — נראה איטי. התיקון מפצה על ההבדל.\n\nירח אמיתי = ירח אמצעי ± תיקון.',
   textEn:'Like the sun — the moon also has a correction.\nMaximum: 5° 8\' — 2.5× bigger than the sun\'s!\n\nSame logic: when the moon is in the near half of the small wheel — it appears faster than average. In the far half — slower. The correction compensates.\n\nTrue moon = Mean moon ± correction.'},

  /* ── Part 5: Moon Visibility (Ch 16-19) ── */
  {id:'s22', ref:'יז:א', concept:'crescent', camera:'sideView', vizMode:'crescentFormation', playing:true, speed:1,
   title:'איך נוצרת צורת הסהר',
   titleEn:'How the Crescent Shape is Formed',
   text:'הירח לא מאיר מעצמו — השמש מאירה אותו.\nהחלק שפונה לשמש מואר, החלק שפונה מהשמש חשוך.\nמה שאנחנו רואים תלוי בזווית בין שלושתם: שמש, ירח, ארץ.\n\nכדי לדעת אם הסהר ייראה — צריך לדעת בדיוק איפה השמש, איפה הירח, ומה הזווית ביניהם.',
   textEn:'The moon doesn\'t shine on its own — the sun illuminates it.\nThe side facing the sun is lit, the side facing away is dark.\nWhat we see depends on the angle between all three: Sun, Moon, Earth.\n\nTo know if the crescent will be visible — we need to know exactly where the sun is, where the moon is, and the angle between them.'},

  {id:'s23', ref:'טז:א-ב', concept:'ascendingNode', camera:'moonClose', vizMode:'nodesExplain',
   title:'נקודות החיתוך — "ראש" ו"זנב"',
   titleEn:'Intersection Points — "Head" and "Tail"',
   text:'מסלול הירח נוטה 5° ביחס למסלול השמש.\nהם נפגשים בשתי נקודות:\n\nנקודת החיתוך העולה (הרמב"ם קורא "ראש") — שם הירח עולה צפונה.\nנקודת החיתוך היורדת ("זנב") — שם הירח יורד דרומה.\n\nהנקודות האלה זזות לאחור!',
   textEn:'The moon\'s orbit tilts 5° from the sun\'s path.\nThey meet at two points:\n\nThe ascending intersection (Rambam calls it "Head") — where the moon rises northward.\nThe descending intersection ("Tail") — where the moon descends southward.\n\nThese points move backward!'},

  {id:'s24', ref:'טז:ז-יא', concept:'moonLatitude', camera:'moonClose', vizMode:'latitudeShow', playing:true, speed:2,
   title:'רוחב הירח',
   titleEn:'Moon\'s Latitude',
   text:'הירח נע מעל ומתחת למסלול השמש — עד 5° צפון או דרום.\n\nכשהרוחב = 0° (הירח בדיוק על מסלול השמש) — ליקוי אפשרי!',
   textEn:'The moon moves above and below the sun\'s path — up to 5° north or south.\n\nWhen latitude = 0° (moon exactly on sun\'s path) — an eclipse is possible!'},

  {id:'s25', ref:'טו:א', concept:'elongation', camera:'overview', vizMode:'elongationExplain', playing:true, speed:2,
   title:'הזווית בין שמש לירח',
   titleEn:'The Angle Between Sun and Moon',
   text:'הזווית בין השמש לירח כפי שנראית מהארץ:\n0° = מולד (ירח חשוך)\nככל שהזווית גדלה — רואים יותר מהירח מואר\n180° = ירח מלא',
   textEn:'The angle between sun and moon as seen from Earth:\n0° = conjunction (dark moon)\nAs the angle grows — more of the lit moon is visible\n180° = full moon'},

  {id:'s26', ref:'יז:א-ג', concept:'parallax', camera:'moonClose', vizMode:'parallaxLines',
   title:'הפרש ראייה',
   titleEn:'Viewing Difference (Parallax)',
   text:'אנחנו לא במרכז הארץ — אנחנו על פני השטח!\nלכן מיקום הירח שאנחנו רואים שונה קצת מהחישוב.\n\nההבדל בין מה שרואים מהמרכז לבין מה שרואים מירושלים = הפרש ראייה.',
   textEn:'We\'re not at Earth\'s center — we\'re on the surface!\nSo the moon\'s position we see differs slightly from the calculation.\n\nThe difference between the view from the center and from Jerusalem = viewing difference.'},

  {id:'s27', ref:'יז:טו-יז', concept:'arcOfVision', camera:'horizon', vizMode:'arcZones',
   title:'קשת הראייה',
   titleEn:'Arc of Vision',
   text:'הגובה של הירח מעל האופק בזמן שקיעה:\n\nפחות מ-9° = בלתי נראה\n9°-14° = תלוי בתנאים\nמעל 14° = נראה בוודאות',
   textEn:'The moon\'s height above the horizon at sunset:\n\nLess than 9° = invisible\n9°-14° = depends on conditions\nAbove 14° = definitely visible'},

  {id:'s28', ref:'יט:ב', concept:'eclipticTilt', camera:'zodiacWide', vizMode:'tiltShow',
   title:'נטיית מסלול השמש',
   titleEn:'Tilt of the Sun\'s Path',
   text:'מסלול השמש (גלגל המזלות) נוטה 23.5° ביחס לקו המשווה.\nזה משפיע על הגובה שבו הסהר נראה — תלוי בעונה ובמזל.',
   textEn:'The sun\'s path (zodiac belt) tilts 23.5° relative to the equator.\nThis affects the height at which the crescent is seen — depending on season and zodiac sign.'},

  {id:'s29', ref:'יט:יב', concept:'crescentHorns', camera:'moonClose', day:3, vizMode:'hornsShow',
   title:'כיוון קרני הסהר',
   titleEn:'Direction of the Crescent Horns',
   text:'הקרניים של הסהר תמיד מצביעות הרחק מהשמש.\nלפי מיקום השמש והירח — הכיוון משתנה.',
   textEn:'The horns of the crescent always point away from the sun.\nDepending on the positions of the sun and moon — the direction changes.'},

  /* ── Ending ── */
  {id:'s30', concept:'moonMonth', camera:'overview', speed:5, playing:true, vizMode:'allLayers',
   title:'כל התהליך ביחד',
   titleEn:'The Complete System',
   text:'עכשיו נראה את כל המערכת עובדת ביחד:\nירח סובב, שמש זזה, מזלות, נקודות חיתוך — הכל בסנכרון.\n\nזה מה שהרמב"ם מתאר ב-19 פרקים.',
   textEn:'Now let\'s see the entire system working together:\nMoon orbiting, sun moving, zodiac signs, intersection points — all in sync.\n\nThis is what the Rambam describes across 19 chapters.'},

  {id:'s31', concept:'sanctification', camera:'horizon', vizMode:'summary',
   title:'מהמולד לקידוש — סיכום',
   titleEn:'From Molad to Sanctification — Summary',
   text:'התהליך:\n(1) חישוב מולד\n(2) מיקום אמיתי של שמש וירח\n(3) בדיקת ראיית הסהר\n(4) קידוש!\n\nכל הלכות קידוש החודש — במערכת אחת.',
   textEn:'The process:\n(1) Calculate the Molad\n(2) True positions of sun and moon\n(3) Check crescent visibility\n(4) Sanctification!\n\nAll the laws of Kiddush HaChodesh — in one system.'}
];

/* ── Render a story step ── */
function renderStoryCard(){
  const overlay = document.getElementById('obs-story-overlay');
  if(!overlay || storyStep < 0 || storyStep >= STORY_STEPS.length) return;
  // Ensure overlay is visible
  overlay.classList.add('active');

  const step = STORY_STEPS[storyStep];
  const lang = window.obsLang || 'he';
  const isHe = lang === 'he';
  const title = isHe ? step.title : step.titleEn;
  const text = isHe ? step.text : step.textEn;
  const prevLabel = isHe ? '→ הקודם' : 'Previous →';
  const nextLabel = isHe ? 'הבא ←' : '← Next';
  const finishLabel = isHe ? 'סיום ✓' : 'Finish ✓';
  const fwdLabel = storyStep < STORY_STEPS.length - 1 ? nextLabel : finishLabel;

  const refText = step.ref ? (isHe ? `פרק ${step.ref}` : `Ch. ${step.ref}`) : '';

  overlay.innerHTML = `
    <div class="story-card">
      <div class="story-progress">${storyStep + 1} / ${STORY_STEPS.length}</div>
      <div class="story-title">${title}</div>
      ${refText ? `<div class="story-ref">${refText}</div>` : ''}
      <div class="story-text">${text.replace(/\n/g, '<br>')}</div>
      <div class="story-btns">
        ${storyStep > 0 ? `<button class="story-btn" onclick="prevStoryStep()">${prevLabel}</button>` : ''}
        <button class="story-btn primary" onclick="nextStoryStep()">${fwdLabel}</button>
      </div>
      <button class="story-close" onclick="endStory()" title="${isHe ? 'סגור' : 'Close'}">✕</button>
    </div>`;
}

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
  if(step.concept) obsSelectConcept(step.concept);

  // Camera
  if(step.camera) obsCameraPreset(step.camera);

  // Time
  if(step.day !== undefined) window.obsTime.day = step.day;
  if(step.speed !== undefined) window.obsTime.speed = step.speed;
  else window.obsTime.speed = 1;
  if(step.playing !== undefined) window.obsTime.playing = step.playing;
  else window.obsTime.playing = false; // default: paused

  // Visualization mode
  if(step.vizMode && window.obsSetVizMode) obsSetVizMode(step.vizMode);

  // Update overlay
  renderStoryCard();
};

window.prevStoryStep = function(){
  storyStep -= 2;
  nextStoryStep();
};

window.endStory = function(){
  storyStep = -1;
  window.obsTime.speed = 1;
  const overlay = document.getElementById('obs-story-overlay');
  if(overlay) overlay.classList.remove('active');
  obsCameraPreset('overview');
  obsHighlightObject(null);
  if(window.obsSetVizMode) obsSetVizMode(null);
};

/* ── Language switch for story ── */
window.updateStoryLang = function(){
  if(storyStep >= 0) renderStoryCard();
};

/* ── Search filter for concepts ── */
window.filterConcepts = function(query){
  const q = query.trim().toLowerCase();
  document.querySelectorAll('.concept-item').forEach(el => {
    if(!q){ el.style.display = ''; return; }
    const name = el.querySelector('.concept-name').textContent.toLowerCase();
    const concept = OBS_CONCEPTS.find(c => c.id === el.dataset.id);
    const match = name.includes(q) ||
      (concept && concept.nameEn.toLowerCase().includes(q)) ||
      (concept && concept.explain.includes(q));
    el.style.display = match ? '' : 'none';
  });
  document.querySelectorAll('.layer-group').forEach(g => {
    if(!q) { g.classList.remove('collapsed'); return; }
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

  // Auto-start story if on the 3d page
  const isAutoPage = document.querySelector('.obs-3d-page') || document.querySelector('.obs-page-auto');

  if(conceptParam){
    setTimeout(() => {
      obsSelectConcept(conceptParam);
      const concept = OBS_CONCEPTS.find(c => c.id === conceptParam);
      if(concept){
        const cameraMap = {1:'moonClose', 2:'overview', 3:'sunOrbit', 4:'moonClose'};
        obsCameraPreset(cameraMap[concept.layer] || 'overview');
      }
    }, 500);
  } else if(isAutoPage){
    // Auto-start story mode after scene initializes
    setTimeout(startStory, 800);
  }
});

})();
