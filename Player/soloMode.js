import { PlayerStatus } from "./playerStatus.js";
import { getGuildRank, addRankPointsToPlayer } from "./playerCore.js";
import { renderStats } from "./playerCore.js";

let player = null;

// =========================
// 🧩 CREATE SOLO PLAYER
// =========================
export function createSoloPlayer(name) {
  if (!name) return alert("Enter a name");

  player = PlayerStatus.create(name);
  PlayerStatus.saveSolo(player);

  player = PlayerStatus.loadSolo(); // ✅ keeps memory in sync
}

// =========================
// 📥 LOAD SOLO PLAYER
// =========================
export function loadSolo() {
  player = PlayerStatus.loadSolo();
  return player;
}

// =========================
// ➕ POINTS
// =========================
export function addRankPoints(amount) {
  if (!player) return;

  player = addRankPointsToPlayer(player, amount, 0);
  PlayerStatus.saveSolo(player);

  player = PlayerStatus.loadSolo(); // ✅ sync after save
}

// =========================
// 🧩 SETUP UI
// =========================
export function renderSetup() {
  return `
    <input id="soloName" placeholder="Enter name">
    <button onclick="createSoloPlayerFromUI()">Start Solo</button>
  `;
}

// =========================
// 🧍 RENDER SOLO
// =========================
export function renderSolo(openCards, toggleCard) {
  const player = PlayerStatus.loadSolo(); // ✅ FIX: no state mutation in render

  if (!player) return "<p>No player created</p>";

  return `
    <div class="player-card">

      <div class="card-header" onclick="toggleCard(this, 0)">
        <strong>${player.name}</strong>
        <span>▼</span>
      </div>

      <div class="card-body ${openCards.has(0) ? "active" : ""}">
        <p>Points: ${player.points}</p>
        <p>Rank: ${getGuildRank(player.points)}</p>

        <div class="actions">
          <button onclick="soloAdd(1)">+ Success</button>
          <button onclick="soloAdd(-1)">- Fail</button>
        </div>

        ${renderStats(player.stats)}

        <div class="actions">
          <button onclick="Dice.roll(0)">🎲 Roll</button>

          <button class="btn-luck"
            onclick="Dice.roll(0, true)"
            ${(Number(player.stats?.luck) || 0) <= 0 ? "disabled" : ""}>
            🍀 Use Luck
          </button>

          <button class="remove-btn" onclick="clearSoloPlayer()">Remove</button>
        </div>

      </div>
    </div>
  `;
}

// =========================
// 🌐 GLOBAL HOOKS
// =========================
window.createSoloPlayerFromUI = () => {
  const name = document.getElementById("soloName")?.value?.trim();

  if (!name) return alert("Enter a name");

  createSoloPlayer(name);

  document.getElementById("soloName").value = "";

  window.renderAll();
};

window.soloAdd = (amt) => {
  addRankPoints(amt);
  window.renderAll();
};

// =========================
// ❌ OPTIONAL CLEANUP ACTION
// =========================
window.clearSoloPlayer = () => {
  PlayerStatus.saveSolo(null);
  player = null;
  window.renderAll();
};