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
  saveBtn.onclick = defaultSave;
  modal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

//Save activity
function defaultSave() {
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

  saveBtn.onclick = defaultSave;
}

//Helper functions
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//Render filters
function renderFilters(activities) {
  const types = ["All", ...new Set(activities.map((a) => a.type))];

  filtersEl.innerHTML = "";
  types.forEach((type) => {
    const btn = document.createElement("div");
    btn.classList.add("filter");
    btn.textContent = capitalize(type);

    btn.addEventListener("click", () => {
      render(type === "All" ? null : type);
    });

    filtersEl.appendChild(btn);
  });
}

//Render activity list
function renderList(activities) {
  listEl.innerHTML = "";

  activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((a) => {
      const item = document.createElement("div");
      item.classList.add("activity-item");

      item.innerHTML = `
        <div class="activity-type">${capitalize(a.type)}</div>
        <div>${a.minutes} min</div>
        <div>${new Date(a.date).toLocaleString()}</div>

        <div class="actions">
          <button class="edit-button">Edit</button>
          <button class="delete-button">X</button>
        </div>
    `;

      listEl.appendChild(item);

      item.querySelector(".delete-button").addEventListener("click", () => {
        const activities = loadActivities();
        const updated = activities.filter((x) => x.id !== a.id);
        saveActivities(updated);
        render();
      });

      item.querySelector(".edit-button").addEventListener("click", () => {
        selectInput.value = a.type;
        minInput.value = a.minutes;
        dateInput.value = a.date;

        modal.classList.remove("hidden");

        saveBtn.onclick = () => {
          const activities = loadActivities();

          const updatedActivities = activities.map((x) =>
            x.id === a.id
              ? {
                  ...x,
                  type: selectInput.value,
                  minutes: Number(minInput.value),
                  date: dateInput.value,
                }
              : x
          );

          saveActivities(updatedActivities);
          modal.classList.add("hidden");
          render();
        };
      });
    });
}

//Main render function
function render(filterType = null) {
  const activities = loadActivities();

  renderFilters(activities);

  const filtered =
    filterType === null ? activities : activities.filter((a) => a.type === filterType);

  renderList(filtered);
}

//Initial render
render();
