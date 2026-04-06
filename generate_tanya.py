import json, os, re, sys, io, urllib.request
import fitz
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

base = r'C:\Users\chano\Google Drive Streaming\My Drive\Files - Online - Drive\Rambam_KH'
tanya_dir = os.path.join(base, 'tanya')

TC = '#2d6a4f'
TBG = '#f0f7f4'
TSBG = '#d8f3dc'

iso_map = {chr(i): chr(0x05D0 + i - 0xE0) for i in range(0xE0, 0xFB)}

# ── Fetch nikud Tanya from Sefaria ──
def fetch_sefaria(ch):
    ref = f'Tanya%2C%20Part%20I%3B%20Likkutei%20Amarim.{ch}'
    url = f'https://www.sefaria.org/api/v3/texts/{ref}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode('utf-8'))
    for v in data.get('versions', []):
        if v.get('language') == 'he':
            return [re.sub(r'<[^>]+>', '', p).strip() for p in v.get('text', [])]
    return []

print('Fetching nikud Tanya from Sefaria...')
ch41 = fetch_sefaria(41)
ch42 = fetch_sefaria(42)
print(f'  Ch 41: {len(ch41)} paragraphs, Ch 42: {len(ch42)} paragraphs')

# ── Smart biur extraction from PDF ──
def extract_biur_from_pages(doc, page_indices):
    """Extract clean biur text by collecting consecutive Hebrew lines."""
    all_lines = []
    for pi in page_indices:
        text = doc[pi].get_text()
        all_lines.extend(text.split('\n'))

    # Classify each line
    skip_patterns = ['מתוך הספר', 'שיעורים בספר', 'מורה שיעור', 'עד עמ',
                     'תניא יומי', 'לימוד תניא', 'כיון שלימוד', 'אדמו"ר',
                     'אגרות קודש', 'המנהג הטוב', 'משיחת ש"פ', 'התוועדויות',
                     'ימוי אינת', 'ברכות מ']

    paragraphs = []
    current_lines = []

    for line in all_lines:
        s = line.strip()
        if not s or len(s) < 4:
            continue

        # Check if garbled
        garbled = sum(1 for c in s if c in iso_map) > 2
        # Check if mostly nikud marks or special chars
        special = sum(1 for c in s if c in '§©¨¥¦¤Ÿ£') > len(s) * 0.3
        # Check Hebrew content
        hebrew = sum(1 for c in s if '\u0590' <= c <= '\u05FF')

        is_clean = not garbled and not special and hebrew > 5 and len(s) > 6
        is_skip = any(p in s for p in skip_patterns)

        if is_clean and not is_skip:
            # Clean the line
            s = re.sub(r'[ÙÎÏÂÊÓËàáâãäåæçèéêëìíîïðñòóôõöøùú§©¨¥¦¤Ÿ£÷â\$]+', '', s)
            s = re.sub(r'\s+', ' ', s).strip()
            if len(s) > 5:
                current_lines.append(s)
        else:
            # Gap in clean text — flush current paragraph
            if current_lines:
                joined = ' '.join(current_lines)
                if len(joined) > 20:
                    paragraphs.append(joined)
                current_lines = []

    # Flush remaining
    if current_lines:
        joined = ' '.join(current_lines)
        if len(joined) > 20:
            paragraphs.append(joined)

    # Remove day name prefixes and clean
    cleaned = []
    for p in paragraphs:
        p = re.sub(r'^[\d\s]*[א-ת]{2,6}\s+םוי.*?ניסן\s*', '', p)
        p = re.sub(r'^(יום\s+(ראשון|שני|שלישי|רביעי|חמישי|שישי)|שבת\s+קודש)\s+\S+\s+ניסן\s*', '', p)
        p = p.strip()
        if len(p) > 20:
            cleaned.append(p)
    return cleaned

# ── Load PDFs ──
small_doc = fitz.open(r'C:\Users\chano\Downloads\תניא - שמיני.pdf')
big_doc = fitz.open(r'C:\Users\chano\Downloads\tanya_original.pdf')

