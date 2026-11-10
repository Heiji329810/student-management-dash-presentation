#!/usr/bin/env python3
"""Rebuild the portable HTML deck, screenshot gallery and editable PowerPoint."""
from pathlib import Path
import json, re, shutil, html, hashlib, argparse
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--gallery', type=Path, help='Optional replacement screenshot gallery with index.md')
parser.add_argument('--workflow', type=Path, help='Optional directory for missing supporting screenshots')
args=parser.parse_args()
GALLERY=args.gallery or ROOT/'assets/screenshots'
WORKFLOW=args.workflow or ROOT/'assets/screenshots'
(ROOT/'verification').mkdir(exist_ok=True)
ASSETS=ROOT/'assets/screenshots'; ASSETS.mkdir(parents=True,exist_ok=True)
CROPS=ROOT/'assets/details'; CROPS.mkdir(parents=True,exist_ok=True)
slides=json.loads((ROOT/'slides.json').read_text())
rows=[]
index_path=GALLERY/'index.md' if args.gallery else ROOT/'assets/gallery-index.md'
index=index_path.read_text() if index_path.exists() else ''
if not index: raise FileNotFoundError('A gallery index is required; see assets/gallery-index.md')
for line in index.splitlines():
    cells=[x.strip().strip('`') for x in line.strip().strip('|').split('|')]
    if cells and re.search(r'\d+.*\.png',cells[0]):
        name=re.search(r'[\w-]+\.png',cells[0]).group()
        rows.append({'file':name,'title':cells[1] if len(cells)>1 else name,'role':cells[2] if len(cells)>2 else '','route':cells[3] if len(cells)>3 else ''})
overrides=json.loads((ROOT/'screenshot-labels.json').read_text()) if (ROOT/'screenshot-labels.json').exists() else {}
for r in rows:
    correction=overrides.get(r['file'])
    source=GALLERY/r['file']
    if correction and source.exists() and hashlib.sha256(source.read_bytes()).hexdigest()==correction['sha256']:
        r['title']=correction['title']
known={r['file'] for r in rows}
for p in sorted(GALLERY.glob('*.png')) if args.gallery else []:
    if p.name not in known: rows.append({'file':p.name,'title':p.stem[3:].replace('-',' ').title(),'role':'','route':''})
for r in rows:
    if (GALLERY/r['file']).exists() and (GALLERY/r['file']).resolve() != (ASSETS/r['file']).resolve(): shutil.copy2(GALLERY/r['file'],ASSETS/r['file'])
# Resolve semantic references against gallery filenames as the capture set grows.
queries={
 '22-member-rate-club.png':['rate','rating'],
 '23-teacher-dashboard.png':['teacher-dashboard','teacher-home'],
 '25-teacher-official-events.png':['teacher-official-events','official-event'],
 '26-teacher-student-council.png':['teacher-student-council','teacher-council','council-current'],
}
for s in slides:
    if 'image' not in s: continue
    name=s['image']
    if name in queries:
        matches=[r['file'] for q in queries[name] for r in rows if q in r['file']]
        if matches: name=matches[0]
    if not (ASSETS/name).exists():
        source=WORKFLOW/name
        if not source.exists(): source=WORKFLOW/s.get('fallback','__missing__')
        if not source.exists(): raise FileNotFoundError(f'Missing screenshot for {s["title"]}: {name}')
        name=source.name; shutil.copy2(source,ASSETS/name)
    s['image']='assets/screenshots/'+name
    im=Image.open(ROOT/s['image']).convert('RGB')
    # Preserve screen width and focus the top visible page region on narrative slides.
    crop_h=min(im.height,round(im.width/1.58))
    detail=CROPS/(Path(name).stem+'.jpg')
    im.crop((0,0,im.width,crop_h)).save(detail,quality=94)
    s['detail']=str(detail.relative_to(ROOT))
for r in rows:
    slides.append({'type':'gallery','chapter':'APPENDIX / PAGE GALLERY','title':r['title'],'subtitle':r['role'], 'image':'assets/screenshots/'+r['file'],'route':r['route'],'note':f"Captured page: {r['title']}. Role: {r['role']}. Full screenshot included in assets/screenshots. Fictional local fixture data."})
(ROOT/'assets/gallery-index.md').write_text(index)
(ROOT/'presentation-data.json').write_text(json.dumps(slides,ensure_ascii=False,indent=2))
E=lambda s:html.escape(str(s))

