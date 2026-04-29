import { PlayerStatus } from "./playerStatus.js";
import { getRank, addPointsToPlayer } from "./playerCore.js";

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

export function addPoints(amount) {
  if (!player) return;

  player = addPointsToPlayer(player, amount, 0);
  PlayerStatus.saveSolo(player);
}

export function renderSetup() {
  return `
    <input id="soloName" placeholder="Enter name">
    <button onclick="createSoloPlayer()">Start Solo</button>
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
        <p>Rank: ${getRank(player.points)}</p>

        <button onclick="soloAdd(1)">+ Success</button>
        <button onclick="soloAdd(-1)">- Fail</button>
      </div>
    </div>
  `;
}

// expose for buttons
window.createSoloPlayer = () => {
  const name = document.getElementById("soloName")?.value?.trim();
  document.getElementById("soloName").value = "";
  createSoloPlayer(name);
  window.renderAll();
};

window.soloAdd = (amt) => {
  addPoints(amt);
  window.renderAll();
};