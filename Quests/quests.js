// =========================
// 🎲 QUEST DATA
// =========================

const QUEST_TYPES = [
  "Bug Hunt", "Function Forge", "Algorithm Trial",
  "Data Structure", "Maze", "Hybrid", "Optimization", "Multi-Stage"
];

const GUILD_MASTERS = [
  "Archivist", "Tinkerer", "Old Adventurer",
  "Arcane AI", "Trickster", "Commander"
];

const FUNCTION_TASKS = [
  "reverse a string",
  "check for palindrome",
  "count occurrences in a list",
  "filter even numbers",
  "find maximum value",
  "merge two lists",
  "validate input format"
];

const BUG_TYPES = [
  "off-by-one error",
  "infinite loop",
  "wrong return value",
  "broken condition",
  "edge case failure"
];

const TWISTS = [
  "Time limit applies",
  "Hidden edge case included",
  "Random inputs will be tested",
  "Must not use built-in functions",
  "Multiple correct solutions exist"
];

// =========================
// 🧠 GENERATORS
// =========================

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFunctionTask() {
  return `Write a function to ${rand(FUNCTION_TASKS)}.`;
}

function generateBugTask() {
  return `Fix a function containing a ${rand(BUG_TYPES)}.`;
}

function generateAlgorithmTask() {
  return "Implement a sorting algorithm without using built-in sort.";
}

function generateTask(type) {
  if (type === "Function Forge") return generateFunctionTask();
  if (type === "Bug Hunt") return generateBugTask();
  if (type === "Algorithm Trial") return generateAlgorithmTask();
  return "Complete the assigned coding challenge.";
}

// =========================
// 🧾 QUEST GENERATOR
// =========================

function generateQuest(i) {
  const type = rand(QUEST_TYPES);
  const gm = rand(GUILD_MASTERS);
  const difficulty = rand(["Easy", "Medium", "Hard"]);
  const task = generateTask(type);
  const twist = rand(TWISTS);

  return {
    title: `QUEST #${i}`,
    gm,
    type,
    difficulty,
    task,
    twist
  };
}

// =========================
// 🎮 UI
// =========================

let quests = [];

function generateQuests() {
  const count = parseInt(document.getElementById("questCount").value);

  quests = [];

  for (let i = 1; i <= count; i++) {
    quests.push(generateQuest(i));
  }

  renderQuests();
}

function renderQuests() {
  const container = document.getElementById("questList");
  container.innerHTML = "";

  quests.forEach(q => {
    const div = document.createElement("div");
    div.className = "quest";

    div.innerText = `
${q.title}
Guild Master: ${q.gm}
Type: ${q.type}
Difficulty: ${q.difficulty}

Task:
${q.task}

Twist:
${q.twist}
    `;

    container.appendChild(div);
  });
}

function clearQuests() {
  quests = [];
  document.getElementById("questList").innerHTML = "";
}
