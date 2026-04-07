/* observatory-concepts.js – All astronomical concepts from Hilchot Kiddush HaChodesh
   Each concept links to a 3D layer and a halacha reference */

window.OBS_CONCEPTS = [

  /* ─── Layer 1: Earth & Moon Basics (Ch 1-5) ─── */
  {id:'moonMonth', layer:1, name:'חודש לבנה', nameEn:'Lunar Month',
   ref:'1:1',
   explain:'חודש לבנה הוא הזמן שלוקח לירח לסובב סיבוב שלם סביב כדור הארץ — כ-29.5 ימים. כל חודש בלוח העברי מתחיל עם לידת הירח החדש.',
   explainEn:'A lunar month is the time it takes the moon to orbit Earth — about 29.5 days. Every Hebrew month begins with the new moon.',
   object3d:'moon'},

  {id:'molad', layer:1, name:'מולד', nameEn:'Conjunction (Molad)',
   ref:'1:1',
   explain:'המולד הוא הרגע שבו הירח נמצא בדיוק בין כדור הארץ לשמש. באותו רגע הירח "נולד מחדש" — לא רואים אותו בשמיים כי הצד המואר שלו פונה מאיתנו.',
   explainEn:'The Molad is the moment the moon is exactly between Earth and Sun. At that instant the moon is invisible because its lit side faces away from us.',
   object3d:'moon'},

  {id:'crescent', layer:1, name:'סהר (הלל)', nameEn:'Crescent',
   ref:'1:3',
   explain:'הסהר הוא פיסת האור הדקה שנראית בירח יום-יומיים אחרי המולד. זה הסימן שהחודש החדש התחיל — כשעדים רואים את הסהר, בית הדין מקדש את החודש.',
   explainEn:'The crescent is the thin sliver of light visible 1-2 days after the Molad. Witnesses seeing it triggers the Beit Din to sanctify the new month.',
   object3d:'moon'},

  {id:'moonPhases', layer:1, name:'שמונה מצבי הירח', nameEn:'8 Moon Phases',
   ref:'1:3',
   explain:'הירח עובר 8 שלבים בכל חודש: מולד (חשוך) → סהר עולה → רבע ראשון → מתמלאת → מלא → חסרה → רבע אחרון → סהר אחרון → חזרה למולד.',
   explainEn:'The moon goes through 8 phases each month: New → Waxing Crescent → First Quarter → Waxing Gibbous → Full → Waning Gibbous → Last Quarter → Waning Crescent → back to New.',
   object3d:'moon'},

  {id:'solarYear', layer:1, name:'שנת חמה', nameEn:'Solar Year',
   ref:'1:2',
   explain:'שנת חמה היא הזמן שלוקח לארץ לסובב סיבוב שלם סביב השמש — כ-365.25 ימים. העונות (קיץ, חורף) נקבעות לפי שנת החמה.',
   explainEn:'A solar year is one complete orbit of Earth around the Sun — about 365.25 days. The seasons are determined by the solar year.',
   object3d:'sun'},

  {id:'lunarYear', layer:1, name:'שנת לבנה', nameEn:'Lunar Year',
   ref:'1:2',
   explain:'שנת לבנה היא 12 חודשי לבנה = כ-354 ימים. זה 11 ימים פחות משנת חמה! לכן צריך לעבר שנים (להוסיף חודש 13) כדי שפסח ישאר באביב.',
   explainEn:'A lunar year is 12 lunar months ≈ 354 days — 11 days shorter than a solar year. We add a 13th month periodically so Passover stays in spring.',
   object3d:'moon'},

  {id:'leapYear', layer:1, name:'שנה מעוברת', nameEn:'Leap Year',
   ref:'4:1',
   explain:'בשנה מעוברת מוסיפים חודש שלם (אדר שני) ללוח. זה קורה 7 פעמים בכל 19 שנים, כדי לסנכרן בין חודשי הלבנה לעונות השמש.',
   explainEn:'In a leap year we add a full month (Adar II). This happens 7 times every 19 years to sync lunar months with solar seasons.',
   object3d:'earth'},

  {id:'witnesses', layer:1, name:'עדי ראייה', nameEn:'Witnesses',
   ref:'2:1',
   explain:'בזמן בית המקדש, שני עדים שראו את הסהר החדש היו באים לבית הדין בירושלים ומעידים. אחרי חקירה, בית הדין היה מכריז "מקודש!".',
   explainEn:'During Temple times, two witnesses who saw the new crescent came to the Beit Din in Jerusalem and testified. After examination, the court declared the month sanctified.',
   object3d:'earth'},

  {id:'sanctification', layer:1, name:'קידוש החודש', nameEn:'Sanctification',
   ref:'1:7',
   explain:'קידוש החודש הוא ההכרזה הרשמית של בית הדין שהחודש החדש התחיל. זו מצווה שניתנה לכלל ישראל — "החודש הזה לכם ראש חודשים".',
   explainEn:'Sanctification is the Beit Din\'s official declaration that the new month has begun — the first mitzvah given to Israel: "This month shall be for you the first of months."',
   object3d:'earth'},

  /* ─── Layer 2: Molad Calculations (Ch 6-10) ─── */
  {id:'chelek', layer:2, name:'חלק', nameEn:'Chelek (Part)',
   ref:'6:2',
   explain:'הרמב"ם מחלק כל שעה ל-1,080 חלקים (במקום 60 דקות). למה 1080? כי הוא מתחלק ב-2,3,4,5,6,8,9,10 — נוח מאוד לחישובים בלי שברים!',
   explainEn:'The Rambam divides each hour into 1,080 parts. Why 1,080? Because it\'s divisible by 2,3,4,5,6,8,9,10 — very convenient for calculations without fractions!',
   object3d:'moon'},

  {id:'moladTishrei', layer:2, name:'מולד תשרי', nameEn:'Molad of Tishrei',
   ref:'6:8',
   explain:'מולד תשרי של שנה א׳ (בהד) היה ביום שני, שעה 5 בלילה, 204 חלקים. כל חישובי המולד מתחילים מנקודה זו ומוסיפים את אורך החודש שוב ושוב.',
   explainEn:'The Molad of Tishrei of Year 1 (BeHaRD) was Monday, 5 hours, 204 parts. All Molad calculations start from this point and add the month length repeatedly.',
   object3d:'moon'},

  {id:'monthLength', layer:2, name:'אורך חודש לבנה', nameEn:'Lunar Month Length',
   ref:'6:3',
   explain:'חודש לבנה מדויק = 29 ימים, 12 שעות ו-793 חלקים. מספר זה קבוע תמיד. כדי לדעת מתי המולד הבא — פשוט מוסיפים את המספר הזה.',
   explainEn:'An exact lunar month = 29 days, 12 hours, 793 parts. This number is constant. To find the next Molad, simply add this value.',
   object3d:'moon'},

  {id:'metonicCycle', layer:2, name:'מחזור 19 שנה', nameEn:'19-Year Cycle',
   ref:'6:10',
   explain:'כל 19 שנים, השמש והירח חוזרים כמעט בדיוק לאותו מיקום. במחזור הזה יש 12 שנים רגילות ו-7 מעוברות (שנים 3,6,8,11,14,17,19).',
   explainEn:'Every 19 years, sun and moon return to almost exactly the same position. The cycle has 12 regular and 7 leap years (years 3,6,8,11,14,17,19).',
   object3d:'moon'},

  {id:'dechiyot', layer:2, name:'דחיות', nameEn:'Postponement Rules',
   ref:'7:1',
   explain:'ארבעה כללים שדוחים את ראש השנה מיום המולד: (1) אד"ו — לא ביום א,ד,ו. (2) מולד זקן — אחרי 18:00. (3) גטר"ד — שנה רגילה, יום ג, אחרי 9:204. (4) בט"ו תקפ"ת — אחרי מעוברת, יום ב, אחרי 15:589.',
   explainEn:'Four rules that postpone Rosh Hashanah: (1) ADU — not on Sun/Wed/Fri. (2) Old Molad — after 18:00. (3) GaTRaD — regular year, Tue after 9h:204p. (4) BeTU TaKPaT — post-leap year, Mon after 15h:589p.',
   object3d:'earth'},

  {id:'fullMonth', layer:2, name:'חודש מלא וחסר', nameEn:'Full & Deficient Month',
   ref:'8:5',
   explain:'חודש מלא = 30 ימים. חודש חסר = 29 ימים. מכיוון שחודש לבנה אמיתי הוא 29.5 ימים, הרמב"ם מחלק את החודשים לסירוגין — מלא, חסר, מלא, חסר.',
   explainEn:'A full month = 30 days. A deficient month = 29 days. Since a true lunar month is 29.5 days, months alternate between full and deficient.',
   object3d:'moon'},

  /* ─── Layer 3: Solar & Lunar Orbits (Ch 11-15) ─── */
  {id:'degree', layer:3, name:'מעלה', nameEn:'Degree',
   ref:'11:6',
   explain:'העיגול (360°) מחולק ל-360 מעלות. כל מעלה = 60 דקות. כל דקה = 60 שניות. כל שנייה = 60 שלישיות. מערכת זו משמשת למדידת מיקום כוכבים בשמיים.',
   explainEn:'A circle (360°) is divided into 360 degrees. Each degree = 60 minutes. Each minute = 60 seconds. This system measures star positions in the sky.',
   object3d:'zodiacRing'},

  {id:'zodiac', layer:3, name:'גלגל המזלות', nameEn:'Zodiac Belt',
   ref:'11:7',
   explain:'גלגל המזלות הוא רצועה דמיונית בשמיים שדרכה עוברים השמש והירח. הוא מחולק ל-12 חלקים שווים (מזלות), כל אחד 30 מעלות.',
   explainEn:'The zodiac belt is an imaginary band in the sky through which the sun and moon travel. It\'s divided into 12 equal signs, each 30 degrees.',
   object3d:'zodiacRing'},

  {id:'zodiacSigns', layer:3, name:'12 המזלות', nameEn:'12 Zodiac Signs',
   ref:'11:7',
   explain:'טלה, שור, תאומים, סרטן, אריה, בתולה, מאזניים, עקרב, קשת, גדי, דלי, דגים. השמש עוברת מזל אחד כל חודש. מיקום השמש במזלות קובע את העונה.',
   explainEn:'Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces. The sun passes one sign per month.',
   object3d:'zodiacRing'},

  {id:'meanSun', layer:3, name:'שמש אמצעית', nameEn:'Mean Sun',
   ref:'12:1',
   explain:'השמש האמצעית היא מיקום תיאורטי — איפה השמש הייתה אילו נעה במהירות קבועה של 0°59\'8" ביום. זו נקודת ההתחלה לחישוב המיקום האמיתי.',
   explainEn:'The mean sun is a theoretical position — where the sun would be if it moved at a constant speed of 0°59\'8" per day. It\'s the starting point for calculating the true position.',
   object3d:'sun'},

  {id:'dailyMotion', layer:3, name:'מהלך יומי של השמש', nameEn:'Sun\'s Daily Motion',
   ref:'12:1',
   explain:'השמש זזה כ-1 מעלה ביום (בדיוק: 0° 59\' 8\"). לכן לוקח לה 365 ימים לעשות סיבוב שלם של 360° בגלגל המזלות.',
   explainEn:'The sun moves about 1 degree per day (exactly 0° 59\' 8"). This is why it takes 365 days to complete a full 360° circuit through the zodiac.',
   object3d:'sun'},

  {id:'apogee', layer:3, name:'גובה השמש (אפוגיאום)', nameEn:'Sun\'s Apogee',
   ref:'12:1',
   explain:'הנקודה על המסלול שבה השמש הכי רחוקה מכדור הארץ. באזור הזה השמש נראית זזה לאט יותר. האפוגיאום עצמו זז מעלה אחת כל 70 שנה.',
   explainEn:'The point on the orbit where the sun is farthest from Earth. Near this point, the sun appears to move slower. The apogee itself shifts 1 degree every 70 years.',
   object3d:'sun'},

  {id:'deferent', layer:3, name:'גלגל נושא', nameEn:'Deferent Circle',
   ref:'11:13',
   explain:'לפי המודל של הרמב"ם (תלמי), השמש והירח לא סובבים ישירות סביב הארץ. הם סובבים על עיגול קטן (אפיציקל) שהמרכז שלו סובב על עיגול גדול — הגלגל הנושא.',
   explainEn:'In the Rambam\'s (Ptolemaic) model, the sun and moon don\'t orbit Earth directly. They move on a small circle (epicycle) whose center orbits on a large circle — the deferent.',
   object3d:'deferent'},

  {id:'epicycle', layer:3, name:'גלגל יוצא מן המרכז (אפיציקל)', nameEn:'Epicycle',
   ref:'11:13',
   explain:'עיגול קטן שעליו נע הכוכב בפועל. המרכז של האפיציקל סובב על הגלגל הנושא. השילוב של שני התנועות יוצר מסלול שנראה לא-אחיד מכדור הארץ.',
   explainEn:'A small circle on which the celestial body actually moves. The epicycle\'s center orbits on the deferent. The combination creates apparently non-uniform motion as seen from Earth.',
   object3d:'epicycle'},

  {id:'sunEquation', layer:3, name:'תיקון השמש', nameEn:'Sun\'s Equation',
   ref:'13:4',
   explain:'ההפרש בין המיקום האמצעי לאמיתי של השמש. כשהשמש קרובה לאפוגיאום היא זזה לאט (תיקון חיובי), וכשרחוקה ממנו היא זזה מהר (תיקון שלילי). מקסימום: כ-2°.',
   explainEn:'The difference between the sun\'s mean and true positions. Near apogee the sun moves slowly (positive correction), far from it moves fast (negative). Maximum: about 2°.',
   object3d:'sun'},

  {id:'trueSun', layer:3, name:'שמש אמיתית', nameEn:'True Sun',
   ref:'13:9',
   explain:'המיקום האמיתי של השמש = שמש אמצעית + תיקון. זה המיקום שאנחנו באמת רואים בשמיים.',
   explainEn:'The sun\'s true position = mean sun + equation. This is where we actually see the sun in the sky.',
   object3d:'sun'},

  {id:'meanMoon', layer:3, name:'ירח אמצעי', nameEn:'Mean Moon',
   ref:'14:1',
   explain:'מיקום תיאורטי של הירח אם היה נע בקצב קבוע של 13° 10\' 35\" ביום. הירח הרבה יותר מהיר מהשמש! (13° לעומת 1° ביום).',
   explainEn:'A theoretical moon position if it moved at a constant 13° 10\' 35" per day. The moon is much faster than the sun! (13° vs 1° per day).',
   object3d:'moon'},

  {id:'anomaly', layer:3, name:'מנת חריגה (אנומליה)', nameEn:'Anomaly',
   ref:'14:1',
   explain:'המרחק הזוויתי של הירח מנקודת האפוגיאום שלו על האפיציקל. מנת החריגה משתנה ב-13° 3\' 54\" ביום וקובעת כמה גדול התיקון.',
   explainEn:'The angular distance of the moon from its apogee on the epicycle. The anomaly changes by 13° 3\' 54" per day and determines the size of the correction.',
   object3d:'epicycle'},

  {id:'moonEquation', layer:3, name:'תיקון הירח', nameEn:'Moon\'s Equation',
   ref:'15:6',
   explain:'ההפרש בין המיקום האמצעי לאמיתי של הירח. נקבע לפי טבלת 18 ערכים (כל 10 מעלות). מקסימום: כ-5° 8\' כשהאנומליה = 90°.',
   explainEn:'The difference between the moon\'s mean and true positions. Determined by a table of 18 values (every 10°). Maximum: about 5° 8\' when anomaly = 90°.',
   object3d:'moon'},

  {id:'trueMoon', layer:3, name:'ירח אמיתי', nameEn:'True Moon',
   ref:'15:3',
   explain:'המיקום האמיתי של הירח = ירח אמצעי ± תיקון. אם מנת החריגה 0°-180° — מחסירים. אם 180°-360° — מוסיפים.',
   explainEn:'The moon\'s true position = mean moon ± equation. If anomaly is 0°-180° — subtract. If 180°-360° — add.',
   object3d:'moon'},

  /* ─── Layer 4: Moon Visibility (Ch 16-19) ─── */
  {id:'ascendingNode', layer:4, name:'ראש התלי', nameEn:'Ascending Node',
   ref:'16:1',
   explain:'הנקודה שבה מסלול הירח חוצה את גלגל המזלות מדרום לצפון. הירח לא נע בדיוק על גלגל המזלות — הוא נוטה 5° צפונה ודרומה.',
   explainEn:'The point where the moon\'s orbit crosses the zodiac belt from south to north. The moon doesn\'t travel exactly on the zodiac — it tilts 5° north and south.',
   object3d:'ascNode'},

  {id:'descendingNode', layer:4, name:'זנב התלי', nameEn:'Descending Node',
   ref:'16:1',
   explain:'הנקודה הנגדית — שבה הירח חוצה את גלגל המזלות מצפון לדרום. ראש התלי וזנב התלי תמיד מנוגדים (180° הפרש) ונעים לאחור 0° 3\' 11\" ביום.',
   explainEn:'The opposite point — where the moon crosses the zodiac from north to south. The ascending and descending nodes are always opposite (180° apart) and move retrograde 0° 3\' 11" per day.',
   object3d:'descNode'},

  {id:'moonLatitude', layer:4, name:'רוחב הירח', nameEn:'Moon\'s Latitude',
   ref:'16:7',
   explain:'המרחק של הירח מעל או מתחת לגלגל המזלות. מקסימום 5° צפון או דרום. ברגע שהירח בדיוק על גלגל המזלות (רוחב = 0°) — אפשר שיהיה ליקוי!',
   explainEn:'The moon\'s distance above or below the zodiac belt. Maximum 5° north or south. When the moon is exactly on the zodiac (latitude = 0°) — an eclipse can occur!',
   object3d:'moonOrbitPlane'},

  {id:'parallax', layer:4, name:'פרלקס', nameEn:'Parallax',
   ref:'17:1',
   explain:'ההבדל בין המיקום שנראה מאדם שעומד על פני הארץ לבין המיקום שנראה ממרכז הארץ. כמו שאצבע מורמת נראית זזה כשסוגרים עין אחת — ככה הירח "זז" בגלל המיקום שלנו.',
   explainEn:'The difference between the moon\'s position as seen from Earth\'s surface vs. its center. Like a raised finger appearing to shift when you close one eye — the moon "shifts" because of our position.',
   object3d:'earth'},

  {id:'elongation', layer:4, name:'מרחק (הפרש אורך)', nameEn:'Elongation',
   ref:'15:1',
   explain:'הזווית בין השמש לירח כפי שנראית מכדור הארץ. כשהמרחק = 0° זה מולד (חידוש). כשהמרחק גדל, רואים יותר מהירח מואר. מרחק 180° = ירח מלא.',
   explainEn:'The angle between sun and moon as seen from Earth. At 0° it\'s conjunction (new moon). As it grows, more of the moon is lit. At 180° = full moon.',
   object3d:'elongationArc'},

  {id:'arcOfVision', layer:4, name:'קשת ראייה', nameEn:'Arc of Vision',
   ref:'17:15',
   explain:'הזווית בין הירח לאופק ברגע שקיעת השמש. צריך מינימום של כ-9°-14° כדי לראות את הסהר בעין. פחות מ-9° = בלתי נראה. יותר מ-14° = נראה בוודאות.',
   explainEn:'The angle between the moon and the horizon at sunset. A minimum of about 9°-14° is needed to see the crescent with the naked eye. Less than 9° = invisible. More than 14° = definitely visible.',
   object3d:'horizon'},

  {id:'crescentHorns', layer:4, name:'כיוון קרני הסהר', nameEn:'Crescent Horn Direction',
   ref:'19:12',
   explain:'הקרניים (הקצוות) של הסהר תמיד מצביעות הרחק מהשמש. לפי מיקום השמש והירח, הקרניים יכולות להצביע למעלה, לצד, או באלכסון.',
   explainEn:'The horns (tips) of the crescent always point away from the sun. Depending on the positions of sun and moon, the horns can point up, sideways, or diagonally.',
   object3d:'moon'},

  {id:'eclipticTilt', layer:4, name:'נטיית גלגל המזלות', nameEn:'Ecliptic Tilt',
   ref:'19:2',
   explain:'גלגל המזלות (נתיב השמש) נוטה 23.5° ביחס לקו המשווה השמימי. נטייה זו גורמת לעונות ומשפיעה על הגובה שבו הסהר נראה באופק.',
   explainEn:'The zodiac (sun\'s path) tilts 23.5° relative to the celestial equator. This tilt causes the seasons and affects how high the crescent appears above the horizon.',
   object3d:'zodiacRing'},

  {id:'interpolation', layer:3, name:'אינטרפולציה', nameEn:'Interpolation',
   ref:'13:8',
   explain:'שיטה לחשב ערך שנמצא בין שני ערכים בטבלה. למשל, אם בטבלה יש תיקון ל-50° ול-60°, ואנחנו צריכים 55° — לוקחים את הממוצע.',
   explainEn:'A method to compute a value between two table entries. E.g., if the table gives corrections for 50° and 60° and we need 55° — we take the average.',
   object3d:'zodiacRing'}
];

/* Layer metadata */
window.OBS_LAYERS = [
  {id:1, name:'כדור הארץ והירח', nameEn:'Earth & Moon', color:'#87CEEB',
   chapters:'א-ה', desc:'יסודות: חודש לבנה, מולד, פאזות, שנת חמה ולבנה'},
  {id:2, name:'חשבון המולד', nameEn:'Molad Calculations', color:'#f4d03f',
   chapters:'ו-י', desc:'חלקים, מחזור 19, דחיות, חודשים מלאים וחסרים'},
  {id:3, name:'מסלולי שמש וירח', nameEn:'Solar & Lunar Orbits', color:'#ff9933',
   chapters:'יא-טו', desc:'מעלות, מזלות, אמצעי ואמיתי, אפיציקל, תיקונים'},
  {id:4, name:'ראיית הירח', nameEn:'Moon Visibility', color:'#34d399',
   chapters:'טז-יט', desc:'תלי, רוחב, פרלקס, קשת ראייה, כיוון הסהר'}
];

/* Category icons for the concept panel */
window.OBS_LAYER_ICONS = {1:'🌍', 2:'🔢', 3:'☀️', 4:'🔭'};
