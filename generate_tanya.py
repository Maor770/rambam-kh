import json, os, re, sys, io, urllib.request
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

base = r'C:\Users\chano\Google Drive Streaming\My Drive\Files - Online - Drive\Rambam_KH'
tanya_dir = os.path.join(base, 'tanya')

# ── Colors ──
TC = '#2d6a4f'
TBG = '#f0f7f4'
TSBG = '#d8f3dc'

# ── Step 1: Fetch nikud Tanya from Sefaria ──
def fetch_sefaria(ch):
    ref = f'Tanya%2C%20Part%20I%3B%20Likkutei%20Amarim.{ch}'
    url = f'https://www.sefaria.org/api/v3/texts/{ref}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode('utf-8'))
    for v in data.get('versions', []):
        if v.get('language') == 'he':
            raw = v.get('text', [])
            cleaned = []
            for p in raw:
                t = re.sub(r'<[^>]+>', '', p)
                t = re.sub(r'\s+', ' ', t).strip()
                cleaned.append(t)
            return cleaned
    return []

print('Fetching nikud Tanya from Sefaria...')
ch41 = fetch_sefaria(41)
ch42 = fetch_sefaria(42)
print(f'  Ch 41: {len(ch41)} paragraphs, Ch 42: {len(ch42)} paragraphs')

# ── Step 2: Map each day to correct Sefaria paragraphs ──
# Based on standard Tanya Yomi calendar for 18-24 Nisan (Parshat Shmini)
# Paragraph indices are 0-based
day_paragraphs = [
    # Day 1: Sun 18 Nisan - ch41 paras 5-7 (וגם יתבונן ... ובעטיפת ציצית)
    ('ch41', 4, 7),
    # Day 2: Mon 19 Nisan - ch41 paras 8-15 (ואזי ... וזאת תהיה כוונתו)
    ('ch41', 7, 15),
    # Day 3: Tue 20 Nisan - ch41 paras 16-18 (אך אמנם ... ויתכוין להמשיך)
    ('ch41', 15, 18),
    # Day 4: Wed 21 Nisan - ch41 paras 19-21 (הגהה וגם ... כי אף שאינה)
    ('ch41', 18, 21),
    # Day 5: Thu 22 Nisan - ch41 paras 22-24 (אבל יחוד ... וזהו שתקנו)
    ('ch41', 21, 24),
    # Day 6: Fri 23 Nisan - ch41 paras 25-28 (והנה בהכנה ... והנה כוונה זו)
    ('ch41', 24, 28),
    # Day 7: Shabbat 24 Nisan - ch42 paras 1-5 (והנה במה ... וכח זה)
    ('ch42', 0, 5),
]

def get_nikud_text(ch_name, start, end):
    ch = ch41 if ch_name == 'ch41' else ch42
    paras = ch[start:end]
    return paras

# ── Step 3: Load biur from JSON ──
with open(os.path.join(base, 'tanya_data_shmini.json'), 'r', encoding='utf-8') as f:
    days_raw = json.load(f)

# ── Step 4: Clean biur text properly ──
def clean_biur(biur_list):
    """Join biur paragraphs into proper flowing paragraphs."""
    skip_words = ['ימוי אינת', 'םוי', 'תבש', 'ןושאר', 'ינש', 'ישילש',
                  'יעיבר', 'ישימח', 'ישיש', 'שדוק']
    cleaned = []
    for p in biur_list:
        # Remove day name prefix
        p = re.sub(r'^(יום\s+(ראשון|שני|שלישי|רביעי|חמישי|שישי)|שבת\s+קודש)\s+\S+\s+ניסן\s*', '', p).strip()
        # Remove garbled chars
        p = re.sub(r'[ÙÎÏÂÊÓËàáâãäåæçèéêëìíîïðñòóôõöøùúa-zA-Z§©¨¥¦¤Ÿ£÷\$]+', '', p)
        p = re.sub(r'\s+', ' ', p).strip()
        if any(sw in p for sw in skip_words):
            continue
        if len(p) > 15:
            cleaned.append(p)

    # Now merge into proper paragraphs (sentences that flow together)
    paragraphs = []
    current = ''
    for line in cleaned:
        # If line starts mid-sentence (lowercase-ish, no period before), merge
        if current and len(current) < 150:
            current += ' ' + line
        elif current and not current.rstrip().endswith('.') and not current.rstrip().endswith(':') and len(line) < 80:
            current += ' ' + line
        else:
            if current:
                paragraphs.append(current)
            current = line
    if current:
        paragraphs.append(current)

    return paragraphs

