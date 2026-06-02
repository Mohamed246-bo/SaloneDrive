// ==========================
// FAST INIT (NON-BLOCKING)
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initApp, 300);
});

// ==========================
// MAIN APP INIT
// ==========================
function initApp() {
  try {
    populateLocations();
    loadRoutes();
    setupEvents();
    loadTheme();
    hideLoader();
  } catch (error) {
    console.error("Init error:", error);
  }
}

// ==========================
// LOCATIONS
// ==========================
const locations = [
  "Aberdeen", "Lumley", "Juba", "Wilkinson Road", "Congo Cross", "Goderich",
  "Calaba Town", "Wellington", "Kissy", "Shell", "Waterloo", "Hill Station",
  "Brookfields", "Fourah Bay", "Allen Town", "Boss Park", "Cotton Tree"
];

// ==========================
// FARES
// ==========================
const fares = {
  "Keke": { "Boss Park-Lumley": 15, "Lumley-Aberdeen": 10 },
  "Poda Poda": { "Waterloo-Kissy": 25 },
  "Taxi": { "Boss Park-Aberdeen": 80 }
};

// ==========================
// POPULATE DROPDOWNS
// ==========================
function populateLocations() {
  const from = document.getElementById("from");
  const to = document.getElementById("to");

  if (!from || !to) {
    console.warn("Location selects not found");
    return;
  }

  let options = locations.map(l => `<option value="${l}">${l}</option>`).join("");

  from.innerHTML = `<option value="">Select location...</option>` + options;
  to.innerHTML = `<option value="">Select location...</option>` + options;
}

// ==========================
// SETUP EVENTS
// ==========================
function setupEvents() {
  const calculateBtn = document.getElementById("calculateBtn");
  const themeToggle = document.getElementById("themeToggle");

  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateFare);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

// ==========================
// CALCULATE FARE
// ==========================
function calculateFare() {
  const from = document.getElementById("from");
  const to = document.getElementById("to");
  const transportType = document.getElementById("transportType");
  const resultDiv = document.getElementById("result");

  if (!from || !to || !transportType || !resultDiv) {
    showToast("Error: Required elements not found ❌");
    return;
  }

  const start = from.value;
  const end = to.value;
  const type = transportType.value;

  if (!start || !end) {
    showToast("Please select both locations ❌");
    return;
  }

  if (start === end) {
    showToast("Same location cannot be selected ❌");
    return;
  }

  const key = `${start}-${end}`;
  let fare = fares[type]?.[key] || fares[type]?.[`${end}-${start}`];

  if (!fare) {
    fare = Math.floor(Math.random() * 60) + 20;
  }

  const time = Math.floor(Math.random() * 40) + 10;

  resultDiv.innerHTML = `
    <div class="result-card">
      <h3>🚗 Trip Summary</h3>
      <p><b>${escapeHtml(start)}</b> → <b>${escapeHtml(end)}</b></p>
      <p>💰 Fare: Le ${fare}</p>
      <p>⏱ Time: ${time} mins</p>
      <button onclick="bookRide('${escapeHtml(start)}', '${escapeHtml(end)}', ${fare}, '${type}')">Book Now</button>
    </div>
  `;

  showToast("✅ Fare calculated successfully!");
}

// ==========================
// TOGGLE THEME
// ==========================
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

// ==========================
// LOAD THEME
// ==========================
function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
}

// ==========================
// LOAD ROUTES
// ==========================
function loadRoutes() {
  const routes = [
    "Boss Park → Lumley",
    "Lumley → Aberdeen",
    "Waterloo → Kissy",
    "Kissy → Congo Cross"
  ];

  const popularRoutesDiv = document.getElementById("popularRoutes");
  if (popularRoutesDiv) {
    popularRoutesDiv.innerHTML = routes
      .map(r => `<div class="card">🛣 ${r}</div>`)
      .join("");
  }
}

// ==========================
// TOAST NOTIFICATION
// ==========================
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ==========================
// ESCAPE HTML
// ==========================
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ==========================
// BOOK RIDE
// ==========================
function bookRide(from, to, fare, type) {
  showToast(`✅ Booking ${type} from ${from} to ${to}...`);
  console.log("Booking:", { from, to, fare, type });
}

// ==========================
// HIDE LOADER
// ==========================
function hideLoader() {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = "none";
    }
  }, 600);
}

// ==========================
// GOOGLE MAP
// ==========================
window.initMap = function () {
  const freetown = { lat: 8.4657, lng: -13.2317 };

  const mapElement = document.getElementById("map");
  if (mapElement && typeof google !== "undefined") {
    new google.maps.Map(mapElement, {
      center: freetown,
      zoom: 12
    });
  }
};