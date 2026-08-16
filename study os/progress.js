/* =========================================================
   progress.js — aggregate stats + Chart.js visualizations
   ========================================================= */

let subjectHoursChart = null;
let weekSessionsChart = null;

function renderProgress() {
  const subjects = getSubjects();
  const sessions = Storage.get('sessions', []);
  const deadlines = getDeadlines ? getDeadlines() : [];

  // ---- stat cards ----
  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);
  document.getElementById('statTotalHours').textContent = totalHours.toFixed(1) + 'h';
  document.getElementById('statSessions').textContent = sessions.length;
  document.getElementById('statTasksDone').textContent = deadlines.filter(d => d.done).length;
  renderStreak();

  // ---- theme-aware chart colors ----
  const styles = getComputedStyle(document.documentElement);
  const chartLine = styles.getPropertyValue('--chart-line').trim();
  const chartFill = styles.getPropertyValue('--chart-fill').trim();
  const chartGrid = styles.getPropertyValue('--chart-grid').trim();
  const chartTick = styles.getPropertyValue('--chart-tick').trim();

  // ---- chart: hours by subject ----
  const ctxSubjects = document.getElementById('chartSubjectHours');
  if (ctxSubjects) {
    if (subjectHoursChart) subjectHoursChart.destroy();
    subjectHoursChart = new Chart(ctxSubjects, {
      type: 'bar',
      data: {
        labels: subjects.map(s => s.name),
        datasets: [{
          label: 'Hours',
          data: subjects.map(s => Number(s.hours.toFixed(2))),
          backgroundColor: subjects.map(s => s.color),
          borderRadius: 6
        }]
      },
      options: chartBaseOptions(false, chartGrid, chartTick)
    });
  }

  // ---- chart: sessions over last 7 days ----
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    days.push({ iso, label: d.toLocaleDateString('en-GB', { weekday: 'short' }) });
  }
  const counts = days.map(d => sessions.filter(s => s.date === d.iso).length);

  const ctxWeek = document.getElementById('chartWeekSessions');
  if (ctxWeek) {
    if (weekSessionsChart) weekSessionsChart.destroy();
    weekSessionsChart = new Chart(ctxWeek, {
      type: 'line',
      data: {
        labels: days.map(d => d.label),
        datasets: [{
          label: 'Sessions',
          data: counts,
          borderColor: chartLine,
          backgroundColor: chartFill,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: chartLine
        }]
      },
      options: chartBaseOptions(true, chartGrid, chartTick)
    });
  }
}

function chartBaseOptions(isLine, gridColor, tickColor) {
  return {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: tickColor }, grid: { color: gridColor } },
      y: {
        ticks: { color: tickColor, stepSize: isLine ? 1 : undefined },
        grid: { color: gridColor },
        beginAtZero: true
      }
    }
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // charts render once the Progress module is first opened (see app.js),
  // but we also compute stat cards up front in case it's the initial view.
  renderProgress();
});