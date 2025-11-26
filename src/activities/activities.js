import "./activities.css";

//Load/save to localStorage
function loadActivities() {
  return JSON.parse(localStorage.getItem("activities")) || [];
}

function saveActivities(activities) {
  localStorage.setItem("activities", JSON.stringify(activities));
}

//Generate random ID
function uid() {
  return Math.random().toString(36).slice(2);
}

//DOM Elements
const filtersEl = document.getElementById("filters");
const listEl = document.getElementById("activity-list");

const newBtn = document.getElementById("new-activity-btn");
const modal = document.getElementById("activity-modal");
const saveBtn = document.getElementById("save-activity-btn");
const cancelBtn = document.getElementById("cancel-modal-btn");

const selectInput = document.getElementById("activity-type");
const minInput = document.getElementById("activity-minutes");
const dateInput = document.getElementById("activity-datetime");

//Modal controls
newBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

//Save activity
saveBtn.addEventListener("click", () => {
  const type = selectInput.value;
  const minutes = Number(minInput.value);
  const date = dateInput.value;

  if (!type || !minutes || !date) {
    alert("Please fill out all fields");
    return;
  }

  const activities = loadActivities();

  activities.push({
    id: uid(),
    type,
    minutes,
    date,
  });

  saveActivities(activities);
  modal.classList.add("hidden");
  render();
});