# ── Day configuration ──
# (pdf_pages, sefaria_chapter, para_start, para_end, day_name, date, perek, topic, summary)
days_config = [
    ([88, 89], big_doc, 'ch41', 4, 7,
     'יום ראשון', 'י"ח ניסן', 'פרק מא',
     'התבוננות לפני תורה ומצוות',
     'רבנו הזקן מסביר שלפני לימוד תורה וקיום מצוות, על היהודי להתבונן כיצד אור אין־סוף ברוך־הוא, הרצון העליון, מלובש באותיות התורה ובמצוות שהוא עומד לקיים — בציצית, בתפילין ובתורה.'),
    ([90, 91], big_doc, 'ch41', 7, 15,
     'יום שני', 'י"ט ניסן', 'פרק מא',
     'יראה ואהבה כשני כנפיים',
     'גם מי שאינו מרגיש יראה גלויה בלבו, עליו לקבל עול מלכות שמים במחשבתו. יראה ואהבה הן כשני כנפיים — בלי שתיהן אי אפשר לפרוח. הכוונה בתורה ומצוות צריכה לכלול גם יראה וגם אהבה.'),
    ([0], small_doc, 'ch41', 15, 18,
     'יום שלישי', 'כ\' ניסן', 'פרק מא',
     'לשם יחוד — לא להוציא עצמו מן הכלל',
     'אמרו חז"ל: "לעולם אל יוציא אדם עצמו מן הכלל." לכן יכוון לייחד ולדבק מקור נפשו ונפשות כל ישראל באור אין־סוף — זהו פירוש "לשם יחוד קודשא בריך הוא ושכינתיה בשם כל ישראל."'),
    ([1, 2], small_doc, 'ch41', 18, 21,
     'יום רביעי', 'כ"א ניסן', 'פרק מא',
     'המתקת הגבורות והכוונה האמיתית',
     'ההגהה מסבירה שעל ידי לימוד תורה וקיום מצוות, הגבורות נמתקות בחסדים. גם אם כוונת היחוד אינה אמיתית לגמרי, מכיוון שיש בה קצת מן האמת — שהרי כל יהודי רוצה לקיים רצון ה\' — בל ימנע מלכוון כוונה זו.'),
    ([3], small_doc, 'ch41', 21, 24,
     'יום חמישי', 'כ"ב ניסן', 'פרק מא',
     'יחוד הנפש ומסירות נפש בתורה ותפילה',
     'יחוד הנפש באור ה\' הוא רצון כל יהודי מישראל באמת לאמיתו, מהאהבה הטבעית המסותרת בלב. עסק התורה והתפילה הוא עצמו מסירות נפש ממש — כמו הנשמה בגן עדן, שכולה נתונה באותיות התורה והתפילה.'),
    ([4], small_doc, 'ch41', 24, 28,
     'יום שישי', 'כ"ג ניסן', 'פרק מא',
     'הכנת מסירות נפש וכוונה בכל שעה',
     'בהכנת מסירות נפש זו יתחיל ברכות השחר ולימוד התורה. גם באמצע היום, לפני כל שיעור, יש להתבונן בהכנה זו. בכל שעה נמשכת חיות חדשה מעולמות עליונים, וכוונת מסירות הנפש היא להעלות ניצוצות קדושה למקורם.'),
    ([5, 6, 7], small_doc, 'ch42', 0, 5,
     'שבת קודש', 'כ"ד ניסן', 'פרק מב',
     'יראת ה\' ומשה רבינו בכל דור',
     'פרק מ"ב מסביר את מאמר הגמרא: "מילתא זוטרתי — לגבי משה, אין." כל נפש מישראל יש בה ניצוץ ממשה רבינו. בכל דור יורדים ניצוצותיו ומתלבשים בחכמי הדור, ללמד דעת את העם לעבוד ה\' בלב ובנפש.'),
]

