const Dice = {
  roll() {
    const diceType = parseInt(document.getElementById("diceType").value);
    const numDice = parseInt(document.getElementById("numDice").value);

    let rolls = [];
    let total = 0;

    for (let i = 0; i < numDice; i++) {
      let roll;

      // 🎲 D100
      if (diceType === 100) {
        const tens = Math.floor(Math.random() * 10) * 10;
        const ones = Math.floor(Math.random() * 10);
        roll = tens + ones;
        if (roll === 0) roll = 100;
      } else {
        roll = Math.floor(Math.random() * diceType) + 1;
      }

      rolls.push(roll);
      total += roll;
    }

    const resultText =
      `Rolled ${numDice}d${diceType}: [${rolls.join(", ")}] = ${total}`;

    this.showResult(resultText);
    this.addToHistory(resultText);

    return { rolls, total };
  },

  // =========================
  // 🧠 GENERIC ENGINE METHOD
  // =========================
  rollDice(type, count = 1) {
    let rolls = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * type) + 1;
      rolls.push(r);
      total += r;
    }

    return { rolls, total };
  },

  showResult(text) {
    const el = document.getElementById("result");
    if (el) el.innerText = text;
  },

  addToHistory(text) {
    const history = document.getElementById("history");
    if (!history) return;

    const entry = document.createElement("div");
    entry.className = "roll-entry";
    entry.textContent = text;

    history.prepend(entry);
  },

  clearHistory() {
    const history = document.getElementById("history");
    if (history) history.innerHTML = "";
  }
};
