export function getRank(points) {
  if (points <= 5) return "F";
  if (points <= 10) return "D";
  if (points <= 15) return "C";
  if (points <= 20) return "B";
  if (points <= 25) return "A";
  if (points <= 30) return "S";
  if (points <= 35) return "SS";
  return "SSS";
}

export function addPointsToPlayer(p, amount, missionLevel = 0) {
  p.points = Math.max(0, (p.points || 0) + amount);

  if (amount > 0 && missionLevel === 0) {
    p.level0Complete = (p.level0Complete || 0) + 1;
  }

  return p;
}