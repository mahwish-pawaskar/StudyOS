/* =========================================================
   notes.js — quick notes list + autosaving editor
   ========================================================= */

const NotesState = { currentId: null, saveTimer: null };

function getNotes() {
  return Storage.get('notes', []);
}

function saveNotes(list) {
  Storage.set('notes', list);
}

function createNote() {
  const list = getNotes();
  const note = { id: uid(), title: 'Untitled note', body: '', updatedAt: Date.now() };
  list.unshift(note);
  saveNotes(list);
  NotesState.currentId = note.id;
  renderNotesList();
  renderEditor();
  document.getElementById('noteTitle').focus();
}

function renderNotesList() {
  const container = document.getElementById('notesList');
  const notes = getNotes().slice().sort((a, b) => b.updatedAt - a.updatedAt);

  if (notes.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No notes yet.</p>';
    return;
  }

  if (!NotesState.currentId) NotesState.currentId = notes[0].id;

  container.innerHTML = notes.map(n => `
    <div class="note-list-item ${n.id === NotesState.currentId ? 'is-active' : ''}" onclick="selectNote('${n.id}')">
      ${escapeHtml(n.title || 'Untitled note')}
    </div>
  `).join('');
}

function selectNote(id) {
  NotesState.currentId = id;
  renderNotesList();
  renderEditor();
}

function renderEditor() {
  const note = getNotes().find(n => n.id === NotesState.currentId);
  const titleInput = document.getElementById('noteTitle');
  const bodyInput = document.getElementById('noteBody');

  if (!note) {
    titleInput.value = '';
    bodyInput.value = '';
    titleInput.disabled = true;
    bodyInput.disabled = true;
    return;
  }
  titleInput.disabled = false;
  bodyInput.disabled = false;
  titleInput.value = note.title;
  bodyInput.value = note.body;
}

function scheduleSave() {
  const indicator = document.getElementById('noteSavedIndicator');
  indicator.textContent = 'Saving…';
  clearTimeout(NotesState.saveTimer);
  NotesState.saveTimer = setTimeout(() => {
    const list = getNotes();
    const note = list.find(n => n.id === NotesState.currentId);
    if (note) {
      note.title = document.getElementById('noteTitle').value;
      note.body = document.getElementById('noteBody').value;
      note.updatedAt = Date.now();
      saveNotes(list);
      renderNotesList();
    }
    indicator.textContent = 'All changes saved';
  }, 400);
}

document.addEventListener('DOMContentLoaded', () => {
  renderNotesList();
  renderEditor();

  document.getElementById('newNoteBtn').addEventListener('click', createNote);
  document.getElementById('noteTitle').addEventListener('input', scheduleSave);
  document.getElementById('noteBody').addEventListener('input', scheduleSave);
});
