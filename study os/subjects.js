/* =========================================================
   subjects.js — subject list, hours logged, dropdown sync
   ========================================================= */

function getSubjects() {
  return Storage.get('subjects', []);
}

function saveSubjects(list) {
  Storage.set('subjects', list);
}

function addSubject(name, color) {
  const list = getSubjects();
  list.push({ id: uid(), name, color, hours: 0 });
  saveSubjects(list);
  renderSubjects();
  syncSubjectDropdowns();
}

function deleteSubject(id) {
  saveSubjects(getSubjects().filter(s => s.id !== id));
  renderSubjects();
  syncSubjectDropdowns();
}

function addHoursToSubject(id, minutes) {
  if (!id) return;
  const list = getSubjects();
  const s = list.find(s => s.id === id);
  if (s) {
    s.hours += minutes / 60;
    saveSubjects(list);
    renderSubjects();
  }
}

function renderSubjects() {
  const container = document.getElementById('subjectList');
  if (!container) return;
  const subjects = getSubjects();

  if (subjects.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted)">No subjects yet. Add your first one above.</p>';
    return;
  }

  container.innerHTML = subjects.map(s => `
    <div class="panel subject-card" style="border-left-color:${s.color}">
      <span class="subject-card__name">${escapeHtml(s.name)}</span>
      <span class="subject-card__hours">${s.hours.toFixed(1)}h logged</span>
      <div class="subject-card__actions">
        <button class="btn btn--danger btn--sm" onclick="deleteSubject('${s.id}')">Remove</button>
      </div>
    </div>
  `).join('');
}

function syncSubjectDropdowns() {
  const subjects = getSubjects();
  const opts = subjects.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');

  const timerSelect = document.getElementById('timerSubjectSelect');
  if (timerSelect) {
    const current = timerSelect.value;
    timerSelect.innerHTML = '<option value="">General</option>' + opts;
    timerSelect.value = subjects.some(s => s.id === current) ? current : '';
  }

  const deadlineSelect = document.getElementById('deadlineSubject');
  if (deadlineSelect) {
    const current = deadlineSelect.value;
    deadlineSelect.innerHTML = '<option value="">No subject</option>' + opts;
    deadlineSelect.value = subjects.some(s => s.id === current) ? current : '';
  }
}

function subjectNameById(id) {
  const s = getSubjects().find(s => s.id === id);
  return s ? s.name : null;
}

function subjectColorById(id) {
  const s = getSubjects().find(s => s.id === id);
  return s ? s.color : '#8B91B8';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  renderSubjects();
  syncSubjectDropdowns();

  const form = document.getElementById('subjectForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('subjectName').value.trim();
    const color = document.getElementById('subjectColor').value;
    if (!name) return;
    addSubject(name, color);
    form.reset();
    document.getElementById('subjectColor').value = '#45D0C0';
  });
});
