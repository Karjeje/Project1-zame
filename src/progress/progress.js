import "./progress.css";

//Load activities
function loadActivities() {
  return JSON.parse(localStorage.getItem("activities")) || [];
}

//Get unique activity types
function getTypes(activities) {
  return [...new Set(activities.map((a) => a.type))];
}
