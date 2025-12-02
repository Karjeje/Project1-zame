import "./progress.css";

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
  const day = d.getDay();
  const diff = d.getDate() - day + 1;
  return new Date(d.setDate(diff));
}

function groupByWeek(activities, type) {
  const filtered = activities.filter((a) => a.type === type);

  const weeks = {};

  filtered.forEach((a) => {
    const weekStart = getWeekStart(a.date);
    const key = weekStart.toISOString().split("T")[0];

    if (!weeks[key]) weeks[key] = 0;

    weeks[key] += a.minutes;
  });

  return weeks;
}

//Draw graph on canvas
function drawGraph(weekData) {
  const canvas = document.getElementById("progress-canvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const entries = Object.entries(weekData).sort(([a], [b]) => new Date(a) - new Date(b));

  if (entries.length === 0) {
    ctx.font = "20px sans-serif";
    ctx.fillText = ("No data for this activity type", 20, 50);
    return;
  }

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
    ctx.fillText(week, x - 10, 370);

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
