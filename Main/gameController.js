import * as Dice from "./dice.js";
import { PlayerStatus } from "./playerStatus.js";

function getRoller(playerIndex = null) {
  const mode = localStorage.getItem("mode");

  if (mode === "solo") {
    return PlayerStatus.loadSolo();
  }

  if (mode === "party" && playerIndex !== null) {
    const party = PlayerStatus.loadParty();
    return party[playerIndex] || null;
  }

  return null;
}

function applyLuck(roller, useLuck) {
  let advantage = false;

  if (!roller) return { roller, advantage };

  let luck = roller?.stats?.luck || 0;

  if (useLuck) {
    if (luck <= 0) {
      alert(`${roller.name} has no Luck left!`);
    } else {
      advantage = true;
      roller.stats.luck--;
    }
  }

  return { roller, advantage };
}

function buildRollText(roller, diceType, numDice, result, advantage) {
  const name = roller ? roller.name : "Free Roll";
  const adv = advantage ? " (ADVANTAGE -1 LUCK)" : "";

  return `${name} rolled ${numDice}d${diceType}${adv}: ` +
         `[${result.rolls.join(", ")}] = ${result.total}`;
}

export function roll(playerIndex = null, useLuck = false) {
  const diceType = parseInt(document.getElementById("diceType").value);
  const numDice = parseInt(document.getElementById("numDice").value);

  let roller = getRoller(playerIndex);

  const luckResult = applyLuck(roller, useLuck);
  roller = luckResult.roller;
  const advantage = luckResult.advantage;

  const result = Dice.rollDice(diceType, numDice, advantage);

  const text = buildRollText(
    roller,
    diceType,
    numDice,
    result,
    advantage
  );

  if (roller) {
    const mode = localStorage.getItem("mode");

    if (mode === "solo") {
        PlayerStatus.saveSolo(roller);
    } else {
        const party = PlayerStatus.loadParty();
        party[playerIndex] = roller;
        PlayerStatus.saveParty(party);
    }
    }

    const history = document.getElementById("history");
    if (history) {
    const entry = document.createElement("div");
    entry.className = "roll-entry";
    entry.innerText = text;
    history.prepend(entry);
    }
  // save logic stays minimal here or moves to playerCore later

  if (window.renderAll) window.renderAll();
  
  return result;
}