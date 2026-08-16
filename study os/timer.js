/* =========================================================
   timer.js — Pomodoro engine, ring animation, session logging
   ========================================================= */

const RING_CIRCUMFERENCE = 2 * Math.PI * 90; // r=90

const TimerState = {
  focusLen: 25,   // minutes
  breakLen: 5,    // minutes
  mode: 'focus',  // 'focus' | 'break'
  remaining: 25 * 60, // seconds
  total: 25 * 60,
  running: false,
  handle: null
};

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  document.getElementById('timerDisplay').textContent = formatTime(TimerState.remaining);
  document.getElementById('timerMode').textContent = TimerState.mode === 'focus' ? 'FOCUS' : 'BREAK';

  const progress = 1 - TimerState.remaining / TimerState.total;
  const offset = RING_CIRCUMFERENCE * (1 - progress);
  const ring = document.getElementById('timerRingProgress');
  ring.style.strokeDasharray = RING_CIRCUMFERENCE;
  ring.style.strokeDashoffset = offset;
  ring.style.stroke = TimerState.mode === 'focus' ? 'var(--amber)' : 'var(--teal)';

  const indicator = document.getElementById('focusIndicator');
  if (indicator) {
    indicator.textContent = TimerState.running
      ? (TimerState.mode === 'focus' ? 'focusing…' : 'on break')
      : 'idle';
  }

  renderSessionsToday();
}

function renderSessionsToday() {
  const el = document.getElementById('sessionsToday');
  if (!el) return;
  const sessions = Storage.get('sessions', []);
  el.textContent = sessions.filter(s => s.date === todayISO()).length;
}

function startTimer() {
  if (TimerState.running) return;
  TimerState.running = true;
  document.getElementById('timerStartBtn').disabled = true;
  document.getElementById('timerPauseBtn').disabled = false;

  TimerState.handle = setInterval(() => {
    TimerState.remaining--;
    if (TimerState.remaining <= 0) {
      completeSegment();
    } else {
      renderTimer();
    }
  }, 1000);
  renderTimer();
}

function pauseTimer() {
  TimerState.running = false;
  clearInterval(TimerState.handle);
  document.getElementById('timerStartBtn').disabled = false;
  document.getElementById('timerPauseBtn').disabled = true;
  renderTimer();
}

function resetTimer() {
  pauseTimer();
  TimerState.mode = 'focus';
  TimerState.total = TimerState.focusLen * 60;
  TimerState.remaining = TimerState.total;
  renderTimer();
}

function completeSegment() {
  clearInterval(TimerState.handle);

  if (TimerState.mode === 'focus') {
    // log the finished focus session
    const subjectId = document.getElementById('timerSubjectSelect').value;
    const sessions = Storage.get('sessions', []);
    sessions.push({ id: uid(), date: todayISO(), subjectId: subjectId || null, minutes: TimerState.focusLen });
    Storage.set('sessions', sessions);
    if (subjectId) addHoursToSubject(subjectId, TimerState.focusLen);
    if (typeof markStudyActivityToday === 'function') markStudyActivityToday();

    TimerState.mode = 'break';
    TimerState.total = TimerState.breakLen * 60;
  } else {
    TimerState.mode = 'focus';
    TimerState.total = TimerState.focusLen * 60;
  }

  TimerState.remaining = TimerState.total;
  TimerState.running = false;
  document.getElementById('timerStartBtn').disabled = false;
  document.getElementById('timerPauseBtn').disabled = true;
  renderTimer();

  if (typeof renderProgress === 'function') renderProgress();
}

document.addEventListener('DOMContentLoaded', () => {
  renderTimer();

  document.getElementById('timerStartBtn').addEventListener('click', startTimer);
  document.getElementById('timerPauseBtn').addEventListener('click', pauseTimer);
  document.getElementById('timerResetBtn').addEventListener('click', resetTimer);

  document.querySelectorAll('.timer-lengths .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.timer-lengths .chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      TimerState.focusLen = parseInt(chip.dataset.focus, 10);
      TimerState.breakLen = parseInt(chip.dataset.break, 10);
      resetTimer();
    });
  });
});
