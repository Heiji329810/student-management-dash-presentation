# CC — Student Management Dashboard presentation

A local, portable presentation explaining the student-management project with actual application screenshots and fictional demonstration data.

## Fresh clone: no installation needed

```bash
git clone https://github.com/Heiji329810/student-management-dash-presentation.git
cd student-management-dash-presentation
```

This repository is private; cloning requires a GitHub account with access. After cloning, double-click **index.html** in your file manager and open it in a modern browser. No npm, Python, backend, database, login, build or internet connection is needed to present the bundled deck.

For optional local HTTP serving (Python 3 only):

```bash
python3 -m http.server 5289 --bind 127.0.0.1
```

Open **http://127.0.0.1:5289/**. Stop the server with Ctrl+C.

## Automatic slideshow

Open the **•••** corner controls (or press **?**) and select **Play slideshow**. Press **P** anywhere outside an input to pause or resume. Set **Seconds per slide** to any whole number from **3 to 120**; the default is **12 seconds**. The setting applies immediately and restarts the current slide's countdown. Buttons and the interval field work with Tab, Enter/Space and the number-input arrow keys.

To start automatically, open **http://127.0.0.1:5289/?autoplay=1&interval=12** (or append `?autoplay=1&interval=12` to the local `index.html` file URL). Change `interval` to your preferred seconds; invalid values default to 12 and out-of-range values are clamped. Opening the ordinary URL starts paused. Autoplay visits the 20 narrative slides, then each of the 42 gallery captures, then repeats from slide 1. Every capture gets the configured interval. Manual narrative navigation resets the countdown; gallery swipes, navigation, keyboard browsing or focus pause playback until P or Play resumes it. A hidden/background tab suspends the timer and starts a fresh interval when visible again. Overview and printing pause playback; press P or Play to resume. Fullscreen preserves playback and requires F or the Full screen button. Browser security prevents automatic fullscreen on page load.

Controls remain hidden until hover, focus, tap or **?**. Autoplay adds no persistent toolbar. PowerPoint and PDF preserve the 20 narrative slides and add seven curated workflow contact sheets (27 pages total). The interactive HTML has 21 deck slides: 20 narrative slides plus one Swiper gallery containing all 42 captures. Static exports cannot swipe or autoplay; all originals remain in the bundle for detailed inspection. Use the supplied PDF for printing; the HTML Print control opens that static export.

## Open

- **`index.html`** — browser slide deck. Double-click to open; no build or network connection required.
- **`CC-Student-Management.pptx`** — genuine editable PowerPoint deck; screenshots are embedded, titles/body/diagrams remain editable.
- **`CC-Student-Management.pdf`** — rendered PowerPoint for easy viewing and sharing.
- **`gallery.html`** — all 42 captured page and role views at full resolution.

The browser deck has **20 narrative slides + 1 interactive gallery slide**, organized into **7 workflows / 42 screenshots**. PowerPoint and PDF have **27 slides/pages** (20 narrative + 7 contact sheets). It incorporates the full supplied gallery and one additional captured cancellation notification, for **43 unique source screenshots**. The appendix intentionally includes role-specific views, expanded forms and guard states as well as routed pages. Redirect aliases and dormant election services are documented rather than represented by invented screens.

All slides share the cover’s dark blue-teal background (`#182a2c`). The slide canvas fills the available viewport with no reserved toolbar space or gray gutters. A discreet **•••** button in the bottom-right corner reveals controls on hover, keyboard focus or tap. Press **?** to open controls and shortcut help; **Esc** closes the panel. Use **Left/Right** or **Space** to move, **O** for overview and **F** for actual deck fullscreen. The panel also contains slide selection, Print and the PowerPoint download. Browser F11 is a separate browser fullscreen command; the canvas adapts in either mode. Select a screenshot to open the uncropped original. On a phone, long slides remain vertically scrollable. PowerPoint speaker notes give presentation context and implementation qualifications.

## Narrative

1. Problem and users: student, student club owner and teacher.
2. The workflow from club proposal to participation and reflection.
3. Student discovery, club membership, activity registration and applications.
4. Owner management, attendance, journals, photos and social feedback.
5. Teacher review, official events, participation and council years.
6. Notifications, architecture, persistence and current scope.

