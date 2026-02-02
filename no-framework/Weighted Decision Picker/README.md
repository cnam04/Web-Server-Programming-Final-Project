# Weighted Decision Picker

A small, dependency-free web app for picking an item from a list where each choice has a numeric weight (higher weight → higher chance).

The app is intentionally minimal — stores data in `localStorage` and runs as static files so you can host it anywhere.

---

## 🎯 Features

- Add/edit/delete choices (label + numeric weight)
- Weighted-random selection with a brief spin animation
- Persisted choices in `localStorage` (`wdp_choices`)
- Spin history persisted as newest-first in `localStorage` (`wdp_history`)
- Built-in presets that overwrite saved choices (`wdp_preset`)
- Input validation (non-empty label, weight &gt; 0)
- Small, accessible, and framework-free (vanilla HTML/CSS/JS)

## 📦 Files

- `index.html` — main editor (add/save choices, view history)
- `spin.html` — performs the weighted pick and records history
- `presets.html` — select from example choice sets
- `styles.css` — styling
- `main.js` — app logic (storage, validation, spin animation)
- `data_` — minimal data contract and examples

## � Authoring / prompt workflow

This project was created using a prompt-driven workflow that ensures the implementation matches a stable data contract and is reproducible. Below are the exact steps used so you (or collaborators) can repeat the process:

1. Enter the idea into ChatGPT (concept and high-level goals).
2. Have ChatGPT produce an overall implementation plan (pages, files, UX, data contract).
3. Have ChatGPT specify a precise data contract (localStorage keys and JSON shapes).
4. Ask ChatGPT to generate a single, comprehensive prompt that contains the implementation plan + data contract for Copilot.
5. Run GitHub Copilot with that prompt and attach the data contract; Copilot generates the app files and logic.

Why this matters

- Reproducibility: the explicit data contract (`no-framework/data_`) keeps frontend behavior consistent across iterations and contributors. ✅
- Promptability: packaging plan + contract into one prompt produces deterministic, reviewable output from code-generation tools. 💡

## 🔐 Data contract (localStorage)

All values are JSON-serialized.

- `wdp_choices` — Choice[]
  - Choice: `{ label: string, weight: number }`
  - Example: `[ { "label": "Tacos", "weight": 2 }, { "label": "Sushi", "weight": 1 } ]`

- `wdp_history` — HistoryEntry[] (newest first)
  - HistoryEntry: `{ time: string (ISO), result: string }`
  - Example: `[ { "time": "2026-01-29T21:20:10.000Z", "result": "Tacos" } ]`

- `wdp_preset` — string (preset id/name)

(See `no-framework/data_` for the canonical contract used by the app.)

## 🚀 Quick start (local)

1. Open a terminal in the `no-framework` folder.
2. Run a static server (example):

   ```bash
   python3 -m http.server 8000
   ```

3. Open: `http://localhost:8000/index.html`

## ✅ How to use

1. Go to **Choices** (`index.html`) and add items with weights (weights &gt; 0).
2. Save choices, then click **Spin** (or open `spin.html`).
3. The winner is shown after a short animation and appended to `wdp_history` (newest first).
4. Load a preset via `presets.html` to overwrite current choices.

## 🔎 Verify (dev tips)

- Open DevTools → Application → Local Storage and inspect `wdp_choices`, `wdp_history`, `wdp_preset`.
- To sanity-check probabilities: add two entries with different weights and run multiple spins — the frequency should roughly reflect the weight ratio.

## ♿ Accessibility & validation

- Inputs are validated (non-empty label, weight &gt; 0) with user-facing messages.
- Basic ARIA and focus-friendly controls included; keyboard navigation is supported for primary flows.

## 🧩 Extending / ideas

- Export/import choices and history (JSON)
- Visual SVG wheel or canvas-based spinner
- Unit tests for the weighting algorithm

## 🛠️ Development notes

- No build step required — modify files and reload the browser.
- Main entrypoint for behavior: `no-framework/main.js`.

## �🧪 Quick test for the weighted algorithm (manual)

1. Add `A` weight `9` and `B` weight `1`.
2. Spin ~100 times and inspect counts in `wdp_history` — expect roughly a 9:1 split.

## 📄 License

MIT — feel free to reuse and modify.

---

If you'd like, I can add an `Export/Import` button, a demo GIF, or a unit test for the weighted picker — tell me which and I'll add it. 

