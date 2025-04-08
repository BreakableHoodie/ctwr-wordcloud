import { loadConfig, loadWords } from "./utils.js";
import { renderWordCloud } from "./cloud-display.js";
import { setupForm } from "./submission-form.js";

const params = new URLSearchParams(window.location.search);
const eventId = params.get("e");

if (!eventId) {
  document.body.innerHTML = "<p style='text-align:center;padding:2em;'>Missing event ID. Please use a link like <code>?e=example-event-2025</code></p>";
  throw new Error("Missing event ID");
}

const configPath = `http://localhost:3000/words?event=${eventId}`;

let apiBaseUrl = "";

async function init() {
  const status = document.getElementById("refreshStatus");
  if (status) {
    status.style.display = "block";
  }

  try {
    const config = await loadConfig(configPath);
    // If the backend config doesn't specify an API base URL, default to localhost:3000
    apiBaseUrl = config.apiBaseUrl || "http://localhost:3000";

    // Update page elements if config contains event details
    if (config.title) {
      document.title = config.title;
      document.getElementById("eventTitle").textContent = config.title;
    }
    if (config.subtitle) {
      document.getElementById("eventSubtitle").textContent = config.subtitle;
    }

    // Fetch the current words for the event from the backend
    const words = await loadWords(apiBaseUrl, eventId);
    renderWordCloud(words);

    setupForm(apiBaseUrl, eventId, () => refreshCloud());
  } catch (err) {
    alert("Failed to load event data.");
    console.error(err);
  } finally {
    if (status) {
      status.style.display = "none";
    }
  }
}

// On page load, check localStorage for theme preference
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  // Dark mode toggle button text update
  document.getElementById("darkToggle").textContent = document.body.classList.contains("dark") ? "🌞 Light Mode" : "🌙 Dark Mode";
});

// Dark mode toggle
document.getElementById("darkToggle").addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark");
  document.getElementById("darkToggle").textContent = isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

async function refreshCloud() {
  const status = document.getElementById("refreshStatus");
  status.style.display = "block";

  const words = await loadWords(apiBaseUrl, eventId);
  renderWordCloud(words);

  status.style.display = "none";
}

init(); 

// Auto-enable dark mode if user prefers dark color scheme
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.classList.add("dark");
}

document.getElementById("kioskToggle").addEventListener("click", () => {
  document.body.classList.toggle("kiosk");
});
