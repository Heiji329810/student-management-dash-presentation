#!/usr/bin/env python3
"""Validate local HTML references, image integrity and PowerPoint/PDF content."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from PIL import Image
import hashlib, json, re, subprocess

ROOT = Path(__file__).resolve().parents[1]
class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ('src', 'href') or not value:
                continue
            url = urlsplit(value)
            if url.scheme == 'data':
                continue
            assert not url.scheme and not url.netloc, f'External dependency: {value}'
            if url.path:
                path = ROOT / unquote(url.path)
                assert path.is_file(), f'Missing reference: {value}'

for name in ('index.html', 'gallery.html'):
    Links().feed((ROOT / name).read_text())
images = list((ROOT / 'assets').rglob('*.png')) + list((ROOT / 'assets').rglob('*.jpg'))
for path in images:
    with Image.open(path) as im:
        im.verify()
data = json.loads((ROOT / 'presentation-data.json').read_text())
assert len(data) == 62
ns = {'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
with ZipFile(ROOT / 'CC-Student-Management.pptx') as ppt:
    assert ppt.testzip() is None
    slides = [n for n in ppt.namelist() if re.fullmatch(r'ppt/slides/slide\d+.xml', n)]
    assert len(slides) == len(data)
    embedded = {hashlib.sha256(ppt.read(n)).hexdigest() for n in ppt.namelist() if n.startswith('ppt/media/')}
    originals = list((ROOT / 'assets/screenshots').glob('*.png'))
    assert len(originals) == 43
    gallery_originals = [path for path in originals if path.name != 'visible-member-cancellation-notice.png']
    for path in gallery_originals:
        assert hashlib.sha256(path.read_bytes()).hexdigest() in embedded, path.name
    for item in data:
        if item.get('image'):
            path = ROOT / item.get('detail', item['image'])
            assert hashlib.sha256(path.read_bytes()).hexdigest() in embedded, path.name
    for i, item in enumerate(data, 1):
        root = ET.fromstring(ppt.read(f'ppt/slides/slide{i}.xml'))
        assert root.find('p:cSld/p:bg/p:bgPr/a:solidFill/a:srgbClr', ns).get('val') == '182A2C'
        text = ''.join(root.itertext())
        assert item['title'].replace('\n', '') in text, item['title']
        assert f'ppt/notesSlides/notesSlide{i}.xml' in ppt.namelist()
info = subprocess.check_output(['pdfinfo', str(ROOT / 'CC-Student-Management.pdf')], text=True)
assert re.search(r'Pages:\s+62\b', info)
pdf_text = subprocess.check_output(['pdftotext', '-layout', str(ROOT / 'CC-Student-Management.pdf'), '-'], text=True)
normalize = lambda value: re.sub(r'\s+', '', value)
for item in data:
    assert normalize(item['title']) in normalize(pdf_text), item['title']
print(json.dumps({'slides':62, 'pptx_background':'#182a2c on all 62 slides',
                  'pdf_pages':62, 'matching_titles':62, 'gallery_originals_embedded':42, 'supporting_screenshot':'included as crop in PowerPoint and original in assets',
                  'valid_images':len(images), 'html_references':'all local references resolve'}, indent=2))
