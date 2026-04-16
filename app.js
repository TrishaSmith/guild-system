// ---------- DATA ----------
const missions = [
  { level: 0, name: "Fix a bug in a loop" },
  { level: 1, name: "Write a palindrome function" },
  { level: 2, name: "Implement a stack" },
  { level: 3, name: "Solve a recursion problem" },
  { level: 4, name: "Optimize sorting algorithm" },
  { level: 5, name: "Build pathfinding logic" },
];

// ---------- PLAYER ----------
let player = JSON.parse(localStorage.getItem("player")) || null;

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

function createPlayer() {
  const name = document.getElementById("nameInput").value;
  player = { name, points: 0 };
  save();
  renderPlayer();
}

function addPoints(amount) {
  player.points = Math.max(0, player.points + amount);
  save();
  renderPlayer();
}

function save() {
  localStorage.setItem("player", JSON.stringify(player));
}

function renderPlayer() {
  if (!player) return;
  document.getElementById("playerInfo").innerHTML = `
    <p>Name: ${player.name}</p>
    <p>Points: ${player.points}</p>
    <p>Rank: ${getRank(player.points)}</p>
    <button onclick="addPoints(1)">+ Success</button>
    <button onclick="addPoints(-1)">- Fail</button>
  `;
}

// ---------- MISSION BOARD ----------
function generateBoard() {
  const container = document.getElementById("missions");
  container.innerHTML = "";

  const playerRank = getRank(player.points);

  missions.forEach(m => {
    const div = document.createElement("div");
    div.className = "mission";

    const allowed = isMissionAllowed(playerRank, m.level);

    div.innerHTML = `
      <strong>Level ${m.level}</strong>
      <p>${m.name}</p>
      <p>${allowed ? "✅ Available" : "❌ Locked"}</p>
    `;

    container.appendChild(div);
  });
}

// ---------- RULES ----------
function isMissionAllowed(rank, level) {
  const rankMap = {
    "F": 1,
    "D": 2,
    "C": 3,
    "B": 4,
    "A": 5,
    "S": 6,
    "SS": 6,
    "SSS": 6
  };

  return level <= rankMap[rank];
}

// ---------- DICE ROLLER ----------
function rollDice() {
  const diceType = parseInt(document.getElementById("diceType").value);
  const numDice = parseInt(document.getElementById("numDice").value);

  let rolls = [];
  let total = 0;

  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * diceType) + 1;
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
renderPlayer();

