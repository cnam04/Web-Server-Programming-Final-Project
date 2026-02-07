/* ============================================================
   Exercise Tracker – app.js
   Shared logic for all pages. No frameworks, no bundlers.
   Data lives in localStorage under a single key.
   ============================================================ */

const STORAGE_KEY = 'exercise_tracker_entries_v1';
const THEME_KEY = 'exercise_tracker_theme';

/* ---------- Data helpers ---------- */

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function addEntry(entry) {
  const entries = loadEntries();
  entry.id = generateId();
  entry.createdAt = new Date().toISOString();
  entries.push(entry);
  saveEntries(entries);
  return entry;
}

function updateEntry(id, updates) {
  const entries = loadEntries();
  const idx = entries.findIndex(e => e.id === id);
  if (idx === -1) return null;
  entries[idx] = { ...entries[idx], ...updates };
  saveEntries(entries);
  return entries[idx];
}

function deleteEntry(id) {
  const entries = loadEntries().filter(e => e.id !== id);
  saveEntries(entries);
}

function filterEntries({ search = '', category = '', startDate = '', endDate = '' } = {}) {
  let entries = loadEntries();

  if (search) {
    const q = search.toLowerCase();
    entries = entries.filter(e =>
      (e.activity || '').toLowerCase().includes(q) ||
      (e.notes || '').toLowerCase().includes(q)
    );
  }

  if (category) {
    entries = entries.filter(e => e.category === category);
  }

  if (startDate) {
    entries = entries.filter(e => e.date >= startDate);
  }
  if (endDate) {
    entries = entries.filter(e => e.date <= endDate);
  }

  // newest first
  entries.sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt));
  return entries;
}

/* ---------- Theme toggle ---------- */

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  const btn = document.getElementById('themeToggle');
  if (btn) {
    updateThemeIcon(btn);
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem(THEME_KEY, isDark ? 'light' : 'dark');
      updateThemeIcon(btn);
    });
  }
}

function updateThemeIcon(btn) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}

/* ---------- Toast notification ---------- */

function showToast(message, duration = 2000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ---------- Today helper ---------- */

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

/* ============================================================
   PAGE: index.html – Dashboard
   ============================================================ */

function initDashboard() {
  const form = document.getElementById('exerciseForm');
  if (!form) return;

  // Default date to today
  const dateInput = form.querySelector('#entryDate');
  if (dateInput && !dateInput.value) dateInput.value = todayString();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const entry = {
      date: data.date,
      activity: data.activity.trim(),
      category: data.category,
      durationMin: Number(data.durationMin) || 0,
      sets: data.sets ? Number(data.sets) : null,
      reps: data.reps ? Number(data.reps) : null,
      weight: data.weight ? Number(data.weight) : null,
      notes: (data.notes || '').trim() || null,
    };

    if (!entry.activity || !entry.date || entry.durationMin <= 0) {
      showToast('⚠️ Please fill in activity, date, and duration.');
      return;
    }

    addEntry(entry);
    showToast('✅ Exercise saved!');
    form.reset();
    dateInput.value = todayString();
    renderTodaySummary();
  });

  renderTodaySummary();
}

function renderTodaySummary() {
  const today = todayString();
  const entries = loadEntries().filter(e => e.date === today);
  const totalMin = entries.reduce((s, e) => s + (e.durationMin || 0), 0);

  const countEl = document.getElementById('todayCount');
  const minEl = document.getElementById('todayMinutes');
  if (countEl) countEl.textContent = entries.length;
  if (minEl) minEl.textContent = totalMin;
}

/* ============================================================
   PAGE: log.html – Exercise Log
   ============================================================ */

function initLog() {
  const tbody = document.getElementById('logBody');
  if (!tbody) return;

  renderLog();

  // Filter listeners
  document.getElementById('searchInput')?.addEventListener('input', renderLog);
  document.getElementById('categoryFilter')?.addEventListener('change', renderLog);
  document.getElementById('startDate')?.addEventListener('change', renderLog);
  document.getElementById('endDate')?.addEventListener('change', renderLog);

  // Export
  document.getElementById('exportBtn')?.addEventListener('click', exportJSON);

  // Import
  document.getElementById('importFile')?.addEventListener('change', importJSON);
}

function getFilters() {
  return {
    search: document.getElementById('searchInput')?.value || '',
    category: document.getElementById('categoryFilter')?.value || '',
    startDate: document.getElementById('startDate')?.value || '',
    endDate: document.getElementById('endDate')?.value || '',
  };
}

