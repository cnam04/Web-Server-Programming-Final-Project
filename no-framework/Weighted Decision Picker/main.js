/* Weighted Decision Picker — main.js
   Implements the data contract in no-framework/data_
   Keys: wdp_choices (Choice[]), wdp_history (HistoryEntry[]), wdp_preset (string)
   Author: generated for course project
*/

(() => {
  'use strict';

  const LS = {
    CHOICES: 'wdp_choices',
    HISTORY: 'wdp_history',
    PRESET: 'wdp_preset'
  };

  /* ---------- storage helpers ---------- */
  const load = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch (e) { return null; }
  };
  const save = (key, v) => localStorage.setItem(key, JSON.stringify(v));

  const loadChoices = () => Array.isArray(load(LS.CHOICES)) ? load(LS.CHOICES) : [];
  const saveChoices = (arr) => save(LS.CHOICES, arr.map(c => ({ label: String(c.label), weight: Number(c.weight) })));
  const loadHistory = () => Array.isArray(load(LS.HISTORY)) ? load(LS.HISTORY) : [];
  const saveHistory = (h) => save(LS.HISTORY, h);
  const setPresetKey = (id) => localStorage.setItem(LS.PRESET, id);

  /* ---------- validation ---------- */
  const isValidChoice = (c) => c && String(c.label).trim() !== '' && Number(c.weight) > 0;

  /* ---------- core: weighted pick ---------- */
  function weightedPick(choices) {
    // choices: [{label, weight}], assumes validated
    const total = choices.reduce((s, c) => s + Number(c.weight), 0);
    if (!total) return null;
    let r = Math.random() * total;
    for (const c of choices) {
      r -= Number(c.weight);
      if (r <= 0) return c.label;
    }
    return choices[choices.length - 1].label;
  }

  /* ---------- UI utilities ---------- */
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const el = (tag, props = {}, ...children) => { const e = document.createElement(tag); Object.assign(e, props); children.forEach(c => e.append(typeof c === 'string' ? document.createTextNode(c) : c)); return e; };

  function showMessage(container, txt, type = 'error') {
    container.textContent = txt || '';
    container.classList.toggle('success', type === 'success');
    container.style.display = txt ? '' : 'none';
  }

  /* ---------- index page ---------- */
  function initIndex() {
    const choicesWrap = qs('#choicesWrap');
    const addForm = qs('#addForm');
    const newLabel = qs('#newLabel');
    const newWeight = qs('#newWeight');
    const msg = qs('#msg');
    const historyList = qs('#historyList');

    function renderChoices() {
      const choices = loadChoices();
      if (!choices.length) {
        choicesWrap.innerHTML = '<div class="empty">No choices saved yet — add some or pick a preset.</div>';
        return;
      }
      const table = el('table', { className: 'table', innerHTML: `<thead><tr><th>Label</th><th style="width:120px">Weight</th><th style="width:80px">&nbsp;</th></tr></thead>` });
      const tbody = document.createElement('tbody');
      choices.forEach((c, idx) => {
        const tr = document.createElement('tr');
        const labelTd = document.createElement('td');
        const labelInput = el('input', { value: c.label, 'aria-label': `Label ${idx}` });
        labelInput.addEventListener('change', () => { choices[idx].label = labelInput.value; });
        labelTd.appendChild(labelInput);

        const wTd = document.createElement('td');
        const wInput = el('input', { value: c.weight, type: 'number', min: '0.01', step: '0.01', 'aria-label': `Weight ${idx}` });
        wInput.addEventListener('change', () => { choices[idx].weight = Number(wInput.value); });
        wTd.appendChild(wInput);

        const actTd = document.createElement('td');
        const del = el('button', { className: 'small-btn delete' }, 'Delete');
        del.addEventListener('click', () => {
          choices.splice(idx, 1);
          saveChoices(choices);
          renderChoices();
          renderHistory();
          showMessage(msg, 'Choice removed', 'success');
        });
        actTd.appendChild(del);

        tr.appendChild(labelTd); tr.appendChild(wTd); tr.appendChild(actTd);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      choicesWrap.innerHTML = '';
      choicesWrap.appendChild(table);
    }

    function renderHistory() {
      const h = loadHistory();
      if (!h.length) { historyList.innerHTML = '<li class="empty">No history yet.</li>'; return; }
      historyList.innerHTML = h.slice(0, 12).map(it => `<li><strong>${escapeHtml(it.result)}</strong> <span class="muted">— ${new Date(it.time).toLocaleString()}</span></li>`).join('');
    }

    addForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const label = newLabel.value && newLabel.value.trim();
      const weight = parseFloat(newWeight.value);
      if (!label) return showMessage(msg, 'Label cannot be empty.');
      if (!weight || weight <= 0) return showMessage(msg, 'Weight must be a number greater than 0.');
      const choices = loadChoices();
      choices.push({ label, weight });
      saveChoices(choices);
      newLabel.value = '';
      newWeight.value = '';
      renderChoices();
      renderHistory();
      showMessage(msg, 'Added', 'success');
    });

    qs('#saveBtn').addEventListener('click', () => {
      const inputs = qsa('#choicesWrap input');
      // read current DOM values into array
      const choices = [];
      const rows = qsa('#choicesWrap tbody tr');
      rows.forEach(r => {
        const label = r.querySelector('td:nth-child(1) input').value.trim();
        const weight = Number(r.querySelector('td:nth-child(2) input').value);
        if (label && weight > 0) choices.push({ label, weight });
      });
      if (!choices.length) return showMessage(msg, 'No valid choices to save.');
      saveChoices(choices);
      showMessage(msg, 'Choices saved', 'success');
      renderChoices();
      renderHistory();
    });

    qs('#clearBtn').addEventListener('click', () => {
      if (!confirm('Clear all saved choices?')) return;
      localStorage.removeItem(LS.CHOICES);
      localStorage.removeItem(LS.PRESET);
      renderChoices();
      showMessage(msg, 'Choices cleared', 'success');
    });

    qs('#toSpinBtn').addEventListener('click', () => {
      const choices = loadChoices().filter(isValidChoice);
      if (!choices.length) return showMessage(msg, 'Add at least one valid choice before spinning.');
      // ensure saved
      saveChoices(choices);
      window.location.href = 'spin.html';
    });

    // initial render
    renderChoices();
    renderHistory();
    showMessage(msg, '');
  }

  /* ---------- spin page ---------- */
  function initSpin() {
    const spinner = qs('#spinner');
    const spinBtn = qs('#spinBtn');
    const spinMsg = qs('#spinMsg');
    const historyList = qs('#historyList');

    function renderHistory() {
      const h = loadHistory();
      if (!h.length) { historyList.innerHTML = '<li class="empty">No history yet.</li>'; return; }
      historyList.innerHTML = h.map(it => `<li><strong>${escapeHtml(it.result)}</strong> <span class="muted">— ${new Date(it.time).toLocaleString()}</span></li>`).join('');
    }

    function loadAndEnsureChoices() {
      const choices = loadChoices().filter(isValidChoice);
      return choices;
    }

    function doSpin() {
      const choices = loadAndEnsureChoices();
      if (!choices.length) return showMessage(spinMsg, 'No choices available — go back and add some.');
      spinBtn.disabled = true;
      showMessage(spinMsg, 'Spinning...', '');

      // Animated roulette-like text: cycle through labels with easing slowdown
      const labels = choices.map(c => c.label);
      let duration = 2200 + Math.random() * 900; // ms
      const start = performance.now();
      let lastIdx = -1;

      return new Promise((res) => {
        function frame(t) {
          const elapsed = t - start;
          const p = Math.min(1, elapsed / duration);
          // easing out: slow near end
          const speed = 1 - Math.pow(p, 3);
          // choose index based on time and speed
          const idx = Math.floor(((elapsed / 40) * speed)) % labels.length;
          if (idx !== lastIdx) {
            spinner.textContent = labels[idx];
            lastIdx = idx;
          }
          if (p < 1) requestAnimationFrame(frame);
          else {
            // pick weighted winner
            const winner = weightedPick(choices);
            spinner.textContent = winner;
            spinner.classList.add('result');
            // save to history
            const h = loadHistory();
            h.unshift({ time: new Date().toISOString(), result: winner });
            saveHistory(h);
            showMessage(spinMsg, `Winner: ${winner}`, 'success');
            renderHistory();
            spinBtn.disabled = false;
            setTimeout(() => spinner.classList.remove('result'), 800);
            res(winner);
          }
        }
        requestAnimationFrame(frame);
      });
    }

    spinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showMessage(spinMsg, '');
      const choices = loadChoices().filter(isValidChoice);
      if (!choices.length) return showMessage(spinMsg, 'No saved choices — please add some first.');
      doSpin();
    });

    // show message and disable if no choices
    if (!loadChoices().filter(isValidChoice).length) {
      showMessage(spinMsg, 'No saved choices — go to Choices or Presets to add some.');
      spinBtn.disabled = true;
    }
    renderHistory();
  }

  /* ---------- presets page ---------- */
  function initPresets() {
    const presetsWrap = qs('#presetsWrap');
    const PRESETS = {
      "Lunch (favoured)": [
        { label: 'Pizza', weight: 5 },
        { label: 'Sushi', weight: 2 },
        { label: 'Salad', weight: 1 }
      ],
      "Even Split": [
        { label: 'A', weight: 1 },
        { label: 'B', weight: 1 },
        { label: 'C', weight: 1 }
      ],
      "Night Out": [
        { label: 'Movies', weight: 2 },
        { label: 'Bowling', weight: 1 },
        { label: 'Arcade', weight: 1 }
      ]
    };

    Object.entries(PRESETS).forEach(([id, arr]) => {
      const card = el('div', { className: 'card' });
      const h = el('h3', {}, id);
      const list = el('ul', { className: 'history-list' });
      list.innerHTML = arr.map(i => `<li>${escapeHtml(i.label)} <span class="muted">— ${i.weight}</span></li>`).join('');
      const btn = el('button', { className: 'primary' }, 'Use preset');
      btn.addEventListener('click', () => {
        if (!confirm(`Load preset “${id}”? This will overwrite your saved choices.`)) return;
        saveChoices(arr);
        setPresetKey(id);
        // go back to main flow
        window.location.href = 'index.html';
      });
      card.append(h, list, btn);
      presetsWrap.appendChild(card);
    });

    // small helper to show existing preset
    const current = localStorage.getItem(LS.PRESET);
    if (current) {
      const info = el('div', { className: 'muted small' }, `Current preset: ${current}`);
      presetsWrap.prepend(info);
    }
  }

  /* ---------- small utils ---------- */
  function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ---------- router ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.getAttribute('data-page');
    if (page === 'index') initIndex();
    else if (page === 'spin') initSpin();
    else if (page === 'presets') initPresets();
  });

})();
