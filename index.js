// ==========================
// FAST INIT (NON-BLOCKING)
// ==========================
document.addEventListener("DOMContentLoaded", () => {

// delay heavy tasks
setTimeout(initApp, 300);

});

// ==========================
// MAIN APP INIT
// ==========================
function initApp() {
populateLocations();
loadRoutes();
setupEvents();
hideLoader();
}

// ==========================
// LOCATIONS
// ==========================
const locations = [
"Aberdeen","Lumley","Juba","Wilkinson Road","Congo Cross","Goderich",
"Calaba Town","Wellington","Kissy","Shell","Waterloo","Hill Station",
"Brookfields","Fourah Bay","Allen Town","Boss Park","Cotton Tree"
];

// ==========================
// FARES
// ==========================
const fares = {
"Keke":{"Boss Park-Lumley":15,"Lumley-Aberdeen":10},
"Poda Poda":{"Waterloo-Kissy":25},
"Taxi":{"Boss Park-Aberdeen":80}
};

// ==========================
// POPULATE DROPDOWNS (FAST METHOD)
// ==========================
function populateLocations() {
const from = document.getElementById("from");
const to = document.getElementById("to");

let options = locations.map(l => `<option value="${l}">${l}</option>`).join("");

from.innerHTML = options;
to.innerHTML = options;
}

// ==========================
// EVENTS
// ==========================
function setupEvents() {

document.getElementById("calculateBtn").onclick = () => {

const start = from.value;
const end = to.value;
const type = document.getElementById("transportType").value;

// ❌ SAME LOCATION ERROR
if (start === end) {
showToast("Same location cannot be selected ❌");
return;
}

// fare logic
const key = `${start}-${end}`;
const fare =
fares[type]?.[key] ||
fares[type]?.[`${end}-${start}`] ||
Math.floor(Math.random() * 60) + 20;

const time = Math.floor(Math.random() * 40) + 10;

// UI OUTPUT (Uber style card)
document.getElementById("result").innerHTML = `
<div class="result-card">
<h3>🚗 Trip Summary</h3>
<p><b>${start}</b> → <b>${end}</b></p>
<p>💰 Fare: Le ${fare}</p>
<p>⏱ Time: ${time} mins</p>
</div>
`;
};

// theme toggle
document.getElementById("themeToggle").onclick = () => {
document.body.classList.toggle("dark");
};

}

// ==========================
// ROUTES (FAST RENDER)
// ==========================
function loadRoutes() {
const routes = [
"Boss Park → Lumley",
"Lumley → Aberdeen",
"Waterloo → Kissy",
"Kissy → Congo Cross"
];

document.getElementById("popularRoutes").innerHTML =
routes.map(r => `<div class="card">🛣 ${r}</div>`).join("");
}

// ==========================
// TOAST NOTIFICATION (UBER STYLE)
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
// LOADER FIX
// ==========================
function hideLoader() {
setTimeout(() => {
const loader = document.getElementById("loader");
if (loader) loader.style.display = "none";
}, 600);
}

// ==========================
// GOOGLE MAP (LAZY LOAD)
// ==========================
window.initMap = function () {
const freetown = { lat: 8.4657, lng: -13.2317 };

new google.maps.Map(document.getElementById("map"), {
center: freetown,
zoom: 12
});
};