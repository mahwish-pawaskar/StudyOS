# Study OS

A browser-based student productivity dashboard — Pomodoro timer, subject hour tracking, assignment deadlines, flashcards, quick notes, study streaks, exam countdowns, and progress charts, all in one place.

Built with plain HTML, CSS, and JavaScript (no frameworks), using [Chart.js](https://www.chartjs.org/) for the progress charts. All data is stored locally in the browser via `localStorage` — there's no backend, no database, and no sign-up.

---

## Features

- **Focus Timer (Pomodoro)** — animated ring countdown, configurable focus/break lengths (25/5, 50/10, 15/3), and sessions are logged against a subject
- **Subjects** — add subjects with a color tag and track total hours studied per subject
- **Deadlines** — add assignments with a subject, due date, and priority; see a live "days left" countdown per item
- **Flashcards** — create multiple decks, add question/answer cards, flip and navigate through them
- **Quick Notes** — a simple multi-note editor that autosaves as you type
- **Study Streak** — tracks consecutive days you've completed at least one focus session
- **Exam Countdown** — add exam dates and see days remaining; the nearest exam is always shown in the top status bar
- **Progress Dashboard** — total hours, sessions, deadlines cleared, and streak at a glance, plus charts for hours-per-subject and sessions-over-the-last-7-days
- **Dark / Pastel theme toggle** — switch instantly from the status bar; your choice is remembered on reload

## Tech Stack

- HTML5, CSS3 (custom properties for theming, no CSS framework)
- Vanilla JavaScript (no build step, no npm dependencies)
- [Chart.js](https://www.chartjs.org/) via CDN, for the two progress charts
- `localStorage` for all persistence

## Getting Started

No installation or server required.

1. Download or clone this repository
2. Open `index.html` in any modern browser

That's it — the app runs entirely client-side.

```
git clone <your-repo-url>
cd study-os
open index.html   # or just double-click the file
```

## Project Structure

```
study-os/
├── index.html          # page structure, all modules
├── css/
│   └── style.css       # design tokens + component styles (dark & pastel themes)
└── js/
    ├── storage.js       # localStorage read/write helpers + shared utilities
    ├── theme.js         # dark/pastel theme toggle
    ├── clock.js         # live clock in the status bar
    ├── subjects.js       # subject list + hours tracking
    ├── timer.js         # Pomodoro timer engine
    ├── deadlines.js     # assignment deadlines
    ├── flashcards.js    # flashcard decks
    ├── notes.js         # quick notes editor
    ├── exams.js         # exam countdowns
    ├── streak.js        # study streak logic
    ├── progress.js      # stat cards + Chart.js charts
    └── app.js           # navigation between modules
```

Each feature lives in its own file and reads/writes its own slice of `localStorage`, so modules can be read independently.

## Notes

- All data is stored **only in your browser**. Clearing your browser's site data will reset everything.
- Since there's no backend, data does not sync across devices or browsers.

## License

Feel free to use, modify, and learn from this project.
