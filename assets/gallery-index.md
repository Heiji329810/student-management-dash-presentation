# Student Management Dashboard — presentation pages

English screenshots of fictional, isolated local fixture data. No real students or account passwords. Full-page PNGs captured in the watched browser at native fullscreen width2022 CSS pixels; display scaling produces3813–3842px PNG widths (scrollbar dependent), and full-page heights vary.

| File | Page | Role |
| --- | --- | --- |
| 01-login-english.png | Sign in, empty credentials | Anonymous |
| 02-student-application-result.png | Create Club / My Applications, teacher feedback | Student applicant |

| 03-student-dashboard.png | Dashboard | Student club owner |
| 04-student-clubs.png | Clubs and organizations | Student club owner |
| 05-student-club-detail.png | Club detail and activities | Student club owner |
| 06-student-club-members.png | Club member directory | Student club owner |
| 07-student-published-journal.png | Published activity journal | Student club owner |
| 08-owner-manage.png | Manage clubs and activities | Student club owner |
| 09-owner-club-selection.png | Manage club selection | Student club owner |
| 10-owner-member-roster.png | Manage members | Student club owner |
| 11-owner-attendance.png | Weekly attendance | Student club owner |
| 12-owner-activity-selection.png | Manage activity club selection | Student club owner |
| 13-owner-activity-options.png | Activity management options | Student club owner |
| 14-owner-add-activity.png | Create activity | Student club owner |
| 15-owner-edit-activity-selection.png | Edit activity selection | Student club owner |
| 16-owner-edit-activity-form.png | Past-activity edit guard (Activity Has Ended) | Student club owner |
| 17-owner-cancel-activity.png | Cancel activity (no remaining future events) | Student club owner |
| 18-owner-journal-selection.png | Journal event selection | Student club owner |
| 19-owner-journal-edit.png | Journal edit form | Student club owner |

| 20-owner-management-selected.png | Selected club management choices | Student club owner |
| 21-teacher-dashboard.png | Teacher Management Board | Teacher |
| 22-teacher-clubs.png | Teacher organization directory | Teacher |
| 23-teacher-club-detail.png | Teacher club detail | Teacher |
| 24-teacher-member-directory.png | Teacher member directory | Teacher |
| 25-teacher-participation.png | Attendance and rating summary | Teacher |
| 26-teacher-official-events.png | Official events and registered students | Teacher |
| 27-teacher-council.png | Council current and archived crews | Teacher |
| 28-teacher-new-council.png | New council year form | Teacher |
| 29-teacher-council-year.png | Archived council year detail | Teacher |
| 30-teacher-official-members.png | Official organization membership management | Teacher |
| 31-teacher-official-club.png | Official event organization | Teacher |
| 32-teacher-council-organization.png | Student Council organization | Teacher |

| 33-teacher-create-official-event.png | New official event form | Teacher |
| 34-member-registrations.png | Upcoming and past registrations | Registered student |
| 35-member-rating-edit.png | Eligible rating edit and ranking | Student member |
| 36-member-journal-view.png | Journal without owner edit controls | Student member |
| 37-student-official-application-form.png | Official club application teacher fields | Student applicant |

| 38-student-teacher-access-denied.png | Role access denied (intentional guard) | Student |
| 39-club-not-found.png | Missing club (intentional guard) | Student |
| 40-student-rating-eligibility.png | Rating attendance/membership requirement | Student member |
| 41-navigation-search.png | Navigation search dialog | Student member |
| 42-student-notifications.png | Notification list and read state | Student member |

**Complete: 42 PNGs.** All26 concrete route patterns /25 routed page components are represented, including distinct student/teacher views and captured expanded forms. Screenshot16 represents the edit route's past-activity guard; an editable upcoming-activity form is not captured in this gallery.

Aliases `/club-elections`, `/elections`, `/school-official-clubs`, `/manage-activities`, `/add-activity`, `/add-activity/:clubId`, `/manage/clubs/:clubId` and the wildcard redirect to existing pages. Dormant election services have no rendered screens. No fabricated screenshots represent them.

The cancellation selector is empty after the verified cancellation workflow; this is real fixture state. Screenshot16 shows “Activity Has Ended / Past events can no longer be edited”, matching both the original frontend guard and current server domain rule. It is evidence of blocked past-event editing, not a successful edit form. The filename is retained for existing references. Images38–39 are intentional application guard screens, not unexpected crashes. Passwords and real personal data are absent.
