getRoller()
applyLuck()
savePlayer()

export function renderStats(stats = {}) {
  return `
    <hr>

    <p>⚔️ STR: ${stats.str ?? 0}</p>
    <p>✨ DEX: ${stats.dex ?? 0}</p>
    <p>📜 CON: ${stats.con ?? 0}</p>
    <p>🧠 INT: ${stats.int ?? 0}</p>
    <p>📚 WIS: ${stats.wis ?? 0}</p>
    <p>🤩 CHA: ${stats.cha ?? 0}</p>
    <p>⚡ LUCK: ${stats.luck ?? 0}</p>

    <hr>
  `;
}

export function getGuildRank(points) {
  if (points <= 5) return "F";
  if (points <= 10) return "D";
  if (points <= 15) return "C";
  if (points <= 20) return "B";
  if (points <= 25) return "A";
  if (points <= 30) return "S";
  if (points <= 35) return "SS";
  return "SSS";
}

export function addRankPointsToPlayer(p, amount, missionLevel = 0) {
  p.points = Math.max(0, (p.points || 0) + amount);

  if (amount > 0 && missionLevel === 0) {
    p.level0Complete = (p.level0Complete || 0) + 1;
  }

  return p;
}