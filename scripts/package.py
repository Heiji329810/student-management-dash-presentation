#!/usr/bin/env python3
"""Package only the portable presentation and its editable source files."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
FILES = ['index.html', 'gallery.html', 'styles.css', 'presentation.js',
         'presentation-data.json', 'static-data.json', 'workflows.json', 'slides.json', 'screenshot-labels.json',
         'README.md', 'PRESENTER-NOTES.md', 'SOURCES.md', 'requirements.txt',
         'CC-Student-Management.pptx', 'CC-Student-Management.pdf',
         'verification/release-validation.json']
paths = [ROOT / name for name in FILES]
paths += sorted((ROOT / 'assets').rglob('*'))
paths += sorted((ROOT / 'scripts').glob('*.py'))
paths += sorted((ROOT / 'scripts').glob('*.js'))
archive = ROOT / 'CC-Student-Management-Presentation.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as output:
    for path in paths:
        if path.is_file():
            output.write(path, path.relative_to(ROOT))
        elif not path.exists():
            raise FileNotFoundError(path)
print(f'{archive.name}: {archive.stat().st_size:,} bytes')
