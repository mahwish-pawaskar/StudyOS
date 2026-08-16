/* =========================================================
   theme.js — dark / pastel toggle
   The <html data-theme="..."> attribute is set as early as possible
   by an inline script in <head> to avoid a flash of the wrong theme.
   This file just wires up the toggle button and keeps it in sync.
   ========================================================= */

function getTheme() {
  return Storage.get('theme', 'pastel');
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  Storage.set('theme', theme);
  updateToggleButton(theme);
  // chart colors are theme-aware CSS vars, read at draw time —
  // redraw so any already-open Progress view picks up the new palette
  if (typeof renderProgress === 'function') renderProgress();
}

function updateToggleButton(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.textContent = theme === 'dark' ? '🌙' : '🌸';
  btn.title = theme === 'dark' ? 'Switch to pastel theme' : 'Switch to dark theme';
}

document.addEventListener('DOMContentLoaded', () => {
  updateToggleButton(getTheme());

  document.getElementById('themeToggle').addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'pastel' : 'dark');
  });
});