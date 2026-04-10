/* observatory-halacha.js – Halacha-by-halacha mode for chapters 11-15 */

(function(){
'use strict';

const HEB_CH = {11:'יא',12:'יב',13:'יג',14:'יד',15:'טו',16:'טז',17:'יז',18:'יח',19:'יט'};

/* ══════════════════════════════════════════
   45 Halachot — Chapters 11-15
   Each with simple Hebrew + English summary
   ══════════════════════════════════════════ */

const HALACHA_STEPS = [

  /* ── Chapter 11: Foundations of Astronomy (17 halachot) ── */

  {ch:11,hal:1, camera:'overview',
   title:'למה לומדים חשבונות אלה?',
   titleEn:'Why Learn These Calculations?',
   summary:'בזמן בית המקדש, בית הדין היה צריך לחשב בדיוק מתי הירח ייראה בשמיים — כדי לקדש את החודש. עכשיו נלמד את כל שלבי החישוב הזה.',
   summaryEn:'When the Temple stood, the court needed to calculate exactly when the moon would be visible — to sanctify the month. Now we\'ll learn every step of that calculation.'},

  {ch:11,hal:2, camera:'overview',
   title:'שיטות שונות',
   titleEn:'Different Methods',
   summary:'יש הרבה שיטות חישוב בין חכמי ישראל וחכמי העולם. הרמב"ם בוחר את השיטה שנראית לו הכי מדויקת ומוכחת.',
   summaryEn:'There are many calculation methods among Jewish and world scholars. The Rambam chooses the method he considers most accurate and proven.'},

  {ch:11,hal:3, camera:'overview',
   title:'החישובים משתפרים',
   titleEn:'Calculations Improve Over Time',
   summary:'עם הזמן, בזכות תצפיות רבות וחקירות מדויקות, נמצאו שיטות חישוב טובות יותר. הרמב"ם משתמש בשיטות הכי עדכניות שהיו בזמנו.',
   summaryEn:'Over time, thanks to many observations and precise investigations, better calculation methods were found. The Rambam uses the most up-to-date methods of his time.'},

  {ch:11,hal:4, camera:'overview',
   title:'למה ללמוד גם היום?',
   titleEn:'Why Learn Even Today?',
   summary:'גם שהיום לא מקדשים חודשים על פי ראיית הירח, חשוב ללמוד את החישובים האלה — הם חלק מהתורה, ומי שיכול להבין אותם חייב לעסוק בהם.',
   summaryEn:'Even though today we don\'t sanctify months by sighting the moon, it\'s important to learn these calculations — they are part of Torah, and anyone who can understand them must study them.'},

  {ch:11,hal:5, camera:'overview',
   title:'החישובים הם קירוב',
   titleEn:'Calculations Are Approximations',
   summary:'אם תמצא הפרש קטן בין החישוב למציאות — זה נורמלי! כל חישוב מתמטי הוא קירוב. עם הזמן הפערים הקטנים מצטברים, אבל זו לא טעות.',
   summaryEn:'If you find a small difference between the calculation and reality — that\'s normal! Every math model is an approximation. Over time small gaps accumulate, but that\'s not an error.'},

  {ch:11,hal:6, camera:'zodiacWide', vizMode:'degreeLabels',
   title:'מערכת המעלות — 360°',
   titleEn:'The Degree System — 360°',
   summary:'כל עיגול מחולק ל-360 מעלות (°).\nכל מעלה = 60 דקות (׳) — אלה לא דקות של זמן!\nכל דקה = 60 שניות (״).\n\nזו השפה שבה מודדים מיקום בשמיים. כמו שעון, אבל במקום 12 — יש 360.',
   summaryEn:'Every circle is divided into 360 degrees (°).\nEach degree = 60 minutes (′) — not time minutes!\nEach minute = 60 seconds (″).\n\nThis is the language for measuring positions in the sky. Like a clock, but instead of 12, there are 360.'},

  {ch:11,hal:7, camera:'zodiacWide', vizMode:'zodiacLabels', playing:true, speed:1,
   title:'12 המזלות — כל אחד 30°',
   titleEn:'12 Zodiac Signs — 30° Each',
   summary:'גלגל המזלות מחולק ל-12 חלקים שווים:\nטלה, שור, תאומים, סרטן, אריה, בתולה, מאזניים, עקרב, קשת, גדי, דלי, דגים.\n\nכל מזל = 30 מעלות. 12 × 30 = 360° — עיגול שלם!',
   summaryEn:'The zodiac belt is divided into 12 equal parts:\nAries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.\n\nEach sign = 30 degrees. 12 × 30 = 360° — a full circle!'},

  {ch:11,hal:8, camera:'zodiacWide',
   title:'איך מוצאים באיזה מזל?',
   titleEn:'How to Find Which Sign?',
   summary:'יש לך מספר מעלות? חלק ב-30!\n\nדוגמה: 200° ÷ 30 = 6 מזלות שלמים, נשאר 20°.\nאז הכוכב נמצא ב-20° של המזל ה-7 (מאזניים).',
   summaryEn:'Got a degree number? Divide by 30!\n\nExample: 200° ÷ 30 = 6 complete signs, 20° left.\nSo the star is at 20° of the 7th sign (Libra).'},

  {ch:11,hal:9, camera:'zodiacWide',
   title:'עוד דוגמה — המרת מעלות',
   titleEn:'Another Example — Converting Degrees',
   summary:'אם מיקום כוכב הוא 320°:\n320 ÷ 30 = 10 מזלות שלמים, נשאר 20°.\nהכוכב ב-20° של המזל ה-11 (דלי).\n\nפשוט — מחלקים ב-30 וסופרים!',
   summaryEn:'If a star\'s position is 320°:\n320 ÷ 30 = 10 complete signs, 20° left.\nThe star is at 20° of the 11th sign (Aquarius).\n\nSimple — divide by 30 and count!'},

  {ch:11,hal:10, camera:'overview',
   title:'חיבור מעלות ודקות',
   titleEn:'Adding Degrees and Minutes',
   summary:'כשמחברים שני מספרי מעלות:\n• מחברים דקות לדקות, מעלות למעלות\n• אם הדקות עולות על 60 → מוסיפים מעלה\n• אם המעלות עולות על 360 → מתחילים מחדש (סיבוב שלם!)',
   summaryEn:'When adding two degree numbers:\n• Add minutes to minutes, degrees to degrees\n• If minutes exceed 60 → carry 1 degree\n• If degrees exceed 360 → start over (full rotation!)'},

  {ch:11,hal:11, camera:'overview',
   title:'חיסור מעלות ודקות',
   titleEn:'Subtracting Degrees and Minutes',
   summary:'כשמחסירים ואין מספיק דקות? לוקחים מעלה אחת = 60 דקות ומוסיפים.\nאין מספיק מעלות? מוסיפים 360 (סיבוב שלם) ואז מחסירים.\n\nבדיוק כמו "לשבור" שטר גדול למטבעות קטנות.',
   summaryEn:'Subtracting and not enough minutes? Take 1 degree = 60 minutes and add.\nNot enough degrees? Add 360 (full rotation) then subtract.\n\nJust like "breaking" a big bill into small coins.'},

  {ch:11,hal:12, camera:'overview',
   title:'דוגמת חישוב — חיסור',
   titleEn:'Calculation Example — Subtraction',
   summary:'צריך לחסר 200°50\' מ-100°30\'?\n\nשלב 1: 100° < 200° → מוסיפים 360° → 460°30\'\nשלב 2: 460°30\' - 200°50\' → 30\' < 50\' → לוקחים מעלה → 459°90\' - 200°50\' = 259°40\'',
   summaryEn:'Need to subtract 200°50\' from 100°30\'?\n\nStep 1: 100° < 200° → add 360° → 460°30\'\nStep 2: 460°30\' - 200°50\' → 30\' < 50\' → borrow 1° → 459°90\' - 200°50\' = 259°40\''},

  {ch:11,hal:13, camera:'sunOrbit', vizMode:'epicycleExplain', playing:true, speed:2,
   title:'גלגל קטן וגלגל גדול',
   titleEn:'Small Wheel and Big Wheel',
   summary:'השמש והירח לא נעים בעיגול פשוט סביב הארץ!\n\nהם נעים על גלגל קטן, שהמרכז שלו נע על גלגל גדול.\n\nכשהכוכב בצד הפנימי — הוא קרוב לארץ ונראה מהיר.\nבצד החיצוני — רחוק ונראה איטי.\n\nלכן התנועה נראית לא-אחידה!',
   summaryEn:'The sun and moon don\'t move in a simple circle around Earth!\n\nThey move on a small wheel, whose center moves on a big wheel.\n\nWhen the body is on the inner side — it\'s closer to Earth and appears fast.\nOn the outer side — far and appears slow.\n\nThat\'s why the motion looks non-uniform!'},

  {ch:11,hal:14, camera:'sunOrbit', playing:true, speed:2,
   title:'מהלך אמצעי = מהירות ממוצעת',
   titleEn:'Mean Motion = Average Speed',
   summary:'"מהלך אמצעי" = כמה הכוכב היה זז אם היה נע בקצב קבוע.\nזה לא המיקום האמיתי — זה רק נקודת התחלה לחישוב.\n\nכמו ממוצע ציונים — לא כל ציון זהה, אבל הממוצע נותן תמונה כללית.',
   summaryEn:'"Mean motion" = how much the body would move if it traveled at constant speed.\nThis isn\'t the true position — just a starting point for calculation.\n\nLike a grade average — not every grade is the same, but the average gives a general picture.'},

  {ch:11,hal:15, camera:'sunOrbit',
   title:'התיקון — ההפרש בין אמצעי לאמיתי',
   titleEn:'The Correction — Difference Between Mean and True',
   summary:'ההפרש בין המיקום האמצעי (תיאורטי) לאמיתי (בפועל) נקרא "מנת המסלול" — התיקון.\n\nלפעמים המיקום האמיתי מקדים את הממוצע (+)\nולפעמים מפגר אחריו (-)\nתלוי איפה הכוכב על הגלגל הקטן.',
   summaryEn:'The difference between the mean (theoretical) and true (actual) position is called the "correction."\n\nSometimes the true position is ahead of the average (+)\nand sometimes behind it (-)\ndepending on where the body is on the small wheel.'},

  {ch:11,hal:16, camera:'overview',
   title:'ירושלים = מרכז החישוב',
   titleEn:'Jerusalem = Calculation Center',
   summary:'כל החישובים בפרקים הבאים נעשים עבור ירושלים — 32° צפון, 35° מזרח.\n\nירושלים נחשבת למרכז העולם לצורך חישובי קידוש החודש.',
   summaryEn:'All calculations in the following chapters are done for Jerusalem — 32° North, 35° East.\n\nJerusalem is considered the center of the world for Kiddush HaChodesh calculations.'},

  {ch:11,hal:17, camera:'overview',
   title:'חישוב למקומות אחרים',
   titleEn:'Calculating for Other Locations',
   summary:'רוצה לחשב למקום אחר? כל מעלת אורך (מזרח-מערב) = כ-4 דקות זמן.\n\nמקום מזרחית לירושלים רואה את הירח מוקדם יותר.\nמערבית — מאוחר יותר.',
   summaryEn:'Want to calculate for another location? Each degree of longitude = about 4 minutes of time.\n\nPlaces east of Jerusalem see the moon earlier.\nWest — later.'},

  /* ── Chapter 12: Mean Sun (2 halachot) ── */

  {ch:12,hal:1, camera:'sunOrbit', vizMode:'sunDailyMotion', playing:true, speed:2,
   title:'השמש זזה 59 דקות ביום',
   titleEn:'The Sun Moves 59 Minutes Per Day',
   summary:'המהלך האמצעי של השמש = 0° 59\' 8" ביום (כמעט מעלה שלמה!).\n\nהרמב"ם נותן טבלאות מוכנות:\n• ב-10 ימים: 9° 51\' 23"\n• ב-100 ימים: 98° 33\' 53"\n• בשנה רגילה: 348° 55\' 15"\n\nככה חוסכים חישובים — פשוט מחברים!',
   summaryEn:'The sun\'s mean daily motion = 0° 59\' 8" (almost a full degree!).\n\nThe Rambam provides ready tables:\n• In 10 days: 9° 51\' 23"\n• In 100 days: 98° 33\' 53"\n• In a regular year: 348° 55\' 15"\n\nThis saves calculations — just add up!'},

  {ch:12,hal:2, camera:'sunOrbit',
   title:'נקודת הגובה של השמש',
   titleEn:'The Sun\'s High Point (Apogee)',
   summary:'לשמש יש נקודה במסלול שבה היא הכי רחוקה מהארץ — "הגובה" (אפוגיאום).\n\nנקודה זו זזה לאט מאוד — מעלה אחת בערך כל 70 שנה!\n\nבזמן הבסיס של הרמב"ם, הגובה היה ב-86° 45\' (סוף מזל תאומים).',
   summaryEn:'The sun has a point in its orbit where it\'s farthest from Earth — the "high point" (apogee).\n\nThis point moves very slowly — about 1 degree every 70 years!\n\nIn the Rambam\'s reference time, the apogee was at 86° 45\' (end of Gemini).'},

  /* ── Chapter 13: True Sun (11 halachot) ── */

  {ch:13,hal:1, camera:'sunOrbit',
   title:'איך מוצאים את מיקום השמש האמיתי?',
   titleEn:'How to Find the Sun\'s True Position?',
   summary:'שלוש צעדים:\n① מחשבים את המהלך האמצעי (מפרק 12)\n② מחשבים את מיקום הגובה\n③ מחסירים: אמצעי - גובה = "מנת המסלול"\n\nמנת המסלול אומרת לנו כמה להוסיף או לחסר מהממוצע.',
   summaryEn:'Three steps:\n① Calculate the mean motion (from chapter 12)\n② Calculate the apogee position\n③ Subtract: mean - apogee = "course portion"\n\nThe course portion tells us how much to add or subtract from the average.'},

  {ch:13,hal:2, camera:'sunOrbit', vizMode:'equationArrow',
   title:'הכלל: מתי מוסיפים ומתי מחסירים?',
   titleEn:'The Rule: When to Add, When to Subtract?',
   summary:'מנת המסלול < 180° → מחסירים את התיקון\n(השמש "מאחורי" הממוצע — היא בחצי הרחוק מהארץ, זזה לאט)\n\nמנת המסלול > 180° → מוסיפים את התיקון\n(השמש "מקדימה" את הממוצע — היא בחצי הקרוב, זזה מהר)',
   summaryEn:'Course portion < 180° → subtract the correction\n(Sun is "behind" the average — in the far half, moving slowly)\n\nCourse portion > 180° → add the correction\n(Sun is "ahead" of the average — in the near half, moving fast)'},

  {ch:13,hal:3, camera:'sunOrbit',
   title:'מתי אין תיקון בכלל?',
   titleEn:'When Is There No Correction at All?',
   summary:'כשמנת המסלול = 0° או 180° — אין תיקון!\nהמיקום האמיתי = המיקום האמצעי.\n\nלמה? כי בנקודות האלה, הגלגל הקטן והגלגל הגדול "מתלכדים" — אין הפרש.',
   summaryEn:'When the course portion = 0° or 180° — no correction!\nTrue position = mean position.\n\nWhy? At those points, the small wheel and big wheel "align" — no difference.'},

  {ch:13,hal:4, camera:'sunOrbit',
   title:'טבלת תיקוני השמש',
   titleEn:'Sun Correction Table',
   summary:'הרמב"ם נותן טבלה של 18 ערכים (כל 10°):\n\n10° → 0° 20\'  |  60° → 1° 59\'\n20° → 0° 40\'  |  70° → 2° 5\'\n30° → 0° 58\'  |  80° → 2° 8\'\n40° → 1° 15\'  |  90° → 2° 5\'\n50° → 1° 29\'  |  שיא: ~2° 8\' ב-80°',
   summaryEn:'The Rambam gives a table of 18 values (every 10°):\n\n10° → 0° 20\'  |  60° → 1° 59\'\n20° → 0° 40\'  |  70° → 2° 5\'\n30° → 0° 58\'  |  80° → 2° 8\'\n40° → 1° 15\'  |  90° → 2° 5\'\n50° → 1° 29\'  |  Peak: ~2° 8\' at 80°'},

  {ch:13,hal:5, camera:'sunOrbit',
   title:'מנה מעל 180° — איך משתמשים בטבלה?',
   titleEn:'Portion Above 180° — How to Use the Table?',
   summary:'הטבלה מגיעה רק עד 180°. אז מה עושים כשהמנה גדולה מ-180°?\n\nפשוט: גורעים מ-360°!\nדוגמה: מנה = 300° → 360 - 300 = 60° → מחפשים 60° בטבלה.',
   summaryEn:'The table only goes up to 180°. So what do we do when the portion is over 180°?\n\nSimple: subtract from 360°!\nExample: portion = 300° → 360 - 300 = 60° → look up 60° in the table.'},

  {ch:13,hal:6, camera:'sunOrbit',
   title:'דוגמה — מנה 300°',
   titleEn:'Example — Portion of 300°',
   summary:'מנת המסלול = 300°\nשלב 1: 300° > 180° → גורעים: 360° - 300° = 60°\nשלב 2: מוצאים בטבלה: 60° → תיקון = 1° 59\'\nשלב 3: כי 300° > 180° → מוסיפים!\n\nשמש אמיתית = שמש אמצעית + 1° 59\'',
   summaryEn:'Course portion = 300°\nStep 1: 300° > 180° → subtract: 360° - 300° = 60°\nStep 2: Find in table: 60° → correction = 1° 59\'\nStep 3: Since 300° > 180° → add!\n\nTrue sun = Mean sun + 1° 59\''},

  {ch:13,hal:7, camera:'sunOrbit',
   title:'מה כשהמנה בין שני ערכים?',
   titleEn:'What If the Portion Is Between Two Values?',
   summary:'הטבלה נותנת ערכים כל 10°. מה אם המנה היא 65°?\n\n65° נמצא בין 60° (תיקון: 1° 59\') ל-70° (תיקון: 2° 5\').\nצריך "אינטרפולציה" — לחשב את הערך באמצע.',
   summaryEn:'The table gives values every 10°. What if the portion is 65°?\n\n65° is between 60° (correction: 1° 59\') and 70° (correction: 2° 5\').\nWe need "interpolation" — calculate the in-between value.'},

  {ch:13,hal:8, camera:'overview',
   title:'אינטרפולציה — חישוב בין שני ערכים',
   titleEn:'Interpolation — Calculating Between Two Values',
   summary:'איך מחשבים ערך שנמצא בין שני ערכים בטבלה?\n\n① מוצאים את ההפרש בין שני התיקונים\n② בודקים כמה "רחוק" המנה מהערך הנמוך (מתוך 10°)\n③ לוקחים את החלק היחסי מההפרש\n\nדוגמה: 65° = חצי הדרך בין 60° ל-70° → לוקחים חצי מההפרש.',
   summaryEn:'How to calculate a value between two table entries?\n\n① Find the difference between the two corrections\n② Check how "far" the portion is from the lower value (out of 10°)\n③ Take the proportional part of the difference\n\nExample: 65° = halfway between 60° and 70° → take half the difference.'},

  {ch:13,hal:9, camera:'sunOrbit',
   title:'דוגמה מלאה — חישוב שמש אמיתית',
   titleEn:'Full Example — True Sun Calculation',
   summary:'נניח:\n• שמש אמצעית = 60°\n• גובה השמש = 86°\n• מנת מסלול = 360° - (86° - 60°) = 334°\n• 334° > 180° → 360° - 334° = 26°\n• בטבלה: 26° → תיקון ≈ 0° 52\'\n• מוסיפים (כי > 180°): 60° + 0° 52\' = 60° 52\'\n\nשמש אמיתית = 60° 52\' (שור, 0° 52\')',
   summaryEn:'Suppose:\n• Mean sun = 60°\n• Sun apogee = 86°\n• Course = 360° - (86° - 60°) = 334°\n• 334° > 180° → 360° - 334° = 26°\n• Table: 26° → correction ≈ 0° 52\'\n• Add (since > 180°): 60° + 0° 52\' = 60° 52\'\n\nTrue sun = 60° 52\' (Taurus, 0° 52\')'},

  {ch:13,hal:10, camera:'sunOrbit',
   title:'מיקום השמש = מיקום אמיתי',
   titleEn:'Sun Position = True Position',
   summary:'אחרי שחישבנו את המהלך האמצעי ואת התיקון — סוף סוף יש לנו את המיקום האמיתי של השמש!\n\nזה המיקום שבאמת רואים בשמיים.',
   summaryEn:'After calculating the mean motion and the correction — we finally have the sun\'s true position!\n\nThis is where you actually see it in the sky.'},

  {ch:13,hal:11, camera:'sunOrbit', playing:true, speed:5,
   title:'תקופת האמת — מתי באמת שוויון יום?',
   titleEn:'True Equinox — When Is Day Really Equal?',
   summary:'שוויון יום = הרגע שהשמש מגיעה בדיוק ל-0° (תחילת טלה = אביב) או 180° (תחילת מאזניים = סתיו).\n\nהתקופה האמיתית יכולה להיות עד יומיים לפני או אחרי התקופה הממוצעת!',
   summaryEn:'Equinox = the moment the sun reaches exactly 0° (start of Aries = spring) or 180° (start of Libra = fall).\n\nThe true equinox can be up to 2 days before or after the average equinox!'},

  /* ── Chapter 14: Mean Moon (6 halachot) ── */

  {ch:14,hal:1, camera:'moonClose', vizMode:'dualSpeed', playing:true, speed:3,
   title:'הירח — שני גלגלים, 13° ביום',
   titleEn:'The Moon — Two Wheels, 13° Per Day',
   summary:'לירח יש גלגל גדול (סביב הארץ) וגלגל קטן (כמו השמש).\n\nהירח מהיר בהרבה מהשמש:\nירח: 13° 10\' 35" ביום\nשמש: 0° 59\' 8" ביום\n\nהירח מהיר פי 13!',
   summaryEn:'The moon has a big wheel (around Earth) and a small wheel (like the sun).\n\nThe moon is much faster than the sun:\nMoon: 13° 10\' 35" per day\nSun: 0° 59\' 8" per day\n\nThe moon is 13× faster!'},

  {ch:14,hal:2, camera:'moonClose',
   title:'טבלאות מהלך הירח',
   titleEn:'Moon Motion Tables',
   summary:'כמו בשמש, הרמב"ם נותן טבלאות מוכנות:\n• 10 ימים: 131° 45\' 50"\n• 100 ימים: 237° 38\' 23"\n• 29 ימים (חודש): 22° 6\' 56"\n\nכדי לחשב — מחברים את השאריות המתאימות.',
   summaryEn:'Like the sun, the Rambam provides ready tables:\n• 10 days: 131° 45\' 50"\n• 100 days: 237° 38\' 23"\n• 29 days (month): 22° 6\' 56"\n\nTo calculate — add the appropriate remainders.'},

  {ch:14,hal:3, camera:'moonClose', vizMode:'moonEpicycle',
   title:'מנת החריגה — מיקום על הגלגל הקטן',
   titleEn:'Anomaly — Position on the Small Wheel',
   summary:'מנת החריגה (אנומליה) = מיקום הירח על הגלגל הקטן שלו.\nהיא זזה 13° 3\' 54" ביום.\n\nזה מה שקובע כמה לתקן את המיקום הממוצע — כלומר כמה גדול ההפרש בין "אמצעי" ל"אמיתי".',
   summaryEn:'The anomaly = the moon\'s position on its small wheel.\nIt moves 13° 3\' 54" per day.\n\nThis determines how much to correct the mean position — i.e., how big the difference between "mean" and "true."'},

  {ch:14,hal:4, camera:'moonClose',
   title:'שאריות מנת החריגה',
   titleEn:'Anomaly Remainders',
   summary:'גם למנת החריגה יש טבלאות מוכנות:\n• 10 ימים: 130° 39\' 0"\n• 100 ימים: 226° 29\' 53"\n• 29 ימים: 18° 53\' 4"\n• שנה רגילה: 305° 0\' 13"\n\nאותו עקרון: לוקחים שורש ידוע ומוסיפים.',
   summaryEn:'The anomaly also has ready tables:\n• 10 days: 130° 39\' 0"\n• 100 days: 226° 29\' 53"\n• 29 days: 18° 53\' 4"\n• Regular year: 305° 0\' 13"\n\nSame principle: take a known root and add.'},

  {ch:14,hal:5, camera:'moonClose',
   title:'תיקון עונתי — לפי מיקום השמש',
   titleEn:'Seasonal Correction — By Sun Position',
   summary:'יש תיקון מיוחד לירח שתלוי באיזה מזל השמש נמצאת.\n\nכשהשמש בחלק מסוים של המזלות, הירח נראה קצת שונה ממה שהממוצע מראה — ומתקנים בהתאם.',
   summaryEn:'There\'s a special moon correction depending on which zodiac sign the sun is in.\n\nWhen the sun is in certain parts of the zodiac, the moon appears slightly different from what the average shows — and we correct accordingly.'},

  {ch:14,hal:6, camera:'horizon',
   title:'שעת הצפייה — 20 דקות אחרי שקיעה',
   titleEn:'Observation Time — 20 Minutes After Sunset',
   summary:'כל החישובים שלנו הם עבור רגע מסוים: כ-20 דקות אחרי שקיעת השמש בארץ ישראל.\n\nלמה? כי זה הרגע שבו בודקים אם הירח החדש נראה לעין. לא לפני ולא אחרי.',
   summaryEn:'All our calculations are for a specific moment: about 20 minutes after sunset in the Land of Israel.\n\nWhy? Because that\'s when they check if the new moon is visible. Not before and not after.'},

  /* ── Chapter 15: True Moon (9 halachot) ── */

  {ch:15,hal:1, camera:'overview', vizMode:'elongationExplain', playing:true, speed:2,
   title:'כפל המרחק — למה כופלים?',
   titleEn:'Double Elongation — Why Multiply?',
   summary:'כדי למצוא את מיקום הירח האמיתי, קודם מחשבים את "כפל המרחק":\n\nכפל המרחק = (ירח אמצעי - שמש אמצעית) × 2\n\nלמה כופלים? כי הירח נע על גלגל קטן, וההשפעה של המרחק מהשמש על התיקון היא כפולה.',
   summaryEn:'To find the moon\'s true position, first calculate the "double elongation":\n\nDouble elongation = (mean moon - mean sun) × 2\n\nWhy double? Because the moon moves on a small wheel, and the sun\'s distance effect on the correction is doubled.'},

  {ch:15,hal:2, camera:'overview',
   title:'החישוב הזה — רק לראיית הסהר',
   titleEn:'This Calculation — Only for Crescent Sighting',
   summary:'חשוב להבין: כל החישובים האלה מותאמים למטרה אחת בלבד — לדעת אם הסהר ייראה.\n\nזה לא חישוב אסטרונומי כללי — זה כלי הלכתי מעשי.',
   summaryEn:'Important to understand: all these calculations are tailored for one purpose only — to know if the crescent will be visible.\n\nThis isn\'t general astronomy — it\'s a practical halachic tool.'},

  {ch:15,hal:3, camera:'moonClose',
   title:'תיקון ראשון — לפי כפל המרחק',
   titleEn:'First Correction — By Double Elongation',
   summary:'לוקחים את כפל המרחק ומחפשים בטבלה:\nאם < 180° → מחסירים מהמסלול\nאם > 180° → מוסיפים\n\nהתוצאה = "מסלול נכון" — עדיין לא סופי!',
   summaryEn:'Take the double elongation and look up in the table:\nIf < 180° → subtract from the course\nIf > 180° → add\n\nResult = "corrected course" — still not final!'},

  {ch:15,hal:4, camera:'moonClose', vizMode:'equationArrowMoon',
   title:'תיקון שני — לפי האנומליה',
   titleEn:'Second Correction — By Anomaly',
   summary:'עכשיו לוקחים את המסלול הנכון (אחרי תיקון 1) ומוצאים בטבלה את התיקון השני.\n\nאם המסלול < 180° → מחסירים\nאם > 180° → מוסיפים\n\nוסוף סוף מקבלים את מיקום הירח האמיתי!',
   summaryEn:'Now take the corrected course (after correction 1) and find the second correction in the table.\n\nIf course < 180° → subtract\nIf > 180° → add\n\nAnd finally we get the moon\'s true position!'},

  {ch:15,hal:5, camera:'moonClose',
   title:'מתי אין תיקון שני?',
   titleEn:'When Is There No Second Correction?',
   summary:'כמו בשמש — אם המסלול הנכון = 0° או 180°, אין תיקון.\n\nהמיקום האמיתי = המיקום הממוצע המתוקן (אחרי תיקון 1 בלבד).',
   summaryEn:'Like the sun — if the corrected course = 0° or 180°, there\'s no correction.\n\nTrue position = the corrected mean position (after correction 1 only).'},

  {ch:15,hal:6, camera:'moonClose',
   title:'טבלת תיקוני הירח',
   titleEn:'Moon Correction Table',
   summary:'טבלה של 18 ערכים, כמו בשמש:\n\n10° → 0° 52\'  |  60° → 4° 20\'\n20° → 1° 43\'  |  70° → 4° 46\'\n30° → 2° 30\'  |  80° → 5° 1\'\n40° → 3° 13\'  |  90° → 5° 8\' ← שיא!\n50° → 3° 50\'  |\n\nשים לב: שיא של 5° 8\' — גדול פי 2.5 מתיקון השמש!',
   summaryEn:'A table of 18 values, like the sun:\n\n10° → 0° 52\'  |  60° → 4° 20\'\n20° → 1° 43\'  |  70° → 4° 46\'\n30° → 2° 30\'  |  80° → 5° 1\'\n40° → 3° 13\'  |  90° → 5° 8\' ← peak!\n50° → 3° 50\'  |\n\nNote: peak of 5° 8\' — 2.5× bigger than the sun\'s correction!'},

  {ch:15,hal:7, camera:'moonClose',
   title:'מסלול מעל 180°',
   titleEn:'Course Above 180°',
   summary:'אותו כלל כמו בשמש:\nאם המסלול הנכון > 180° → גורעים מ-360° ומחפשים בטבלה.\n\nדוגמה: מסלול = 252° → 360 - 252 = 108° → מחפשים 108° בטבלה.',
   summaryEn:'Same rule as the sun:\nIf corrected course > 180° → subtract from 360° and look up in table.\n\nExample: course = 252° → 360 - 252 = 108° → look up 108° in table.'},

  {ch:15,hal:8, camera:'moonClose',
   title:'דוגמה מלאה — מיקום הירח האמיתי',
   titleEn:'Full Example — Moon\'s True Position',
   summary:'שלבי החישוב:\n① ירח אמצעי = X°\n② שמש אמצעית = Y°\n③ כפל מרחק = (X - Y) × 2\n④ תיקון 1 → מסלול נכון\n⑤ תיקון 2 → מיקום אמיתי!\n\nשני תיקונים — וזה הכל!',
   summaryEn:'Calculation steps:\n① Mean moon = X°\n② Mean sun = Y°\n③ Double elongation = (X - Y) × 2\n④ Correction 1 → corrected course\n⑤ Correction 2 → true position!\n\nTwo corrections — and that\'s it!'},

  {ch:15,hal:9, camera:'overview', playing:true, speed:3,
   title:'סיכום — עכשיו יודעים איפה הירח!',
   titleEn:'Summary — Now We Know Where the Moon Is!',
   summary:'אחרי שני תיקונים, יש לנו את מיקום הירח האמיתי ברגע הצפייה.\n\nעכשיו יודעים:\n✓ איפה השמש (פרק יג)\n✓ איפה הירח (פרק טו)\n\nבפרקים הבאים נלמד: האם באמת אפשר לראות את הסהר?',
   summaryEn:'After two corrections, we have the moon\'s true position at observation time.\n\nNow we know:\n✓ Where the sun is (chapter 13)\n✓ Where the moon is (chapter 15)\n\nIn the next chapters we\'ll learn: can the crescent actually be seen?'}
];

/* ══════════════════════════════════════════
   Navigation & Rendering
   ══════════════════════════════════════════ */

let currentStep = 0;

function renderHalachaCard(){
  const card = document.getElementById('halacha-card');
  if(!card || currentStep < 0 || currentStep >= HALACHA_STEPS.length) return;

  const h = HALACHA_STEPS[currentStep];
  const lang = window.obsLang || 'he';
  const isHe = lang === 'he';
  const title = isHe ? h.title : h.titleEn;
  const summary = isHe ? h.summary : h.summaryEn;
  const prevLabel = isHe ? '→ הקודם' : 'Previous →';
  const nextLabel = isHe ? 'הבא ←' : '← Next';
  const chLabel = isHe ? 'פרק' : 'Ch.';

  card.innerHTML = `
    <div class="story-card">
      <div class="story-progress" style="display:flex;justify-content:space-between;align-items:center">
        <span>${currentStep + 1} / ${HALACHA_STEPS.length}</span>
        <span style="font-size:0.65rem;color:var(--txt3)">${isHe ? 'פרקים יא-טו' : 'Chapters 11-15'}</span>
      </div>
      <div class="story-ref" style="font-size:0.9rem">${chLabel} ${HEB_CH[h.ch]}:${h.hal}</div>
      <div class="story-title">${title}</div>
      <div class="story-text">${summary.replace(/\n/g, '<br>')}</div>
      <div class="story-btns">
        ${currentStep > 0 ? `<button class="story-btn" onclick="prevHalacha()">${prevLabel}</button>` : ''}
        ${currentStep < HALACHA_STEPS.length - 1 ? `<button class="story-btn primary" onclick="nextHalacha()">${nextLabel}</button>` : ''}
      </div>
    </div>`;

  // Update chapter selector
  const sel = document.getElementById('chapterSelect');
  if(sel) sel.value = h.ch;
}

function applyStep(){
  const h = HALACHA_STEPS[currentStep];
  if(!h) return;

  // Camera
  if(h.camera && window.obsCameraPreset) obsCameraPreset(h.camera);

  // Time
  const t = window.obsTime;
  if(h.day !== undefined) t.day = h.day;
  if(h.speed !== undefined) t.speed = h.speed; else t.speed = 1;
  if(h.playing !== undefined) t.playing = h.playing; else t.playing = false;

  // VizMode
  if(h.vizMode && window.obsSetVizMode) obsSetVizMode(h.vizMode);
  else if(window.obsSetVizMode) obsSetVizMode(null);

  // Concept
  if(h.concept && window.obsSelectConcept) obsSelectConcept(h.concept);

  renderHalachaCard();
}

window.nextHalacha = function(){
  if(currentStep < HALACHA_STEPS.length - 1){
    currentStep++;
    applyStep();
  }
};

window.prevHalacha = function(){
  if(currentStep > 0){
    currentStep--;
    applyStep();
  }
};

window.jumpToChapter = function(ch){
  const idx = HALACHA_STEPS.findIndex(h => h.ch === ch);
  if(idx >= 0){
    currentStep = idx;
    applyStep();
  }
};

window.updateHalachaLang = function(){
  renderHalachaCard();
};

/* ── Build layer toggles + timeline (reuse from scene) ── */
window.buildLayerToggles = function(){
  const bar = document.getElementById('obs-layer-toggles');
  if(!bar) return;
  let html = '';
  for(const layer of OBS_LAYERS){
    html += `<button class="layer-btn active" data-layer="${layer.id}" style="--lc:${layer.color}"
              onclick="toggleLayerBtn(this, ${layer.id})">${OBS_LAYER_ICONS[layer.id]} ${layer.name}</button>`;
  }
  bar.innerHTML = html;
};

window.toggleLayerBtn = function(btn, layerId){
  const visible = obsToggleLayer(layerId);
  btn.classList.toggle('active', visible);
};

window.initTimeline = function(){
  const slider = document.getElementById('obs-time-slider');
  const playBtn = document.getElementById('obs-play-btn');
  const speedSlider = document.getElementById('obs-speed-slider');
  const speedLabel = document.getElementById('obs-speed-label');

  if(slider){
    slider.addEventListener('input', () => { window.obsTime.day = parseFloat(slider.value); });
    setInterval(() => { if(window.obsTime.playing) slider.value = window.obsTime.day % parseFloat(slider.max); }, 200);
  }
  if(playBtn){
    playBtn.addEventListener('click', () => {
      window.obsTime.playing = !window.obsTime.playing;
      playBtn.textContent = window.obsTime.playing ? '⏸' : '▶';
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

/* ── Initialize ── */
window.addEventListener('DOMContentLoaded', () => {
  buildLayerToggles();
  initTimeline();
  initObservatoryScene();

  // Start from first halacha after scene loads
  setTimeout(() => {
    currentStep = 0;
    applyStep();
  }, 800);
});

})();
