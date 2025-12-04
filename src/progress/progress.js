import "./progress.css";

//Helper functions
function cap(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDateLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatWeekStart(startingDate) {
  const startingD = new Date(startingDate);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const startingDay = String(startingD.getDate()).padStart(2, "0");
  const startingMonth = months[startingD.getMonth()];

  // const endingD = new Date(startingD);
  // endingD.setDate(endingD.getDate() + 6);

  // const endingDay = String(endingD.getDate()).padStart(2, "0");
  // const endingMonth = months[endingD.getMonth()];

  return `${startingMonth} ${startingDay}`;
}

//Load activities
function loadActivities() {
  return JSON.parse(localStorage.getItem("activities")) || [];
}

//Get unique activity types
function getTypes(activities) {
  return [...new Set(activities.map((a) => a.type))];
}

//Group activities into weeks
function getWeekStart(date) {
  const d = new Date(date);
  const jsDay = d.getDay(); // 0–6 (Sun–Sat)
  const mondayBased = (jsDay + 6) % 7; // 0–6 (Mon–Sun)

  d.setDate(d.getDate() - mondayBased);
  return d;
}

// function groupByWeek(activities, type) {
//   const filtered = activities.filter((a) => a.type === type);

//   const weeks = {};

//   filtered.forEach((a) => {
//     const weekStart = getWeekStart(a.date);
//     const key = formatDateLocal(weekStart);

//     if (!weeks[key]) weeks[key] = 0;

//     weeks[key] += a.minutes;
//   });

//   return weeks;
// }

//Draw graph on canvas
function drawGraph(weekData) {
  const canvas = document.getElementById("progress-canvas");
  const ctx = setupCanvas(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const entries = Object.entries(weekData);

  const maxMinutes = Math.max(...entries.map((e) => e[1]));
  const barWidth = 50;
  const gap = 20;

  entries.forEach(([week, minutes], i) => {
    const x = i * (barWidth + gap) + 50;
    const h = (minutes / maxMinutes) * 300;

    ctx.fillStyle = "#4e79a7";
    ctx.fillRect(x, 350 - h, barWidth, h);

    ctx.fillStyle = "black";
    ctx.font = "12px sans-serif";
    ctx.fillText(week, x - 5, 370);

    const hours = (minutes / 60).toFixed(1);
    ctx.fillText(hours + "h", x + 5, 350 - h - 5);
  });
}

//Render tabs
function renderTabs(types) {
  const tabsEl = document.getElementById("type-tabs");
  tabsEl.innerHTML = "";

  types.forEach((type) => {
    const t = document.createElement("div");
    t.classList.add("tab");
    t.textContent = cap(type);

    t.addEventListener("click", () => {
      renderGraph(type);
    });

    tabsEl.appendChild(t);
  });
}

//Render graph
function renderGraph(type) {
  const activities = loadActivities();
  const weekData = groupByWeek(activities, type);
  drawGraph(weekData);
}

//Initialize
function init() {
  const activities = loadActivities();
  const types = getTypes(activities);

  renderTabs(types);

  if (types.length > 0) renderGraph(types[0]);
}

init();

//Attempt at making a better graph
function buildLast12Weeks() {
  const weeks = [];
  const today = new Date();

  const currentWeekStart = getWeekStart(today);

  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - i * 7);
    weeks.push(formatDateLocal(d));
  }

  return weeks;
}

function groupByWeek(activities, type) {
  const filtered = activities.filter((a) => a.type === type);

  const rawWeeks = {};

  filtered.forEach((a) => {
    const key = formatDateLocal(getWeekStart(a.date));
    rawWeeks[key] = (rawWeeks[key] || 0) + a.minutes;
  });

  const fullWeeks = {};
  const last12 = buildLast12Weeks();

  last12.forEach((week) => {
    fullWeeks[week] = rawWeeks[week] || 0;
  });

  return fullWeeks;
}

//Sharper graphics
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  return ctx;
}