# ── Step 5: Day metadata ──
day_meta = [
    {'day_name': 'יום ראשון', 'date_heb': 'י"ח ניסן', 'perek': 'פרק מא',
     'topic': 'התבוננות לפני תורה ומצוות — הרצון העליון מלובש באותיות התורה'},
    {'day_name': 'יום שני', 'date_heb': 'י"ט ניסן', 'perek': 'פרק מא',
     'topic': 'יראה ואהבה כשני כנפיים — קבלת עול מלכות שמים לפני עבודת ה\''},
    {'day_name': 'יום שלישי', 'date_heb': 'כ\' ניסן', 'perek': 'פרק מא',
     'topic': 'לשם יחוד קודשא בריך הוא ושכינתיה — לא להוציא עצמו מן הכלל'},
    {'day_name': 'יום רביעי', 'date_heb': 'כ"א ניסן', 'perek': 'פרק מא',
     'topic': 'המתקת הגבורות בחסדים — כוונת היחוד העליון'},
    {'day_name': 'יום חמישי', 'date_heb': 'כ"ב ניסן', 'perek': 'פרק מא',
     'topic': 'יחוד הנפש באור ה\' — מסירות נפש שבתורה ותפילה'},
    {'day_name': 'יום שישי', 'date_heb': 'כ"ג ניסן', 'perek': 'פרק מא',
     'topic': 'הכנת מסירות נפש — ברכות השחר וכוונה בכל שעה'},
    {'day_name': 'שבת קודש', 'date_heb': 'כ"ד ניסן', 'perek': 'פרק מב',
     'topic': 'יראת ה\' — "מילתא זוטרתי" למשה ולניצוצותיו בכל דור'},
]

# ── Step 6: Build summaries from biur ──
day_summaries = [
    'רבנו הזקן מסביר שלפני לימוד תורה וקיום מצוות, על היהודי להתבונן כיצד אור אין־סוף ברוך־הוא, הרצון העליון, מלובש באותיות התורה ובמצוות שהוא עומד לקיים — בציצית, בתפילין ובתורה.',
    'גם מי שאינו מרגיש יראה גלויה בלבו, עליו לקבל עול מלכות שמים במחשבתו. יראה ואהבה הן כשני כנפיים — בלי שתיהן אי אפשר לפרוח. הכוונה בתורה ומצוות צריכה לכלול גם יראה וגם אהבה.',
    'אמרו חז"ל: "לעולם אל יוציא אדם עצמו מן הכלל." לכן יכוון לייחד ולדבק מקור נפשו ונפשות כל ישראל באור אין־סוף — זהו פירוש "לשם יחוד קודשא בריך הוא ושכינתיה בשם כל ישראל."',
    'ההגהה מסבירה שעל ידי לימוד תורה וקיום מצוות, הגבורות נמתקות בחסדים. גם אם כוונת היחוד אינה אמיתית לגמרי, מכיוון שיש בה קצת מן האמת — שהרי כל יהודי רוצה לקיים רצון ה\' — בל ימנע מלכוון כוונה זו.',
    'יחוד הנפש באור ה\' הוא רצון כל יהודי מישראל באמת לאמיתו, מהאהבה הטבעית המסותרת בלב. עסק התורה והתפילה הוא עצמו מסירות נפש ממש — כמו הנשמה בגן עדן, שכולה נתונה באותיות התורה.',
    'בהכנת מסירות נפש זו יתחיל ברכות השחר ולימוד התורה. גם באמצע היום, לפני כל שיעור, יש להתבונן בהכנה זו. בכל שעה נמשכת חיות חדשה מעולמות עליונים, והתורה מעלה ניצוצות קדושה למקורם.',
    'פרק מ"ב מסביר את מאמר הגמרא "מילתא זוטרתי — לגבי משה, אין." כל נפש מישראל יש בה ניצוץ ממשה רבינו, ובכל דור יורדים ניצוצותיו ומתלבשים בחכמי הדור, ללמד דעת את העם.',
]

