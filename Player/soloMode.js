import { PlayerStatus } from "./playerStatus.js";
import { getGuildRank, addRankPointsToPlayer } from "./playerCore.js";
import { renderStats } from "./playerCore.js";

let player = null;

export function createSoloPlayer(name) {
  if (!name) return alert("Enter a name");

  player = PlayerStatus.create(name);
  PlayerStatus.saveSolo(player);
}

export function loadSolo() {
  player = PlayerStatus.loadSolo();
  return player;
}

export function addRankPoints(amount) {
  if (!player) return;

  player = addRankPointsToPlayer(player, amount, 0);
  PlayerStatus.saveSolo(player);
}

export function renderSetup() {
  return `
    <input id="soloName" placeholder="Enter name">
    <button onclick="createSoloPlayerFromUI()">Start Solo</button>
  `;
}

export function renderSolo(openCards, toggleCard) {
  player = loadSolo();

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
          <button class="btn-luck" onclick="Dice.roll(0, true)" ${player.stats?.luck <= 0 ? "disabled" : ""}>
            🍀 Use Luck
          </button>
          <button class="remove-btn" onclick="removePlayer(0)">Remove</button>  
        </div>
        
      </div>
    </div>
  `;
}

// expose for buttons
// window.createSoloPlayer = () => {
//   const name = document.getElementById("soloName")?.value?.trim();
//   document.getElementById("soloName").value = "";
//   createSoloPlayer(name);
//   window.renderAll();
// };

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