/* =========================================================
   deadlines.js — assignment deadlines with per-item countdown
   ========================================================= */

function getDeadlines() {
  return Storage.get('deadlines', []);
}

function saveDeadlines(list) {
  Storage.set('deadlines', list);
}

function addDeadline(title, subjectId, date, priority) {
  const list = getDeadlines();
  list.push({ id: uid(), title, subjectId: subjectId || null, date, priority, done: false });
  saveDeadlines(list);
  renderDeadlines();
}

function toggleDeadline(id) {
  const list = getDeadlines();
  const d = list.find(d => d.id === id);
  if (d) {
    d.done = !d.done;
    saveDeadlines(list);
    renderDeadlines();
    if (typeof renderProgress === 'function') renderProgress();
  }
}

function deleteDeadline(id) {
  saveDeadlines(getDeadlines().filter(d => d.id !== id));
  renderDeadlines();
}

function renderDeadlines() {
  const container = document.getElementById('deadlineList');
  if (!container) return;

  const list = getDeadlines().slice().sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return new Date(a.date) - new Date(b.date);
  });

  if (list.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted)">No deadlines yet. Add your first assignment above.</p>';
    return;
  }

  container.innerHTML = list.map(d => {
    const days = daysBetween(d.date);
    let countdownText = '';
    let urgent = false;
    if (d.done) {
      countdownText = 'done';
    } else if (days < 0) {
      countdownText = `${Math.abs(days)}d overdue`;
      urgent = true;
    } else if (days === 0) {
      countdownText = 'due today';
      urgent = true;
    } else {
      countdownText = `${days}d left`;
      urgent = days <= 2;
    }

    const subjectTag = d.subjectId && subjectNameById(d.subjectId)
      ? `· ${escapeHtml(subjectNameById(d.subjectId))}` : '';

    return `
      <div class="panel deadline-item ${d.done ? 'is-done' : ''}">
        <input type="checkbox" ${d.done ? 'checked' : ''} onchange="toggleDeadline('${d.id}')">
        <div style="flex:1">
          <div class="deadline-item__title">${escapeHtml(d.title)}</div>
          <div class="deadline-item__meta">${d.date} ${subjectTag}</div>
        </div>
        <span class="priority-badge priority-${d.priority}">${d.priority}</span>
        <span class="deadline-countdown ${urgent ? 'is-urgent' : ''}">${countdownText}</span>
        <button class="btn btn--danger btn--sm" onclick="deleteDeadline('${d.id}')">✕</button>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderDeadlines();

  document.getElementById('deadlineForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('deadlineTitle').value.trim();
    const subjectId = document.getElementById('deadlineSubject').value;
    const date = document.getElementById('deadlineDate').value;
    const priority = document.getElementById('deadlinePriority').value;
    if (!title || !date) return;
    addDeadline(title, subjectId, date, priority);
    e.target.reset();
  });
});
