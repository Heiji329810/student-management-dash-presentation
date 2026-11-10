# Presenter notes

20-slide core narrative. The 42-slide appendix is optional during a class presentation.

## 01 — Student life. Organized.

Introduce this as a club and extracurricular management project. It serves students, student club owners and teachers. The screenshots use fictional demonstration data.

## 02 — One connected school experience

Frame these as needs the project addresses, not a measured claim about a specific school's current processes.

## 03 — Three perspectives. Clear responsibilities.

There are two account roles: student and founder. The founder role means teacher. Club owner authorization depends on the student's ownership of a specific club.

## 04 — From an idea to a shared memory

Club applications are reviewed directly by teachers. Election services exist in the backend but are not part of this rendered workflow.

## 05 — A useful starting point

The student dashboard includes club information, participation summaries and rankings. Teachers see their own management board at the same home route.

## 06 — Find a club. Find your people.

Joining a club and registering for a specific activity are distinct operations. Founders must remain members of their own clubs.

## 07 — Make participation straightforward

Registration is stored on the server. The UI supports unregistering through the club page and My Registrations. The backend enforces student identity, capacity and activity status.

## 08 — Turn a club idea into a proposal

The pictured example shows a rejected application and feedback. Approval establishes the club directly; rejection requires a teacher comment.

## 09 — One place to run a club

Club management is restricted to the owning student. An owner of one club cannot manage another club. Cancellation hides the activity from current views while retaining metadata on the server.

## 10 — Record attendance by week

The current product permits owner-entered attendance, including the owner's own attendance. There is no teacher-approval workflow. Week keys follow local calendar Mondays.

## 11 — Give each activity a story

Journal editing supports up to eight supported images and selecting registered participants. Published photos are served through authenticated API routes. Authors can delete their own comment trees.

## 12 — Feedback grounded in participation

Ratings are stored per student and club and can be updated. Named community feedback is visible within the authenticated application. Three present sessions and current membership are required before rating.

## 13 — Support clubs with clear decisions

The teacher role is internally named founder. This is a separate rendering of the home route, not a third account role. Decisions are stored and the applicant receives a notification.

## 14 — Coordinate official school activity

Teachers can also manage membership in the School Official Events category. The roster includes the details needed for teacher management.

## 15 — Keep council years connected

Starting a council term replaces current council membership with the new departments' union and archives the previous term. The original UI has no standalone department assign/remove screen.

## 16 — Close the loop with notifications

This screenshot is from a captured workflow state, rather than a separate route. Read status and notification lists are scoped to the signed-in recipient.

## 17 — A shared UI. A persistent backend.

The frontend reads /api/state and sends /api/commands; Better Auth handles /api/auth/*. Writes use a transaction with a project-specific advisory lock. Core relationships use relational tables; complex records use separate typed JSONB tables.

## 18 — Make the records dependable

Do not describe this as a production security certification. The aggregate state loading and serialized writes fit the current small application; larger deployments would need additional scalability work.

## 19 — Show the product as it exists

The existing docs/action-inventory.json lists 31 commands. Some are dormant. Do not equate action count with reachable pages or describe all tests as passed while final verification is running.

## 20 — Discover. Participate. Organize. Reflect.

The appendix contains the captured route and role views. All screenshots use fictional demonstration data. The presentation itself is a standalone local artifact.


## Interactive workflow atlas (2026-11-10)

After the original 20 narrative slides, HTML slide 21 contains seven workflow chapters and all 42 captured page/role views in one Swiper gallery. Select a workflow to explore it, or press P for timed capture playback. Browsing or focusing a capture pauses playback. On this slide Left/Right and Home/End browse captures, while the corner controls navigate deck slides. Static PowerPoint/PDF slides 21–27 are contact sheets for these same seven workflows. Use the bundled originals for legible full-resolution inspection; contact sheets are navigation and discussion overviews. Screenshot 16 is the ended-activity guard; screenshot 17 has no remaining future events to cancel. Neither is evidence of a successful edit or cancellation form submission.