The internal account role `founder` means **teacher**. A student club founder still has role `student`; ownership grants management access to that club. Election services are backend-only today: their legacy links redirect to Clubs and do not expose election/scoring pages.

## Edit and rebuild

Edit `slides.json` for narrative content. HTML styling and interactions live in `styles.css` and `presentation.js`. `scripts/build.py` creates HTML and PowerPoint from the same data, copies screenshots, prepares high-resolution cropped previews and builds the interactive gallery and seven static workflow contact sheets. Edit `workflows.json` for chapter order and evidence captions; every screenshot must occur exactly once. `static-data.json` describes the exported pages. Full-page originals are preserved.

```bash
python -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python scripts/build.py
```

Rebuilding uses the included screenshots and gallery index by default, so it works in a fresh clone. To deliberately import a replacement capture set, pass `--gallery /path/to/gallery --workflow /path/to/supporting/screenshots` to `scripts/build.py`. The gallery must contain `index.md`. Opening or presenting the delivered files needs neither source directory nor Python. Keep the HTML files beside `assets/`, `styles.css` and `presentation.js`; the PowerPoint/PDF files can be shared independently.

The bundled ZIP excludes the Python environment and browser session data. It includes the presentations, complete screenshot assets, source files, notes, gallery index and release validation report. Run `python3 scripts/package.py` after rebuilding the PDF to regenerate the portable ZIP. To regenerate PDF, install LibreOffice, then run `libreoffice --headless --convert-to pdf --outdir . CC-Student-Management.pptx`.

## Evidence and limits

Verified on 2026-11-10; see `verification/release-validation.json` for the current release checks. The checks cover local assets, all 42 gallery captures, preservation of the 20 narrative slides, PowerPoint/PDF page counts and exact background, desktop/fullscreen/mobile layout, keyboard/touch navigation, interaction pausing, autoplay sequencing and an offline fresh checkout. Historical validation images and browser sessions are excluded from Git and the ZIP.

These checks validate the presentation artifacts. They do **not** rerun or certify the application's tests. Application integration/browser test results belong to the original project's `docs/HANDOFF.md` and verification artifacts. No application code, databases, credentials or visible browser sessions were changed by the presentation build.

The cancellation selector is empty after the recorded cancellation workflow. Access-denied and missing-club screenshots are intentional guard examples. Fixture dates and names are demonstration content. Photos and comments are captured UI states; the presentation is not a live backend.

## Workflow gallery controls and offline dependencies

On slide 21, select a workflow in the left rail (horizontal scroll on phones), use the gallery arrow buttons, swipe, or press Left/Right, PageUp/PageDown or Space to browse captures. Home/End select the first/last capture. These keys stay inside the gallery; use the corner slide selector or Previous button to return to the narrative. Captions, roles, global capture count and chapter position update together. Every image links to its uncropped original. P, F, O and ? retain their presentation meanings. Tab reaches workflow buttons, the focused gallery and the active original-image link; inactive captures are inert. Reduced-motion preference removes transitions. Playback pauses when a reader touches or focuses the gallery, so it cannot move away during inspection. Resume with P or the corner Play button.

Swiper **11.2.10** is vendored in `assets/vendor/swiper-11.2.10/` with its MIT license. No CDN request, npm installation or runtime fetch is required. Implementation follows the [official Swiper API](https://swiperjs.com/swiper-api) for wrapper/slide markup, initialization, slideTo/slideNext/slidePrev, touch events and accessibility. The deck owns one timer across narrative and capture playback to prevent competing autoplay timers. Swiper keyboard handling is disabled; the deck explicitly routes gallery navigation keys to the active Swiper.

Recheck after edits: `.venv/bin/python scripts/check-artifacts.py`. Browser checks are CLI run-code functions in `scripts/check-gallery.js`, `scripts/check-autoplay.js` and `scripts/check-offline.js`, used with Playwright CLI. `scripts/check-blue-fullscreen.js` verifies the preserved narrative layouts and corner controls. Rebuild the PDF, run validation, then run `python3 scripts/package.py`.
