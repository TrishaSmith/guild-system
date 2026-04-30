import { PlayerStatus } from "./playerStatus.js";
import { getGuildRank, addRankPointsToPlayer } from "./playerCore.js";
import { renderStats } from "./playerCore.js";

let party = [];

// =========================
// 🧩 CREATE PARTY
// =========================
export function createParty(names) {
party = [];

names.forEach(name => {
party = PlayerStatus.addToParty(name || "Player", party);
});

PlayerStatus.saveParty(party);
}

// =========================
// 📥 LOAD PARTY
// =========================
export function loadParty() {
party = PlayerStatus.loadParty();
return party;
}

// =========================
// ➕ POINTS
// =========================
export function addRankPoints(index, amount) {
  party = loadParty();

  if (!party[index]) return;

  party[index] = addRankPointsToPlayer(party[index], amount, 0);

  PlayerStatus.saveParty(party);
}

// =========================
// 📊 TOTAL POINTS
// =========================
function getTotalRankPoints() {
return party.reduce((sum, p) => sum + p.points, 0);
}

// =========================
// 🧩 SETUP UI
// =========================
export function renderSetup() {
  return `
    <label>Party Size:</label>

    <input 
      id="partySizeInput" 
      type="number" 
      min="1" 
      max="10" 
      value="3"
      onchange="updatePartySize()"
    >

    <div id="partyNames"></div>

    <button onclick="createPartyFromUI()">Start Party</button>
  `;
}

// =========================
// 🧍 RENDER PARTY
// =========================
export function renderParty(openCards, toggleCard) {
  const party = loadParty();

  if (!party.length) return "<p>No party members</p>";

  let html = `<h3>Party Rank: ${getTotalRankPoints()}</h3>`;

  party.forEach((p, i) => {
    html += `
      <div class="player-card">

        <div class="card-header" onclick="toggleCard(this, ${i})">
          <strong>${p.name}</strong>
          <span>▼</span>
        </div>

        <div class="card-body ${openCards.has(i) ? "active" : ""}">
          <p>Points: ${p.points}</p>
          <p>Rank: ${getGuildRank(p.points)}</p>

          <div class="actions">
            <button onclick="partyAdd(${i}, 1)">+ Success</button>
            <button onclick="partyAdd(${i}, -1)">- Fail</button>
          </div>

          ${renderStats(p.stats)}

          <div class="actions">
            <button onclick="Dice.roll(${i})">🎲 Roll</button>
            <button class="btn-luck" onclick="Dice.roll(${i}, true)" ${p.stats?.luck <= 0 ? "disabled" : ""}>
              🍀 Use Luck
            </button>
            <button class="remove-btn" onclick="removePlayer(${i})">Remove</button>  
          </div>
        </div>

      </div>
    `;
  });

  return html; // ✅ correct place
}

// =========================
// ❌ REMOVE PLAYER (FIXED SCOPE BUG)
// =========================
export function removePlayer(index) {
  if (!confirm("Remove this player?")) return;

  const party = PlayerStatus.loadParty();
  party.splice(index, 1);
  PlayerStatus.saveParty(party);
}

// =========================
// 🌐 GLOBAL HOOKS
// =========================

// FIX: was missing UI bridge for setup
window.createPartyFromUI = () => {
  const size = document.getElementById("partySizeInput")?.value || 3;

  const names = [];

  for (let i = 0; i < size; i++) {
    const input = document.getElementById(`p${i}`);
    names.push(input?.value || `Player ${i + 1}`);
  }

  createParty(names);

  window.renderAll();
};

// FIX: missing import safety
window.partyAdd = (i, amt) => {
  addRankPoints(i, amt);
  window.renderAll();
};

window.removePlayer = (index) => {
  removePlayer(index);
  window.renderAll();
};