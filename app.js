// =====================================================
// 🧠 STATE
// =====================================================
let mode = localStorage.getItem("mode") || "solo";
let player = JSON.parse(localStorage.getItem("player")) || null;
let party = JSON.parse(localStorage.getItem("party")) || [];
let partySize = 3;

// =====================================================
// 🧠 FIX SAVED DATA (ensure stats exist)
// =====================================================
function ensureStats(p) {
  if (!p.stats) {
    p.stats = PlayerStatus.generateStats();
  }
  return p;
}

player = player ? ensureStats(player) : null;
party = party.map(ensureStats);

// =====================================================
// 🎮 MODE
// =====================================================
function setMode(selected) {
  mode = selected;
  localStorage.setItem("mode", mode);

  renderAll();
}

function renderMode() {
  const el = document.getElementById("modeDisplay");
  if (el) el.innerText = `Current Mode: ${mode.toUpperCase()}`;
}

// =====================================================
// 🧩 SETUP UI
// =====================================================
function renderSetup() {
  const div = document.getElementById("playerSetup");
  if (!div) return;

  if (mode === "solo") {
    div.innerHTML = `
      <input id="soloName" placeholder="Enter name">
      <button onclick="createSoloPlayer()">Start Solo</button>
    `;
  }

  if (mode === "party") {
    div.innerHTML = `
      <label>Party Size:</label>
      <input type="number" min="1" max="10"
        id="partySizeInput"
        value="${partySize}"
        onchange="updatePartySize()">

      <div id="partyNames"></div>
      <button onclick="createParty()">Start Party</button>
    `;

    renderPartyInputs();
  }
}

function renderPartyInputs() {
  const div = document.getElementById("partyNames");
  if (!div) return;

  let html = "";
  for (let i = 0; i < partySize; i++) {
    html += `<input id="p${i}" placeholder="Player ${i + 1} name"><br>`;
  }
  div.innerHTML = html;
}

function updatePartySize() {
  partySize = parseInt(document.getElementById("partySizeInput").value) || 1;
  renderPartyInputs();
}

// =====================================================
// 👤 CREATE PLAYERS
// =====================================================
function createSoloPlayer() {
  const name = document.getElementById("soloName").value.trim();
  if (!name) return alert("Enter a name");

  player = PlayerStatus.create(name);
  localStorage.setItem("player", JSON.stringify(player));

  renderAll();
}

function createParty() {
  party = [];

  for (let i = 0; i < partySize; i++) {
    const input = document.getElementById(`p${i}`);
    const name = input?.value?.trim() || `Player ${i + 1}`;

    party.push(PlayerStatus.create(name));
  }

  localStorage.setItem("party", JSON.stringify(party));
  renderAll();
}

// =====================================================
// 🧍 RENDER PLAYERS
// =====================================================
function renderPlayers() {
  const soloEl = document.getElementById("playerInfo");
  const partyEl = document.getElementById("partyContainer");

  if (!soloEl || !partyEl) return;

  if (mode === "solo") {
    partyEl.innerHTML = "";

    if (!player) {
      soloEl.innerHTML = "<p>No player created</p>";
      return;
    }

    PlayerStatus.renderSolo(player);
  }

  if (mode === "party") {
    soloEl.innerHTML = "";

    if (!party.length) {
      partyEl.innerHTML = "<p>No party members</p>";
      return;
    }

    PlayerStatus.renderParty(party);
  }
}

// =====================================================
// ❌ REMOVE PLAYER
// =====================================================
function removePlayer(index) {
  if (!confirm("Remove this player?")) return;

  party.splice(index, 1);
  localStorage.setItem("party", JSON.stringify(party));

  renderAll();
}

// =====================================================
// 🎮 COLLAPSE CARD
// =====================================================
function toggleCard(header) {
  const body = header.nextElementSibling;
  body.style.display = body.style.display === "none" ? "block" : "none";
}

// =====================================================
// 🧠 DRAG & DROP
// =====================================================
let draggedIndex = null;