function renderLog() {
  const tbody = document.getElementById('logBody');
  if (!tbody) return;

  const entries = filterEntries(getFilters());
  const emptyMsg = document.getElementById('emptyMessage');

  if (entries.length === 0) {
    tbody.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';

  tbody.innerHTML = entries.map(e => `
    <tr data-id="${e.id}">
      <td>${e.date}</td>
      <td>${escapeHtml(e.activity)}</td>
      <td>${e.category}</td>
      <td>${e.durationMin} min</td>
      <td>${formatDetails(e)}</td>
      <td>${escapeHtml(e.notes || '—')}</td>
      <td class="actions">
        <button class="btn btn-outline btn-sm edit-btn" onclick="openEditModal('${e.id}')">✏️ Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" onclick="confirmDelete('${e.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function formatDetails(e) {
  const parts = [];
  if (e.sets) parts.push(`${e.sets}s`);
  if (e.reps) parts.push(`${e.reps}r`);
  if (e.weight) parts.push(`${e.weight} lbs`);
  return parts.length ? parts.join(' × ') : '—';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* -- Delete -- */
function confirmDelete(id) {
  if (confirm('Delete this entry?')) {
    deleteEntry(id);
    showToast('🗑️ Entry deleted');
    renderLog();
  }
}

/* -- Edit Modal -- */
function openEditModal(id) {
  const entry = loadEntries().find(e => e.id === id);
  if (!entry) return;

  // Remove any existing modal
  closeEditModal();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'editModalOverlay';
  overlay.innerHTML = `
    <div class="modal">
      <h2>Edit Exercise</h2>
      <form id="editForm">
        <div class="form-group">
          <label for="editDate">Date</label>
          <input type="date" id="editDate" value="${entry.date}" required>
        </div>
        <div class="form-group">
          <label for="editActivity">Activity</label>
          <input type="text" id="editActivity" value="${escapeHtml(entry.activity)}" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="editCategory">Category</label>
            <select id="editCategory">
              <option ${entry.category === 'Strength' ? 'selected' : ''}>Strength</option>
              <option ${entry.category === 'Cardio' ? 'selected' : ''}>Cardio</option>
              <option ${entry.category === 'Mobility' ? 'selected' : ''}>Mobility</option>
              <option ${entry.category === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editDuration">Duration (min)</label>
            <input type="number" id="editDuration" value="${entry.durationMin}" min="1" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="editSets">Sets</label>
            <input type="number" id="editSets" value="${entry.sets || ''}" min="0">
          </div>
          <div class="form-group">
            <label for="editReps">Reps</label>
            <input type="number" id="editReps" value="${entry.reps || ''}" min="0">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="editWeight">Weight (lbs)</label>
            <input type="number" id="editWeight" value="${entry.weight || ''}" min="0">
          </div>
          <div class="form-group"></div>
        </div>
        <div class="form-group">
          <label for="editNotes">Notes</label>
          <textarea id="editNotes">${escapeHtml(entry.notes || '')}</textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" onclick="closeEditModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeEditModal();
  });

  document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    updateEntry(id, {
      date: document.getElementById('editDate').value,
      activity: document.getElementById('editActivity').value.trim(),
      category: document.getElementById('editCategory').value,
      durationMin: Number(document.getElementById('editDuration').value) || 0,
      sets: document.getElementById('editSets').value ? Number(document.getElementById('editSets').value) : null,
      reps: document.getElementById('editReps').value ? Number(document.getElementById('editReps').value) : null,
      weight: document.getElementById('editWeight').value ? Number(document.getElementById('editWeight').value) : null,
      notes: document.getElementById('editNotes').value.trim() || null,
    });
    closeEditModal();
    showToast('✅ Entry updated');
    renderLog();
  });
}

function closeEditModal() {
  const overlay = document.getElementById('editModalOverlay');
  if (overlay) overlay.remove();
}

/* -- Export / Import -- */

