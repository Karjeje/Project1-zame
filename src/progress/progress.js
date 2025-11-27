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
