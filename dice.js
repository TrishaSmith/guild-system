// =========================
// ❌ Disables rolling in party mode
// =========================
// const rollBtn = document.querySelector('[onclick="Dice.roll()"]');

// if (rollBtn) {
//   rollBtn.style.display = (mode === "solo") ? "inline-block" : "none";
// }

const Dice = {

// =========================
// 🎲 MAIN ROLL (UPDATED)
// =========================
 roll(playerIndex = null, useLuck = false) {
  const diceType = parseInt(document.getElementById("diceType").value);
  const numDice = parseInt(document.getElementById("numDice").value);

  let roller = null;
  let rollerName = "Free Roll";
  let advantage = false;

  // 🧍 SOLO PLAYER
  if (mode === "solo" && player) {
    roller = player;
  }

  // 👥 PARTY PLAYER (only if index provided)
  if (mode === "party" && playerIndex !== null) {
    roller = party[playerIndex];
  }

  // 🎯 If we HAVE a player, we can use luck
  if (roller) {
    rollerName = roller.name;

    let luck = roller?.stats?.luck || 0;

    if (useLuck) {
      if (luck <= 0) {
        alert(`${rollerName} has no Luck left!`);
      } else {
        advantage = true;
        roller.stats.luck--; // spend luck
      }
    }
  }

  // 🎲 Roll
  const result = this.rollDice(diceType, numDice, advantage);

  const advText = advantage ? " (ADVANTAGE -1 LUCK)" : "";

  const resultText =
    `${rollerName} rolled ${numDice}d${diceType}${advText}: ` +
    `[${result.rolls.join(", ")}] = ${result.total}`;

  this.showResult(resultText);
  this.addToHistory(resultText);

  // 💾 Save ONLY if a player was used
  if (roller) {
    if (mode === "solo") {
      PlayerStatus.saveSolo(roller);
    } else {
      PlayerStatus.saveParty(party);
    }

    renderPlayers(); // update UI
  }

  return result;
}, 

// =========================
// 🧠 GENERIC ENGINE
// =========================
  rollDice(type, count = 1, advantage = false) {
    let rolls = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
      let r;

      if (advantage) {
        const r1 = Math.floor(Math.random() * type) + 1;
        const r2 = Math.floor(Math.random() * type) + 1;
        r = Math.max(r1, r2);

        rolls.push(`${r1}|${r2} → ${r}`);
      } else {
        r = Math.floor(Math.random() * type) + 1;
        rolls.push(r);
      }

      total += r;
    }

    return { rolls, total };
  },

  // =========================
  // 🖥️ UI HELPERS
  // =========================
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