function dragStart(e, index) {
  draggedIndex = index;
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e, index) {
  e.preventDefault();

  const temp = party[draggedIndex];
  party[draggedIndex] = party[index];
  party[index] = temp;

  localStorage.setItem("party", JSON.stringify(party));
  renderAll();
}

// =====================================================
// 📊 RANK SYSTEM
// =====================================================
function getRank(points) {
  if (points <= 5) return "F";
  if (points <= 10) return "D";
  if (points <= 15) return "C";
  if (points <= 20) return "B";
  if (points <= 25) return "A";
  if (points <= 30) return "S";
  if (points <= 35) return "SS";
  return "SSS";
}

function getTotalPoints() {
  if (mode === "solo") return player?.points || 0;
  return party.reduce((s, p) => s + p.points, 0);
}

function getCurrentRank() {
  return getRank(getTotalPoints());
}

// =====================================================
// ➕ POINT SYSTEM
// =====================================================
function addPoints(amount, index = null, missionLevel = 0) {
  if (mode === "solo") {
    if (!player) return;

    player.points = Math.max(0, player.points + amount);
    if (amount > 0 && missionLevel === 0) player.level0Complete++;

    localStorage.setItem("player", JSON.stringify(player));
  } else {
    const p = party[index];
    if (!p) return;

    p.points = Math.max(0, p.points + amount);
    if (amount > 0 && missionLevel === 0) p.level0Complete++;

    localStorage.setItem("party", JSON.stringify(party));
  }

  renderAll();
}

// =====================================================
// 📜 MISSIONS
// =====================================================
const missions = [
  { level: 0, name: "Fix a bug in a loop" },
  { level: 1, name: "Write a palindrome function" },
  { level: 2, name: "Implement a stack" },
  { level: 3, name: "Solve a recursion problem" },
  { level: 4, name: "Optimize sorting algorithm" },
  { level: 5, name: "Build pathfinding logic" },
];

function generateBoard() {
  const container = document.getElementById("missions");
  if (!container) return;

  container.innerHTML = "";

  const rank = getCurrentRank();

  missions.forEach(m => {
    const allowed = isMissionAllowed(rank, m.level);

    const div = document.createElement("div");
    div.className = "mission";

    div.innerHTML = `
      <strong>Level ${m.level}</strong>
      <p>${m.name}</p>
      <p>${allowed ? "✅ Available" : "❌ Locked"}</p>
      ${allowed ? `<button onclick="completeMission(${m.level})">Complete</button>` : ""}
    `;

    container.appendChild(div);
  });
}

// =====================================================
// 🔒 RULES
// =====================================================
function isMissionAllowed(rank, level) {
  const rankAccess = { F:1, D:2, C:3, B:4, A:5, S:6, SS:6, SSS:6 };

  if (level === 1) return checkRule(1);
  return level <= rankAccess[rank];
}

const unlockRules = { 1: "level0_avg_2", 2: "" };

function checkRule(level) {
  if (unlockRules[level] !== "level0_avg_2") return true;
  if (!party.length) return false;

  const avg = party.reduce((s, p) => s + p.level0Complete, 0) / party.length;
  return avg >= 2;
}

// =====================================================
// 🏁 COMPLETE MISSION
// =====================================================
function completeMission(level) {
  const pointsMap = { 0:1, 1:2, 2:3, 3:4, 4:5, 5:6 };
  const reward = pointsMap[level] || 1;

  if (mode === "solo") {
    addPoints(reward, null, level);
  } else {
    party.forEach(p => {
      p.points += reward;
      if (level === 0) p.level0Complete++;
    });

    localStorage.setItem("party", JSON.stringify(party));
  }

  renderAll();
  alert(`Mission complete! +${reward} points`);
}

function toggleDropdown(header) {
  const body = header.nextElementSibling;

  body.style.display =
    body.style.display === "none" ? "block" : "none";
}

// =====================================================
// 🔄 RENDER ALL
// =====================================================
function renderAll() {
  renderMode();
  renderSetup();
  renderPlayers();
}

renderAll();