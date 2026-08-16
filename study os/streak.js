/* =========================================================
   streak.js — consecutive-day study streak
   A "study day" is counted whenever a focus session completes.
   ========================================================= */

function getStreak() {
  return Storage.get('streak', { lastDate: null, count: 0 });
}

function saveStreak(streak) {
  Storage.set('streak', streak);
}

function isoYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function markStudyActivityToday() {
  const streak = getStreak();
  const today = todayISO();

  if (streak.lastDate === today) {
    // already counted today
  } else if (streak.lastDate === isoYesterday()) {
    streak.count += 1;
    streak.lastDate = today;
  } else {
    streak.count = 1;
    streak.lastDate = today;
  }
  saveStreak(streak);
  renderStreak();
}

function renderStreak() {
  const streak = getStreak();
  // if last active day isn't today or yesterday, the streak has lapsed visually
  const lapsed = streak.lastDate && streak.lastDate !== todayISO() && streak.lastDate !== isoYesterday();
  const display = lapsed ? 0 : streak.count;

  const bar = document.getElementById('streakCount');
  if (bar) bar.textContent = display;
  const stat = document.getElementById('statStreak');
  if (stat) stat.textContent = display;
}

document.addEventListener('DOMContentLoaded', renderStreak);