function exportJSON() {
  const entries = loadEntries();
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `exercise-tracker-export-${todayString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Exported ' + entries.length + ' entries');
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) {
        showToast('⚠️ Invalid file: expected an array.');
        return;
      }

      // Merge approach: add imported entries that don't already exist (by id)
      const existing = loadEntries();
      const existingIds = new Set(existing.map(e => e.id));
      let added = 0;

      imported.forEach(entry => {
        if (!entry.id) entry.id = generateId();
        if (!existingIds.has(entry.id)) {
          existing.push(entry);
          added++;
        }
      });

      saveEntries(existing);
      showToast(`📤 Imported ${added} new entries (${imported.length - added} duplicates skipped)`);
      renderLog();
    } catch {
      showToast('⚠️ Could not parse JSON file.');
    }
  };
  reader.readAsText(file);
  // Reset so the same file can be re-selected
  event.target.value = '';
}

/* ============================================================
   PAGE: stats.html – Statistics
   ============================================================ */

function initStats() {
  const canvas = document.getElementById('weekChart');
  if (!canvas) return;

  renderWeekSummary();
  renderWeekChart(canvas);
  renderPersonalBests();
}

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function renderWeekSummary() {
  const days = getLast7Days();
  const entries = loadEntries().filter(e => days.includes(e.date));
  const totalMin = entries.reduce((s, e) => s + (e.durationMin || 0), 0);

  const countEl = document.getElementById('weekWorkouts');
  const minEl = document.getElementById('weekMinutes');
  if (countEl) countEl.textContent = entries.length;
  if (minEl) minEl.textContent = totalMin;
}

function renderWeekChart(canvas) {
  const ctx = canvas.getContext('2d');
  const days = getLast7Days();
  const entries = loadEntries();

  const dayTotals = days.map(day => {
    return entries
      .filter(e => e.date === day)
      .reduce((s, e) => s + (e.durationMin || 0), 0);
  });

  const maxVal = Math.max(...dayTotals, 1);
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padding = { top: 20, right: 20, bottom: 40, left: 45 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const barW = chartW / days.length * 0.6;
  const gap = chartW / days.length;

  // Colors adapt to theme
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const barColor = isDark ? '#818cf8' : '#4f46e5';
  const textColor = isDark ? '#94a3b8' : '#6b7280';
  const lineColor = isDark ? '#334155' : '#e5e7eb';

  ctx.clearRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + chartH - (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal / 4 * i) + '', padding.left - 8, y + 4);
  }

  // Bars
  days.forEach((day, i) => {
    const barH = dayTotals[i] / maxVal * chartH;
    const x = padding.left + gap * i + (gap - barW) / 2;
    const y = padding.top + chartH - barH;

    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Value on top
    if (dayTotals[i] > 0) {
      ctx.fillStyle = textColor;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(dayTotals[i] + '', x + barW / 2, y - 5);
    }

    // Day label
    ctx.fillStyle = textColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    const label = day.slice(5); // MM-DD
    ctx.fillText(label, x + barW / 2, padding.top + chartH + 20);
  });

  // Y-axis label
  ctx.save();
  ctx.fillStyle = textColor;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.translate(12, padding.top + chartH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Minutes', 0, 0);
  ctx.restore();
}

function renderPersonalBests() {
  const container = document.getElementById('personalBests');
  if (!container) return;

  const entries = loadEntries();

  // Max weight for Strength
  const strengthEntries = entries.filter(e => e.category === 'Strength' && e.weight);
  let maxWeightEntry = null;
  if (strengthEntries.length) {
    maxWeightEntry = strengthEntries.reduce((best, e) => e.weight > best.weight ? e : best);
  }

  // Longest duration
  let longestEntry = null;
  if (entries.length) {
    longestEntry = entries.reduce((best, e) => e.durationMin > best.durationMin ? e : best);
  }

  let html = '';

  if (maxWeightEntry) {
    html += `
      <div class="summary-item">
        <div class="number">${maxWeightEntry.weight} lbs</div>
        <div class="label">Heaviest Lift — ${escapeHtml(maxWeightEntry.activity)}</div>
      </div>`;
  }

  if (longestEntry) {
    html += `
      <div class="summary-item">
        <div class="number">${longestEntry.durationMin} min</div>
        <div class="label">Longest Session — ${escapeHtml(longestEntry.activity)}</div>
      </div>`;
  }

  if (!html) {
    html = '<p style="color:var(--text-muted)">No entries yet. Add some exercises to see your personal bests!</p>';
  }

  container.innerHTML = html;
}

/* ============================================================
   Init – runs on every page
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Highlight active nav link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === './' + currentPage ||
        (currentPage === 'index.html' && link.getAttribute('href') === './')) {
      link.classList.add('active');
    }
  });

  // Page-specific init
  if (document.getElementById('exerciseForm')) initDashboard();
  if (document.getElementById('logBody')) initLog();
  if (document.getElementById('weekChart')) initStats();
});
