/* =========================================================
   app.js — dock navigation, ties all modules together
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const dockItems = document.querySelectorAll('.dock__item');

  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.module;

      dockItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');

      document.querySelectorAll('.module').forEach(m => m.classList.remove('is-active'));
      document.getElementById('module-' + target).classList.add('is-active');

      // Charts need a visible canvas to size correctly, so redraw on entry.
      if (target === 'progress' && typeof renderProgress === 'function') {
        renderProgress();
      }
    });
  });
});
