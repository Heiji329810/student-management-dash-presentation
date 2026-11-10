# Content and screenshot provenance

Reviewed 2026-11-10. Paths refer to the local source project at `/home/keesee/Projects/student-management-dash`; files may evolve after this presentation snapshot.

| Presentation claims | Source inspected |
| --- | --- |
| React/Vite UI, Express 5 API, shared contracts, Drizzle/PostgreSQL, Better Auth | `README.md`, `package.json`, `apps/server/src/app.ts`, `apps/server/src/schema.ts` |
| Rendered route inventory, original navigation and redirect-only election paths | `apps/web/src/App.tsx`, `docs/coverage-review.md` |
| Student vs teacher vs owning-student distinction | `README.md`, `apps/server/src/service.ts`, `docs/HANDOFF.md` |
| Workflow and action coverage | `docs/action-inventory.json`, `docs/coverage-review.md`, `docs/HANDOFF.md` |
| Server transaction, authenticated state/command APIs, photo access | `apps/server/src/app.ts` |
| Persistence structure and identity relationships | `apps/server/src/schema.ts` |
| Privacy, registration, attendance, journals, cancellation and council decisions | `apps/server/src/service.ts`, current `docs/HANDOFF.md` |

The static coverage review describes earlier implementation snapshots as well as subsequent fixes. Current code and the later handoff take precedence for implementation behavior. The deck does not restate early findings as current unresolved bugs and does not claim an overall test pass.

## Screenshot sources

- `assets/gallery-index.md` is the supplied gallery's final index, copied from `/home/keesee/Pictures/CC-student/index.md`.
- `assets/screenshots/01-*.png` through `42-*.png` preserve all 42 supplied page/role screenshots.
- `assets/screenshots/visible-member-cancellation-notice.png` is an actual prior workflow screenshot from the source project's `output/playwright/` directory.
- `assets/details/` contains derived high-quality crops for the core slides. Originals remain intact and are linked from the HTML.
- All captured app content uses fictional isolated fixture data. No private environment or demo-login files were read or packaged.

The 42 gallery captures cover all 26 concrete route patterns / 25 routed page components according to the screenshot worker's completed index, plus role variants, dialogs, expanded forms and guard states. A gallery capture proves what was displayed; it does not by itself prove every backend path has been tested.

## Visual-review correction

The original `16-owner-edit-activity-form.png` capture shows **Activity Has Ended**, not an editable form. The presentation labels that exact capture **Past activity edit guard**. `screenshot-labels.json` applies this correction only while the image hash matches, so a future corrected capture can use its updated source caption. The copied source gallery index is retained as provenance; this observed screen state takes precedence over its completed-event editing sentence.
