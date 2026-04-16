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
  const rankAccess = {
    F: 1, D: 2, C: 3, B: 4, A: 5, S: 6, SS: 6, SSS: 6
  };

  if (level === 1) return checkRule(1);

  return level <= rankAccess[rank];
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
    renderAll();
  }

  alert(`Mission complete! +${reward} points`);
}

