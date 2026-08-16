/* =========================================================
   exams.js — exam countdowns + nearest-exam status bar readout
   ========================================================= */

function getExams() {
  return Storage.get('exams', []);
}

function saveExams(list) {
  Storage.set('exams', list);
}

function addExam(name, date) {
  const list = getExams();
  list.push({ id: uid(), name, date });
  saveExams(list);
  renderExams();
  updateExamStatusBar();
}

function deleteExam(id) {
  saveExams(getExams().filter(e => e.id !== id));
  renderExams();
  updateExamStatusBar();
}

function renderExams() {
  const container = document.getElementById('examList');
  if (!container) return;

  const list = getExams().slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  if (list.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted)">No exams added. Add one above to start the countdown.</p>';
    return;
  }

  container.innerHTML = list.map(ex => {
    const days = daysBetween(ex.date);
    const isPast = days < 0;
    return `
      <div class="panel exam-card" style="${isPast ? 'opacity:0.4' : ''}">
        <span class="exam-card__days">${isPast ? 'past' : days}</span>
        ${isPast ? '' : '<span class="exam-card__unit">days left</span>'}
        <div class="exam-card__name">${escapeHtml(ex.name)}</div>
        <div class="exam-card__date">${ex.date}</div>
        <div style="margin-top:8px">
          <button class="btn btn--danger btn--sm" onclick="deleteExam('${ex.id}')">Remove</button>
        </div>
      </div>
    `;
  }).join('');
}

function updateExamStatusBar() {
  const upcoming = getExams()
    .map(e => ({ ...e, days: daysBetween(e.date) }))
    .filter(e => e.days >= 0)
    .sort((a, b) => a.days - b.days);

  const el = document.getElementById('examCountdownMini');
  if (!el) return;

  if (upcoming.length === 0) {
    el.textContent = '— set one —';
    return;
  }
  const next = upcoming[0];
  el.textContent = `${next.name} · ${next.days}d`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderExams();
  updateExamStatusBar();

  document.getElementById('examForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('examName').value.trim();
    const date = document.getElementById('examDate').value;
    if (!name || !date) return;
    addExam(name, date);
    e.target.reset();
  });
});
