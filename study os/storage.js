/* =========================================================
   storage.js — thin wrapper around localStorage
   All Study OS data lives under keys prefixed "studyos_"
   ========================================================= */

const Storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem('studyos_' + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      console.error('Storage.get failed for', key, e);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem('studyos_' + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage.set failed for', key, e);
      return false;
    }
  }
};

// Small id generator so we don't need external deps
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function daysBetween(dateISO) {
  const target = new Date(dateISO + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((target - now) / 86400000);
}
