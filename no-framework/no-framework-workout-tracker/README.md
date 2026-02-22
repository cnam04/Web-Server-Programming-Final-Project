# 🏋️ Exercise Tracker

A simple, static (no backend) exercise-tracking website built with **HTML, CSS, and vanilla JavaScript**. All data is stored in the browser via `localStorage`, so it works completely offline — no server required.

Built for a Web Server Programming class to practice deploying to **GitHub Pages** and **Render**.

---

## Features

- **Dashboard** – Quick-add exercises and see today's summary
- **Exercise Log** – View, filter, search, edit, and delete past entries
- **Statistics** – Last-7-days chart (canvas), personal bests
- **Export / Import** – Download your data as JSON or import from a file
- **Light / Dark Mode** – Toggle in the navbar; preference saved in localStorage
- **Fully Offline** – No server needed; everything runs in the browser

---

## Project Structure

```
exercise-tracker/
├── index.html   ← Dashboard + Add Exercise form
├── log.html     ← Exercise history table with filters
├── stats.html   ← Weekly stats + canvas chart
├── styles.css   ← All styles (responsive, light/dark)
├── app.js       ← All JavaScript logic (shared across pages)
└── README.md    ← You are here
```

---

## Running Locally

### Option 1 – Just open the file

Double-click **`index.html`** in your file explorer. It will open in your default browser and work immediately (all links are relative).

### Option 2 – Simple HTTP server (recommended)

Using Python (comes pre-installed on macOS/Linux):

```bash
cd exercise-tracker
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

Using Node.js:

```bash
npx serve .
```

> **Why a server?** Some browsers restrict certain features (like file imports) when running from `file://`. A local server avoids those issues.

---

## Deploy to GitHub Pages

1. Push your repo to GitHub (make sure the `exercise-tracker/` folder is in the repo).
2. Go to your repo → **Settings** → **Pages**.
3. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)` if `index.html` is at the repo root, OR select the subfolder if you're using one.
4. Click **Save**. GitHub will publish your site at:
   ```
   https://<username>.github.io/<repo-name>/exercise-tracker/
   ```
5. Since all asset links are **relative** (`./styles.css`, `./app.js`, `./log.html`), the site works under any subpath automatically.

> **Tip:** If you want the site at the repo root URL, move all the files from `exercise-tracker/` to the repo root.

---

## Deploy to Render (Static Site)

1. Push your repo to GitHub.
2. Go to [https://render.com](https://render.com) and sign in.
3. Click **New** → **Static Site**.
4. Connect your GitHub repo.
5. Configure:

   | Setting              | Value                                                                 |
   | -------------------- | --------------------------------------------------------------------- |
   | **Build Command**    | *(leave blank — there's nothing to build)*                            |
   | **Publish Directory**| `exercise-tracker` (the folder containing `index.html`)               |

   > If your `index.html` is at the repo root, set **Publish Directory** to `.` instead.

6. Click **Create Static Site**. Render will deploy and give you a URL like `https://your-site.onrender.com`.

---

## Data Format

All exercise entries are stored in `localStorage` under the key **`exercise_tracker_entries_v1`** as a JSON array. Each entry looks like:

```json
{
  "id": "m1abc2def",
  "date": "2026-02-07",
  "activity": "Bench Press",
  "category": "Strength",
  "durationMin": 45,
  "sets": 4,
  "reps": 8,
  "weight": 185,
  "notes": "Felt strong today",
  "createdAt": "2026-02-07T15:30:00.000Z"
}
```

### Import Behavior

The **Import JSON** button uses a **merge** strategy: imported entries with new IDs are added; entries whose IDs already exist are skipped (no duplicates).

---

## Future Backend Ideas

This is currently a static-only project. Here are ideas for extending it with a backend:

- **🔐 Authentication** – Add user sign-in (e.g., OAuth with Google) so each user has their own data.
- **☁️ Cloud Sync** – Store entries in a database (PostgreSQL, MongoDB, Firebase) so data persists across devices.
- **👥 Multi-User Support** – Let users share workouts, follow friends, and see a social feed.
- **📊 Advanced Analytics** – Server-side aggregation for progress charts, streaks, and recommendations.
- **📱 PWA / Mobile App** – Add a service worker for full offline support and "Add to Home Screen" on mobile.

---

## License

This project was made for educational purposes. Feel free to use and modify it.
