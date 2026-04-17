// =========================
// 🧠 STATE
// =========================
let mode = localStorage.getItem("mode") || "solo";
let player = null;
let party = [];
let partySize = 3;

// =========================
// 🎮 MODE SYSTEM
// =========================
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

// =========================
// 🧩 SETUP UI
// =========================
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

// =========================
// 👤 PLAYER CREATION (FIXED)
// =========================
function createSoloPlayer() {
  const name = document.getElementById("soloName").value.trim();
  if (!name) return alert("Enter a name");

  player = PlayerStatus.create(name);
  PlayerStatus.saveSolo(player);

  renderAll();
}

function createParty() {
  party = [];

  for (let i = 0; i < partySize; i++) {
    const input = document.getElementById(`p${i}`);
    const name = input?.value?.trim() || `Player ${i + 1}`;

    party = PlayerStatus.addToParty(name, party);
  }

  PlayerStatus.saveParty(party);
  renderAll();
}

// =========================
// 🧍 PLAYER DISPLAY
// =========================
function renderPlayers() {
  const soloEl = document.getElementById("playerInfo");
  const partyEl = document.getElementById("partyContainer");

  if (!soloEl || !partyEl) return;

  if (mode === "solo") {
    partyEl.innerHTML = "";

    player = PlayerStatus.loadSolo();

    if (!player) {
      soloEl.innerHTML = "<p>No player created</p>";
      return;
    }

    soloEl.innerHTML = `
      <div class="player-card">

        <div class="card-header" onclick="toggleCard(this)">
          <strong>${player.name}</strong>
          <span>▼</span>
        </div>

        <div class="card-body">

          <p>Points: ${player.points}</p>
          <p>Rank: ${getRank(player.points)}</p>
          <p>Level 0 Complete: ${player.level0Complete}</p>

          <div class="action-buttons">
            <button onclick="addPoints(1, null, 0)">+ Success</button>
            <button onclick="addPoints(-1, null, 0)">- Fail</button>
          </div>

          <hr>

          <p>⚔️ STR: ${player.stats.str}</p>
          <p>🧠 INT: ${player.stats.int}</p>
          <p>🛡️ DEF: ${player.stats.def}</p>
          <p>⚡ LUCK: ${player.stats.luck}</p>

        </div>
      </div>
    `;
  }

  if (mode === "party") {
    soloEl.innerHTML = "";

    party = PlayerStatus.loadParty();

    if (!party.length) {
      partyEl.innerHTML = "<p>No party members</p>";
      return;
    }

    let html = `<h3>Party Rank: ${getCurrentRank()}</h3>`;

    // party.forEach((p, i) => {
    //   html += `
    //     <div class="player-card">
    //       <strong>${p.name}</strong>
    //       <p>${p.points} pts (${getRank(p.points)})</p>

    //       <button onclick="addPoints(1, ${i}, 0)">+ Success</button>
    //       <button onclick="addPoints(-1, ${i}, 0)">- Fail</button>
    //     </div>
    //   `;
    // });

    party.forEach((p, i) => {
    html += `
      <div class="player-card">

        <div class="card-header" onclick="toggleCard(this)">
          <strong>${p.name}</strong>
          <span>▼</span>
        </div>

        <div class="card-body">

          <p>Points: ${p.points}</p>
          <p>Rank: ${getRank(p.points)}</p>
          <p>Level 0 Complete: ${p.level0Complete ?? 0}</p>

          <div class="action-buttons">
            <button onclick="addPoints(1, ${i}, 0)">+ Success</button>
            <button onclick="addPoints(-1, ${i}, 0)">- Fail</button>
          </div>

          <hr>

          <p>⚔️ STR: ${p.stats?.str ?? 0}</p>
          <p>🧠 INT: ${p.stats?.int ?? 0}</p>
          <p>🛡️ DEF: ${p.stats?.def ?? 0}</p>
          <p>⚡ LUCK: ${p.stats?.luck ?? 0}</p>

          <hr>

          <button onclick="removePlayer(${i})">Remove</button>

        </div>
      </div>
    `;
  });

    partyEl.innerHTML = html;
  }
}

// =========================
// 📊 HELPERS (UNCHANGED)
// =========================
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

function toggleCard(header) {
  const body = header.nextElementSibling;
  body.classList.toggle("active");
}

function getTotalPoints() {
  if (mode === "solo") return player?.points || 0;
  return party.reduce((sum, p) => sum + p.points, 0);
}

function getCurrentRank() {
  return getRank(getTotalPoints());
}

// =========================
// ➕ POINT SYSTEM (UNCHANGED LOGIC)
// =========================
function addPoints(amount, index = null, missionLevel = 0) {
  if (mode === "solo") {
    if (!player) return;

    player.points = Math.max(0, player.points + amount);

    if (amount > 0 && missionLevel === 0) {
      player.level0Complete++;
    }

    PlayerStatus.saveSolo(player);
  } else {
    const p = party[index];
    if (!p) return;

    p.points = Math.max(0, p.points + amount);

    if (amount > 0 && missionLevel === 0) {
      p.level0Complete++;
    }

    PlayerStatus.saveParty(party);
  }

  renderAll();
}

// =========================
// 🎲 INIT
// =========================
function renderAll() {
  renderMode();
  renderSetup();
  renderPlayers();
  generateBoard();
}

renderAll();
