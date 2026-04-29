import * as Solo from "../Player/soloMode.js";
import * as Party from "../Player/partyMode.js";

let mode = localStorage.getItem("mode") || "solo";
let openCards = new Set();

// =========================
// 🎮 MODE SWITCH
// =========================
window.setMode = (m) => {
  mode = m;
  localStorage.setItem("mode", mode);
  renderAll();
};

// =========================
// 🧍 MODE DISPLAY
// =========================
function renderMode() {
  const el = document.getElementById("modeDisplay");
  if (el) el.innerText = `Current Mode: ${mode.toUpperCase()}`;
}

// =========================
// 🧩 SETUP UI (STRUCTURE ONLY)
// =========================
function renderSetup() {
  const setupEl = document.getElementById("playerSetup");
  if (!setupEl) return;

  setupEl.innerHTML =
  mode === "solo"
  ? Solo.renderSetup()
  : Party.renderSetup();
}

// =========================
// 👥 PARTY INPUTS (FIXED SEPARATION)
// =========================
function renderPartyInputs() {
  const container = document.getElementById("partyNames");
  if (!container || mode !== "party") return;

  const size = document.getElementById("partySizeInput")?.value || 3;

  let html = "";
  for (let i = 0; i < size; i++) {
    html += `<input id="p${i}" placeholder="Player ${i + 1} name"><br>`;
  }

  container.innerHTML = html;
}

// =========================
// 🃏 CARD TOGGLE
// =========================
function toggleCard(header, index) {
  const body = header.nextElementSibling;
  const isOpen = body.classList.toggle("active");

  header.querySelector("span").classList.toggle("open");

  if (isOpen) openCards.add(index);
  else openCards.delete(index);
}

window.toggleCard = toggleCard;

// =========================
// 🔁 MAIN RENDER LOOP
// =========================
function renderAll() {
  renderMode();
  renderSetup();

  // 🧠 delay ensures DOM exists
  if (mode === "party") {
    setTimeout(renderPartyInputs, 0);
  }

  const soloEl = document.getElementById("playerInfo");
  const partyEl = document.getElementById("partyContainer");

  if (mode === "solo") {
    partyEl.innerHTML = "";
    soloEl.innerHTML = Solo.renderSolo(openCards, toggleCard);
  } else {
    soloEl.innerHTML = "";
    partyEl.innerHTML = Party.renderParty(openCards, toggleCard);
  }
}

// =========================
// 🌐 GLOBAL HOOKS
// =========================
window.renderAll = renderAll;

window.updatePartySize = () => {
  renderPartyInputs();
};

// =========================
// 🚀 INIT
// =========================
renderAll();
