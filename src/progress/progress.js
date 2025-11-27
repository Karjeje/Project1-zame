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
}