def cards_html(s):
    return '<div class="cards">'+''.join('<article><span class="card-number">%02d</span><h3>%s</h3><p>%s</p></article>'%(i+1,E(c[0]),E(c[1])) for i,c in enumerate(s['cards']))+'</div>'
def slide_html(s,i):
    typ=s['type']; h=f'<section class="slide {"card-slide" if typ == "cards" else typ}" id="slide-{i+1}" aria-label="Slide {i+1}: {E(s["title"])}"><div class="eyebrow">{E(s["chapter"])}</div>'
    h+=f'<h1>{E(s["title"]).replace(chr(10),"<br>")}</h1>'
    if s.get('subtitle'):h+=f'<p class="subtitle">{E(s["subtitle"])}</p>'
    if typ=='cover':
        h+=f'<p class="cover-body">{E(s["body"])}</p><div class="cover-pills"><span>Students</span><span>Club owners</span><span>Teachers</span></div><a class="hero-screen" href="{E(s["image"])}" target="_blank"><img src="{E(s["image"])}" alt="Student dashboard screenshot"></a><div class="cover-date">PROJECT WALKTHROUGH / NOVEMBER 2026</div>'
    elif typ in ['cards','scope']:
        h+=cards_html(s)
    elif typ=='workflow':
        h+='<div class="steps">'+''.join(f'<article><span>{E(a)}</span><h3>{E(b)}</h3><p>{E(c)}</p></article>' for a,b,c in s['steps'])+'</div>'
    elif typ=='screen':
        h+=f'<div class="screen-layout"><div class="screen-copy"><span class="tag">{E(s["tag"])}</span><ul>'+''.join(f'<li>{E(p)}</li>' for p in s['points'])+f'</ul><p class="image-hint">Select the image to open the complete page.</p></div><a class="screen-frame" href="{E(s["image"])}" target="_blank" aria-label="Open full screenshot"><div class="frame-bar"><i></i><i></i><i></i><span>ACTUAL APPLICATION / DEMO DATA</span></div><img src="{E(s["detail"])}" alt="{E(s["tag"])} screenshot"></a></div>'
    elif typ=='architecture':
        h+='<div class="architecture-grid">'+''.join(f'<article><span class="path">{E(c[0])}</span><h3>{E(c[1])}</h3><p>{E(c[2])}</p></article>' for c in s['cards'])+'</div><div class="data-flow">Browser <span>→</span> Authenticated API <span>→</span> Validated command <span>→</span> Database transaction</div>'
    elif typ=='end': h+=f'<p class="end-body">{E(s["body"])}</p><div class="end-mark">CC<span>STUDENT MANAGEMENT<br>PROJECT PRESENTATION</span></div>'
    elif typ=='gallery':
        h+=f'<a class="gallery-frame" href="{E(s["image"])}" target="_blank"><img src="{E(s["image"])}" alt="{E(s["title"])} full page screenshot"></a><p class="gallery-caption">{E(s.get("route",""))} <span>Open image for full resolution • Fictional demonstration data</span></p>'
    if s.get('takeaway'): h+=f'<div class="takeaway">{E(s["takeaway"])}</div>'
    h+=f'<div class="slide-footer"><span>CC / STUDENT MANAGEMENT DASHBOARD</span><span>{i+1:02d} / {len(slides):02d}</span></div></section>'
    return h
