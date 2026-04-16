// ---------- DATA ----------
const missions = [
  { level: 0, name: "Fix a bug in a loop" },
  { level: 1, name: "Write a palindrome function" },
  { level: 2, name: "Implement a stack" },
  { level: 3, name: "Solve a recursion problem" },
  { level: 4, name: "Optimize sorting algorithm" },
  { level: 5, name: "Build pathfinding logic" },
];

const unlockRules = {
  1: "level0_avg_2",
  2: ""
};

// ---------- MODE ----------
let mode = localStorage.getItem("mode") || "solo";
let player = JSON.parse(localStorage.getItem("player")) || null;
let party = JSON.parse(localStorage.getItem("party")) || [];

// ---------- RULE ENGINE (LIGHT USE) ----------
function checkRule(level) {
  const rule = unlockRules[level];

  if (rule === "level0_avg_2") {
    if (party.length === 0) return false;

    const avg =
      party.reduce((s, p) => s + p.level0Complete, 0) /
      party.length;

    return avg >= 2;
  }

  return true;
}

// ---------- MODE ----------
function setMode(selected) {
  mode = selected;
  localStorage.setItem("mode", mode);
  renderAll();
}

function renderMode() {
  const el = document.getElementById("modeDisplay");
  if (el) el.innerText = `Current Mode: ${mode.toUpperCase()}`;
}

// ---------- PLAYER DISPLAY ----------
function renderPlayers() {
  const div = document.getElementById("playerInfo");

  if (mode === "solo") {
    if (!player) {
      div.innerHTML = "<p>No player created</p>";
      return;
    }

    div.innerHTML = `
      <strong>${player.name}</strong>
      <p>Points: ${player.points}</p>
      <p>Rank: ${getRank(player.points)}</p>
      <button onclick="addPoints(1)">+ Success</button>
      <button onclick="addPoints(-1)">- Fail</button>
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
          <button onclick="addPoints(1, ${i})">+ </button>
          <button onclick="addPoints(-1, ${i})">- </button>
        </div>
      `;
    });

    div.innerHTML = html;
  }
}

function renderAll() {
  renderMode();
  renderPlayers();
}

// ---------- RANK ----------
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

// ---------- CREATE PLAYER ----------
function createPlayer() {
  const name = document.getElementById("nameInput").value.trim();

  if (!name) {
    alert("Enter a name!");
    return;
  }

  if (mode === "solo") {
    player = { name, points: 0, level0Complete: 0 };
    localStorage.setItem("player", JSON.stringify(player));
  } else {
    party.push({ name, points: 0, level0Complete: 0 });
    localStorage.setItem("party", JSON.stringify(party));
  }

  renderAll();
}

// ---------- TOTAL ----------
function getTotalPoints() {
  if (mode === "solo") return player?.points || 0;
  return party.reduce((sum, p) => sum + p.points, 0);
}

function getCurrentRank() {
  return getRank(getTotalPoints());
}

// ---------- POINT SYSTEM ----------
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

// ---------- MISSION BOARD ----------
function generateBoard() {
  const container = document.getElementById("missions");
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

// ---------- RULES ----------
function isMissionAllowed(rank, level) {
  const rankAccess = {
    "F": 1,
    "D": 2,
    "C": 3,
    "B": 4,
    "A": 5,
    "S": 6,
    "SS": 6,
    "SSS": 6
  };

  // Level 1 rule now uses rule engine
  if (level === 1) {
    return checkRule(1);
  }

  return level <= rankAccess[rank];
}

// ---------- COMPLETE ----------
function completeMission(level) {
  const pointsMap = { 0:1, 1:2, 2:3, 3:4, 4:5, 5:6 };
  const reward = pointsMap[level] || 1;

  if (mode === "solo") {
    addPoints(reward, null, level);
  } else {
    party.forEach(p => {
      p.points += reward;

      if (level === 0) {
        p.level0Complete++;
      }
    });

    localStorage.setItem("party", JSON.stringify(party));
    renderAll();
  }

  alert(`Mission complete! +${reward} points`);
}

// ---------- DICE ----------
function rollDice() {
  const diceType = parseInt(document.getElementById("diceType").value);
  const numDice = parseInt(document.getElementById("numDice").value);

  let rolls = [];
  let total = 0;

  for (let i = 0; i < numDice; i++) {
    let roll;

    if (diceType === 100) {
      const tens = Math.floor(Math.random() * 10) * 10;
      const ones = Math.floor(Math.random() * 10);
      roll = tens + ones || 100;
    } else {
      roll = Math.floor(Math.random() * diceType) + 1;
    }

    rolls.push(roll);
    total += roll;
  }

  const resultText = `Rolled ${numDice}d${diceType}: [${rolls.join(", ")}] = ${total}`;
  document.getElementById("result").innerText = resultText;

  addToHistory(resultText);
}

function addToHistory(text) {
  const historyDiv = document.getElementById("history");

  const entry = document.createElement("div");
  entry.className = "roll-entry";
  entry.textContent = text;

  historyDiv.prepend(entry);
}

function clearHistory() {
  document.getElementById("history").innerHTML = "";
}

// ---------- INIT ----------
renderAll();