# ── Generate HTML ──
def gen_page(idx, cfg, total):
    pages, doc, ch_name, ps, pe, day_name, date_heb, perek, topic, summary = cfg
    ch = ch41 if ch_name == 'ch41' else ch42
    nikud_paras = ch[ps:pe]
    biur_paras = extract_biur_from_pages(doc, pages)

    # Distribute biur among tanya paragraphs
    n = len(nikud_paras)
    bp = max(1, len(biur_paras) // n) if n else len(biur_paras)

    # Build interleaved sections
    secs_html = ''
    for si, tanya_p in enumerate(nikud_paras):
        bs = si * bp
        be = bs + bp if si < n - 1 else len(biur_paras)
        biur_slice = biur_paras[bs:be]
        biur_h = ''.join(f'<div style="padding:9px 8px 2px;font-size:14px;line-height:2;color:#555">{p}</div>' for p in biur_slice)

        secs_html += f'''
<div style="margin-top:14px">
<div style="background:{TSBG};border-radius:8px;border-right:4px solid {TC};padding:12px 14px">
<div style="font-size:16px;line-height:2.1;color:#1a1a1a">{tanya_p}</div>
</div>
{biur_h}
</div>'''

    nav_prev = f'<a href="tanya_shmini_{idx:02d}.html" style="color:#1a5a8a;text-decoration:none;font-size:13px;padding:6px 10px;border:1px solid #ddd;border-radius:8px">→ הקודם</a>' if idx > 1 else ''
    nav_next = f'<a href="tanya_shmini_{idx+2:02d}.html" style="color:#1a5a8a;text-decoration:none;font-size:13px;padding:6px 10px;border:1px solid #ddd;border-radius:8px">הבא ←</a>' if idx < total - 1 else ''

    return f'''<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap" rel="stylesheet">
<script src="../shared/js/topbar.js"></script>
<title>תניא יומי · {day_name} {date_heb}</title>
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
<h1 style="font-size:22px;font-weight:700;color:#1a1a1a;margin:2px 0">תניא יומי · {day_name} {date_heb}</h1>
<div style="font-size:13px;color:{TC};margin-bottom:6px;font-weight:700">{perek}</div>
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
<span style="font-size:11px;color:#999;font-weight:700">{perek}</span>
<span style="font-size:14px;font-weight:700;flex:1;color:#222">{topic}</span>
<span id="arrow0" style="color:#bbb;transition:transform 0.15s;font-size:13px">▾</span>
</div>
</button>
<div id="content0" style="display:none;background:{TBG};border:1px solid #e8e8e8;border-top:none;border-radius:0 0 10px 10px;padding:8px 12px 16px">
{secs_html}
</div>
</div>

</div>
<div style="text-align:center;padding:20px 10px 30px;font-size:12px;color:#bbb">
<div style="margin-bottom:8px">
{nav_next}
<a href="index.html" style="color:#1a5a8a;text-decoration:none;font-size:12px;padding:5px 10px;border:1px solid #ddd;border-radius:8px;margin:0 4px">כל השיעורים</a>
{nav_prev}
</div>
טקסט מנוקד מ-Sefaria (CC-BY-NC) · ביאור מבוסס על &quot;שיעורים בספר התניא&quot;
</div>
<script>
function toggle(i){{let c=document.getElementById('content'+i),a=document.getElementById('arrow'+i),b=c.parentElement.querySelector('button');if(c.style.display==='none'){{c.style.display='block';a.style.transform='rotate(180deg)';b.style.borderRadius='10px 10px 0 0';b.style.boxShadow='none'}}else{{c.style.display='none';a.style.transform='';b.style.borderRadius='10px';b.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'}}}}
</script>
</body>
</html>'''

# ── Generate all pages ──
for i, cfg in enumerate(days_config):
    html = gen_page(i, cfg, len(days_config))
    fn = f'tanya_shmini_{i+1:02d}.html'
    with open(os.path.join(tanya_dir, fn), 'w', encoding='utf-8') as f:
        f.write(html)
    pages, doc, ch_name, ps, pe, dn, dh, *_ = cfg
    ch = ch41 if ch_name == 'ch41' else ch42
    biur = extract_biur_from_pages(doc, pages)
    print(f'{fn}: {dn} {dh} — {pe-ps} tanya paras, {len(biur)} biur paras')

print('\nDone!')
