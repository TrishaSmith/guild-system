export function rollDice(diceType, numDice, advantage = false) {
  let rolls = [];

  for (let i = 0; i < numDice; i++) {
    let r1 = rand(diceType);
    let r2 = advantage ? rand(diceType) : null;

    rolls.push(advantage ? Math.max(r1, r2) : r1);
  }

  return {
    rolls,
    total: rolls.reduce((a, b) => a + b, 0)
  };
}

function rand(max) {
  return Math.floor(Math.random() * max) + 1;
}