# ── Step 7: Generate HTML ──
def gen_page(idx, meta, nikud_paras, biur, summary, total):
    d = meta
    # Join nikud paragraphs with line breaks for readability
    tanya_html = '<br><br>'.join(nikud_paras)

    # Build biur HTML
    biur_html = ''
    for p in biur:
        biur_html += f'<div style="padding:9px 8px 2px;font-size:14px;line-height:2;color:#555">{p}</div>'

    nav_prev = f'<a href="tanya_shmini_{idx:02d}.html" style="color:#1a5a8a;text-decoration:none;font-size:13px;padding:6px 10px;border:1px solid #ddd;border-radius:8px">→ הקודם</a>' if idx > 1 else ''
    nav_next = f'<a href="tanya_shmini_{idx+2:02d}.html" style="color:#1a5a8a;text-decoration:none;font-size:13px;padding:6px 10px;border:1px solid #ddd;border-radius:8px">הבא ←</a>' if idx < total - 1 else ''

    return f'''<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap" rel="stylesheet">
<script src="../shared/js/topbar.js"></script>
<title>תניא יומי · {d['day_name']} {d['date_heb']}</title>
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:'Heebo',sans-serif;background:#f5f5f0;color:#1a1a1a;min-height:100vh;-webkit-font-smoothing:antialiased}}
button{{font-family:'Heebo',sans-serif}}
button:active{{opacity:0.85}}
</style>
</head>
<body>
<div style="display:flex;justify-content:center;gap:8px;padding:8px 10px;background:#fff;border-bottom:1px solid #e8e8e8">
{nav_next}
<a href="index.html" style="color:#1a5a8a;text-decoration:none;font-size:13px;padding:6px 10px;border:1px solid #ddd;border-radius:8px">כל השיעורים</a>
{nav_prev}
</div>
<div style="background:#fff;border-bottom:1px solid #e0e0e0;padding:16px 14px 14px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.04)">
<div style="font-size:12px;color:#bbb;margin-bottom:3px">ב״ה</div>
<h1 style="font-size:22px;font-weight:700;color:#1a1a1a;margin:2px 0">תניא יומי · {d['day_name']} {d['date_heb']}</h1>
<div style="font-size:13px;color:{TC};margin-bottom:6px;font-weight:700">{d['perek']}</div>
<div style="font-size:11px;color:#1a5a8a;margin-bottom:12px">מבוסס על הספר &quot;שיעורים בספר התניא&quot;</div>
</div>
<div style="padding:10px 10px 20px;max-width:640px;margin:0 auto">

<div style="background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
<div style="font-size:13px;font-weight:700;color:{TC};margin-bottom:6px">מה בשיעור הזה?</div>
<div style="font-size:13px;line-height:1.9;color:#555">{summary}</div>
</div>

<div style="margin-bottom:6px" id="sec0">
<button onclick="toggle(0)" style="width:100%;text-align:right;cursor:pointer;background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:12px 14px;color:#1a1a1a;font-family:inherit;font-size:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.04)">
<div style="display:flex;align-items:center;gap:8px">
<span style="font-size:10px;padding:2px 8px;border-radius:6px;background:{TBG};color:{TC};font-weight:700;border:1px solid {TC}30">תניא</span>
<span style="font-size:11px;color:#999;font-weight:700">{d['perek']}</span>
<span style="font-size:14px;font-weight:700;flex:1;color:#222">{d['topic']}</span>
<span id="arrow0" style="color:#bbb;transition:transform 0.15s;font-size:13px">▾</span>
</div>
</button>
<div id="content0" style="display:none;background:{TBG};border:1px solid #e8e8e8;border-top:none;border-radius:0 0 10px 10px;padding:8px 12px 16px">
<div style="margin-top:14px">
<div style="background:{TSBG};border-radius:8px;border-right:4px solid {TC};padding:12px 14px">
<div style="font-size:16px;line-height:2.1;color:#1a1a1a">{tanya_html}</div>
</div>
{biur_html}
</div>
</div>
</div>

</div>
<div style="text-align:center;padding:20px 10px 30px;font-size:12px;color:#bbb">
<div style="margin-bottom:8px">
{nav_next}
<a href="index.html" style="color:#1a5a8a;text-decoration:none;font-size:12px;padding:5px 10px;border:1px solid #ddd;border-radius:8px;margin:0 4px">כל השיעורים</a>
{nav_prev}
</div>
מבוסס על &quot;שיעורים בספר התניא&quot; מאת הרב יוסף יצחק קלמנסון
</div>
<script>
let openSecs=new Set();
function toggle(i){{let c=document.getElementById('content'+i),a=document.getElementById('arrow'+i),b=c.parentElement.querySelector('button');if(c.style.display==='none'){{c.style.display='block';a.style.transform='rotate(180deg)';b.style.borderRadius='10px 10px 0 0';b.style.boxShadow='none';openSecs.add(i)}}else{{c.style.display='none';a.style.transform='';b.style.borderRadius='10px';b.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';openSecs.delete(i)}}}}
</script>
</body>
</html>'''

# ── Generate all pages ──
for i in range(7):
    ch_name, start, end = day_paragraphs[i]
    nikud = get_nikud_text(ch_name, start, end)
    biur = clean_biur(days_raw[i]['biur'])
    html = gen_page(i, day_meta[i], nikud, biur, day_summaries[i], 7)
    fn = f'tanya_shmini_{i+1:02d}.html'
    with open(os.path.join(tanya_dir, fn), 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Created: {fn} ({day_meta[i]["day_name"]} {day_meta[i]["date_heb"]}) — {len(nikud)} nikud paras, {len(biur)} biur paras')

print('\nAll pages created!')
