/* =========================================================
   clock.js — drives the live clock in the status bar
   ========================================================= */

function tickClock() {
  const now = new Date();
  const timeEl = document.getElementById('clockTime');
  const dateEl = document.getElementById('clockDate');
  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
  }
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  }
}

setInterval(tickClock, 1000);
document.addEventListener('DOMContentLoaded', tickClock);
