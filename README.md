# PUP Attendance System — Maragondon Branch

A complete client-side attendance management system built with plain HTML, CSS, and JavaScript. All data is stored in the browser's `localStorage` — no server or database setup needed.

## How to Run

1. Extract this folder anywhere on your computer.
2. Open **`index.html`** in any modern browser (Chrome, Edge, Firefox).
3. That's it.

## Demo Accounts (auto-seeded on first run)

| Role    | User ID       | Password      | PIN  |
|---------|---------------|---------------|------|
| Faculty | `T-001`       | `teacher123`  | 1234 |
| Student | `2024-00001`  | `student123`  | 1234 |

You can also register your own accounts.

## Pages (matches the flowchart)

- `index.html` — Splash screen ("Go to Login? Yes / No")
- `login.html` — Login with role selection + error messages (suggests Register / Forgot)
- `register.html` — Register as Student or Faculty, with full personal info + 2-step security questions + PIN
- `forgot.html` — Reset password via security questions + PIN
- `student.html` — Student dashboard: name, student no., section, subject + teacher pickers, **Mark Present** button, attendance history & stats
- `teacher.html` — Teacher dashboard: course/section selection, student list, contact info, "Proceed to Record"
- `record.html` — Attendance taking page: per-student P/A/L status, save, daily/weekly CSV reports, print

## Features Implemented (from the flowchart)

- Login + credential validation with helpful error suggestions
- Registration for both students and teachers, with all required fields (name, age, bday, email, sex, parent/address, ID, etc.)
- 2-step verification (security questions + 4-digit PIN)
- Forgot Password flow
- Student dashboard with subject + teacher selection and a **Present** button
- Teacher dashboard with course/section selection, student roster, and contact info
- Attendance record table with Present / Absent / Late status
- Save attendance (no duplicates)
- Daily & weekly downloadable CSV reports with per-student summary
- Print-friendly report layout
- Live statistics (attendance %, totals, today's records)
- Logout from every dashboard

## Data Reset

To clear all data (users + attendance) open the browser console (F12) and run:

```js
localStorage.clear(); location.reload();
```
