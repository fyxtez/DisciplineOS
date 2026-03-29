# Daily Reset

A minimal, local-first desktop app for structuring your day and actually following through.

Instead of overwhelming todo lists, Daily Reset focuses on simple daily rituals grouped by time of day — morning, midday, and evening.

---

## Why this exists

Most productivity apps try to do everything:

* projects
* deadlines
* collaboration
* notifications

And you end up ignoring all of it.

Daily Reset is built around a simpler idea:

Do a few important things every day — and actually finish them.

---

## Core concept

Tasks are grouped into time blocks:

* Morning (6am – 12pm)
* Midday (12pm – 5pm)
* Evening (5pm onwards)

Each block acts like a small system instead of a long list.

---

## Features

* Time-based task grouping
* Subtasks support with expandable details
* Optional reminders per task
* Daily progress tracking
* Minimal interface with no distractions
* Instant interactions with no loading or backend

---

## UX Philosophy

* Click anywhere on a task to expand details
* One screen shows your entire day
* No nested menus or unnecessary complexity
* Designed for clarity and speed

---

## Running locally

```bash
npm install
npm run dev
npm run tauri dev
```

---

## How it works

* Tasks are stored in local state
* Completion is tracked separately
* Tasks are filtered by time of day
* Progress is calculated per block and globally

---

## Use cases

* Daily routines and habits
* Personal discipline systems
* Non-negotiable daily actions
* Users who prefer simplicity over feature-heavy tools

---

## Future ideas

* Local persistence
* Feedback on completion
* Mobile version
* Consistency tracking
* Smart suggestions

---

## Philosophy

This is not a task manager.

It is a daily execution tool.

---

## License

MIT
