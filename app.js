// =====================================================
// 🧠 STATE
// =====================================================
let mode = localStorage.getItem("mode") || "solo";
let player = JSON.parse(localStorage.getItem("player")) || null;
let party = JSON.parse(localStorage.getItem("party")) || [];
let partySize = 3;

// =====================================================
// 🎮 MODE SYSTEM
// =====================================================
function setMode(selected) {
  mode = selected;
  localStorage.setItem("mode", mode);

  renderSetup();
  renderAll();
}

function renderMode() {
  const el = document.getElementById("modeDisplay");
  if (el) el.innerText = `Current Mode: ${mode.toUpperCase()}`;
}

// =====================================================
// 🧩 SETUP UI (SOLO / PARTY)
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
      <input type="number" min="1" max="10" value="${partySize}"
        id="partySizeInput" onchange="updatePartySize()">

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
  const val = parseInt(document.getElementById("partySizeInput").value);
  partySize = val;
  renderPartyInputs();
}

// =====================================================
// 👤 PLAYER CREATION
// =====================================================
function createSoloPlayer() {
  const name = document.getElementById("soloName").value.trim();
  if (!name) return alert("Enter a name");

  player = { name, points: 0, level0Complete: 0 };
  localStorage.setItem("player", JSON.stringify(player));

  renderAll();
}

function createParty() {
  party = [];

  for (let i = 0; i < partySize; i++) {
    const input = document.getElementById(`p${i}`);
    const name = input?.value?.trim() || `Player ${i + 1}`;

    party.push({
      name,
      points: 0,
      level0Complete: 0
    });
  }

  localStorage.setItem("party", JSON.stringify(party));
  renderAll();
}

// =====================================================
// 🧠 RULE ENGINE
// =====================================================
const unlockRules = {
  1: "level0_avg_2",
  2: ""
};

function checkRule(level) {
  const rule = unlockRules[level];

  if (rule === "level0_avg_2") {
    if (party.length === 0) return false;

    const avg =
      party.reduce((s, p) => s + p.level0Complete, 0) / party.length;

    return avg >= 2;
  }

  return true;
}

// =====================================================
// 🧍 PLAYER DISPLAY
// =====================================================
function renderPlayers() {
  const div = document.getElementById("playerInfo");
  if (!div) return;

  if (mode === "solo") {
    if (!player) {
      div.innerHTML = "<p>No player created</p>";
      return;
    }

    div.innerHTML = `
      <strong>${player.name}</strong>
      <p>Points: ${player.points}</p>
      <p>Rank: ${getRank(player.points)}</p>
      <button onclick="addPoints(1)">+ Success (Gain Points)</button>
      <button onclick="addPoints(-1)">- Fail (Lose Points)</button>
      <p style="font-size:12px; opacity:0.7">
        + = Success / - = Fail
      </p>
    `;
  } else {
    if (party.length === 0) {
      div.innerHTML = "<p>No party members</p>";
      return;
    }

    let html = `<h3>Party Rank: ${getCurrentRank()}</h3>`;
    html += `<p>Total Points: ${getTotalPoints()}</p>`;

    party.forEach((p, i) => {
      html += `
        <div class="player-card">
          <strong>${p.name}</strong>
          <p>${p.points} pts (${getRank(p.points)})</p>

          <button onclick="addPoints(1, ${i})">+ Success</button>
          <button onclick="addPoints(-1, ${i})">- Fail</button>

          <p style="font-size:12px; opacity:0.7">
            + = Success / - = Fail
          </p>

          <button onclick="removePlayer(${i})" style="background:#ef4444">
            Remove
          </button>
          <hr>
        </div>
      `;
    });

    div.innerHTML = html;
  }
}

function removePlayer(index) {
  if (!confirm("Remove this player?")) return;

  party.splice(index, 1);
  localStorage.setItem("party", JSON.stringify(party));

  renderAll();
}

// =====================================================
// 📊 CORE HELPERS
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
  return party.reduce((sum, p) => sum + p.points, 0);
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

    if (amount > 0 && missionLevel === 0) {
      player.level0Complete++;
    }

    localStorage.setItem("player", JSON.stringify(player));

  } else {
    const p = party[index];
    if (!p) return;

    p.points = Math.max(0, p.points + amount);

    if (amount > 0 && missionLevel === 0) {
      p.level0Complete++;
    }

    localStorage.setItem("party", JSON.stringify(party));
  }

  renderAll();
}

// =====================================================
// 🎲 INIT
// =====================================================
function renderAll() {
  renderMode();
  renderSetup();
  renderPlayers();
}

renderAll();