body='\n'.join(slide_html(s,i) for i,s in enumerate(slides))
toc=''.join(f'<option value="{i}">{i+1:02d} · {E(s["title"].replace(chr(10)," "))}</option>' for i,s in enumerate(slides))
page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CC · Student Management Dashboard</title><link rel="icon" href="data:,"><link rel="stylesheet" href="styles.css"></head><body><a class="skip-link" href="#deck">Skip to slides</a><main id="deck">{body}</main><div class="control-dock"><button id="controls-toggle" class="corner-toggle" aria-label="Presentation controls. Press question mark for shortcuts." aria-controls="presentation-menu" aria-expanded="false" title="Presentation controls (?)"><span aria-hidden="true">•••</span></button><nav id="presentation-menu" class="controls" aria-label="Presentation controls" hidden><div class="menu-heading"><strong>Presentation controls</strong><button id="controls-close" aria-label="Close controls">×</button></div><select id="jump" aria-label="Choose slide">{toc}</select><button id="prev" aria-label="Previous slide">← Previous</button><button id="next" aria-label="Next slide">Next →</button><button id="playback" aria-pressed="false" title="Play or pause slideshow (P)">Play slideshow</button><label class="interval-label" for="interval">Seconds per slide<input id="interval" type="number" min="3" max="120" step="1" value="12"></label><p id="playback-status" class="playback-status" role="status" aria-live="polite">Slideshow paused</p><button id="overview" title="Show all slides (O)">Overview</button><button id="fullscreen" title="Full screen (F)">Full screen</button><button id="print" title="Print or save as PDF">Print</button><a href="CC-Student-Management.pptx" download>PowerPoint ↗</a><p class="shortcut-help"><kbd>←</kbd> <kbd>→</kbd> or <kbd>Space</kbd> to move · <kbd>P</kbd> play / pause · <kbd>F</kbd> full screen · <kbd>O</kbd> overview · <kbd>?</kbd> controls · <kbd>Esc</kbd> close</p></nav></div><script src="presentation.js"></script></body></html>'''
(ROOT/'index.html').write_text(page)
gallery=''.join(f'<a href="assets/screenshots/{E(r["file"])}" target="_blank"><img loading="lazy" src="assets/screenshots/{E(r["file"])}" alt="{E(r["title"])}"><h2>{E(r["title"])}</h2><p>{E(r["role"])}</p></a>' for r in rows)
(ROOT/'gallery.html').write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CC · Page gallery</title><link rel="icon" href="data:,"><link rel="stylesheet" href="styles.css"></head><body class="gallery-page"><header><p class="eyebrow">CC / SCREENSHOT GALLERY</p><h1>Every captured page.</h1><p>{len(rows)} page and role views · Fictional demonstration data · <a href="index.html">Open presentation →</a></p></header><main class="gallery-grid">{gallery}</main></body></html>')

# PowerPoint: real editable shapes and text; screenshots are embedded raster images.
prs=Presentation();prs.slide_width=Inches(13.333);prs.slide_height=Inches(7.5)
BG='182A2C'; INK='182A2C'; MUTED='BFD2CC'; GREEN='D7E9AD'; LIME='D7E9AD'; WHITE='FFFFFF'; LINE='456254'; CARD='263E41'; SCREEN='102122'
def rect(sl,x,y,w,h,color,line=None,radius=False):
    sh=sl.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h));sh.fill.solid();sh.fill.fore_color.rgb=RGBColor.from_string(color);sh.line.fill.background() if not line else None
    if line:sh.line.color.rgb=RGBColor.from_string(line)
    if radius:
        try:sh.adjustments[0]=0.08
        except:pass
    return sh

def text(sl,txt,x,y,w,h,size=20,color=INK,bold=False,font='Liberation Sans'):
    box=sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h));tf=box.text_frame;tf.clear();tf.word_wrap=True
    tf.margin_left=0;tf.margin_right=0;tf.margin_top=0;tf.margin_bottom=0
    for i,line in enumerate(txt.split('\n')):
        p=tf.paragraphs[0] if i==0 else tf.add_paragraph();p.text=line;p.font.name=font;p.font.size=Pt(size);p.font.bold=bold;p.font.color.rgb=RGBColor.from_string(color);p.space_after=Pt(8)
    return box

def picture(sl,file,x,y,w,h,contain=True):
    iw,ih=Image.open(file).size;scale=min(w/iw,h/ih);dw=iw*scale;dh=ih*scale
    return sl.shapes.add_picture(str(file), Inches(x+(w-dw)/2), Inches(y+(h-dh)/2), width=Inches(dw),height=Inches(dh))

for i,s in enumerate(slides):
    sl=prs.slides.add_slide(prs.slide_layouts[6]);sl.background.fill.solid();sl.background.fill.fore_color.rgb=RGBColor.from_string(BG)
    typ=s['type']; is_cover=typ=='cover'; is_end=typ=='end'
    if is_cover or is_end:
        rect(sl,0,0,13.333,7.5,INK); color=WHITE
    else:color=WHITE
    text(sl,s['chapter'],.6,.38,11.8,.3,11,LIME if is_cover or is_end else GREEN,True)
    text(sl,s['title'],.6,.88,12.1,1.6 if is_cover or is_end else .65,46 if is_cover or is_end else 30,color,True)
    if s.get('subtitle'):text(sl,s['subtitle'],.62,2.78 if is_cover or is_end else 1.65,11.9,.65,20 if is_cover or is_end else 15,LIME if is_cover or is_end else MUTED)
    if typ=='cover':
        text(sl,s['body'],.64,3.55,4.25,1.25,23,WHITE)
        text(sl,'STUDENTS\nCLUB OWNERS\nTEACHERS',.65,5.2,3.5,1.1,14,LIME,True)
        rect(sl,5.25,2.65,7.45,4.15,WHITE,radius=True);picture(sl,ROOT/s['detail'],5.33,2.73,7.29,3.99)
    elif typ in ['cards','scope']:
        count=len(s['cards']);gap=.22;w=(12.13-gap*(count-1))/count
        for j,c in enumerate(s['cards']):
            x=.6+j*(w+gap);rect(sl,x,2.68,w,3.18,CARD,radius=True);text(sl,f'{j+1:02d}',x+.25,2.92,w-.5,.45,25,GREEN,True);text(sl,c[0],x+.25,3.53,w-.5,.65,22,WHITE,True);text(sl,c[1],x+.25,4.28,w-.5,1.35,17,MUTED)
    elif typ=='workflow':
        for j,(n,a,b) in enumerate(s['steps']):
            x=.6+j*2.45;rect(sl,x,2.9,2.25,2.72,CARD,radius=True);text(sl,n,x+.2,3.12,1.8,.6,34,GREEN,True);text(sl,a,x+.2,4.02,1.85,.45,21,WHITE,True);text(sl,b,x+.2,4.65,1.85,.75,17,MUTED)
    elif typ=='screen':
        text(sl,s['tag'],.62,2.55,3.45,.65,12,GREEN,True)
        for j,p in enumerate(s['points']):
            rect(sl,.64,3.35+j*.9,.07,.38,GREEN);text(sl,p,.87,3.28+j*.9,3.12,.8,17,WHITE)
        rect(sl,4.38,2.48,8.35,4.13,SCREEN,line=LINE,radius=True);picture(sl,ROOT/s['detail'],4.48,2.58,8.15,3.93)
        text(sl,'ACTUAL APPLICATION · FICTIONAL DEMO DATA',4.43,6.7,8.2,.22,9,MUTED)
    elif typ=='architecture':
        for j,c in enumerate(s['cards']):
            x=.6+(j%2)*6.17;y=2.45+(j//2)*1.58;rect(sl,x,y,5.95,1.38,CARD,radius=True);text(sl,c[0],x+.22,y+.14,5.5,.25,11,GREEN,True);text(sl,c[1],x+.22,y+.49,5.5,.35,21,WHITE,True);text(sl,c[2],x+.22,y+.94,5.5,.32,14,MUTED)
        text(sl,'Browser  →  Authenticated API  →  Validated command  →  Database transaction',.65,5.94,12,.4,16,GREEN,True)
    elif typ=='end':
        text(sl,s['body'],.65,3.65,9.3,1.25,26,WHITE);text(sl,'CC',.65,5.3,2,1.1,52,LIME,True);text(sl,'STUDENT MANAGEMENT\nPROJECT PRESENTATION',2.6,5.49,7,.8,16,WHITE)
    elif typ=='gallery':
        rect(sl,.6,2.28,12.13,4.56,SCREEN,line=LINE,radius=True);picture(sl,ROOT/s['image'],.68,2.36,11.97,4.40)
        text(sl,'FULL PAGE CAPTURE · FICTIONAL DATA · ORIGINAL IMAGE INCLUDED IN PROJECT ASSETS',.65,6.87,12,.2,8,MUTED)
    if s.get('takeaway'):
        text(sl,s['takeaway'],.65,6.45,12,.55,15,LIME if is_end else GREEN,True)
    rect(sl,.6,7.12,12.13,.012,LINE if not (is_cover or is_end) else GREEN)
    text(sl,'CC / STUDENT MANAGEMENT DASHBOARD',.6,7.23,10,.2,8,MUTED if not (is_cover or is_end) else LIME)
    text(sl,f'{i+1:02d} / {len(slides):02d}',11.98,7.22,.8,.2,9,MUTED if not (is_cover or is_end) else LIME)
    sl.notes_slide.notes_text_frame.text=s.get('note','')
prs.core_properties.title='CC — Student Management Dashboard';prs.core_properties.subject='A walkthrough of students, club owners and teachers';prs.core_properties.author='CC project';prs.core_properties.keywords='Student management, clubs, activities, attendance, journals'
prs.save(ROOT/'CC-Student-Management.pptx')
report={'core_slides':20,'appendix_slides':len(rows),'total_slides':len(slides),'gallery_screenshots':len(rows),'unique_embedded_screenshots':len({s['image'] for s in slides if 'image' in s}),'source_gallery':'assets/gallery-index.md' if not args.gallery else str(GALLERY),'date':'2026-11-10'}
(ROOT/'verification/build-summary.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
