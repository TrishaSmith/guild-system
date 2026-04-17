// =========================
// 🧠 PLAYER STATUS SYSTEM
// =========================

const PlayerStatus = {
  // 🎲 STATS
  generateStats() {
    return {
      str: this.rollStat(),
      int: this.rollStat(),
      def: this.rollStat(),
      luck: this.rollStat()
    };
  },

  rollStat() {
    return Math.floor(Math.random() * 10) + 1;
  },

  // 🧍 CREATE
  create(name) {
    return {
      name,
      points: 0,
      level0Complete: 0,
      stats: this.generateStats()
    };
  },

  // 🧩 NORMALIZE (🔥 ensures all attributes exist)
  normalizePlayer(p) {
    return {
      name: p.name || "Unknown",
      points: p.points ?? 0,
      level0Complete: p.level0Complete ?? 0,
      stats: p.stats || this.generateStats()
    };
  },

  // 💾 STORAGE
  saveSolo(player) {
    localStorage.setItem("player", JSON.stringify(player));
  },

  saveParty(party) {
    localStorage.setItem("party", JSON.stringify(party));
  },

  loadSolo() {
    const player = JSON.parse(localStorage.getItem("player"));
    if (!player) return null;

    const normalized = this.normalizePlayer(player);
    this.saveSolo(normalized); // persist fix
    return normalized;
  },

  loadParty() {
    let party = JSON.parse(localStorage.getItem("party")) || [];

    party = party.map(p => this.normalizePlayer(p));
    this.saveParty(party); // persist fix

    return party;
  },

  // 🎮 SOLO RENDER
  renderSolo(player, containerId = "playerInfo") {
    const el = document.getElementById(containerId);
    if (!el || !player) return;

    const rank = window.getRank ? window.getRank(player.points) : "Unranked";

    el.innerHTML = `
      <div class="player-card">
        <div class="card-header">
          <strong>${player.name}</strong>
        </div>

        <div class="card-body">
          <p>Points: ${player.points}</p>
          <p>Rank: ${rank}</p>
          <p>Level 0 Complete: ${player.level0Complete}</p>

          <div class="action-buttons">
            <button onclick="addPoints(1)">+ Success</button>
            <button onclick="addPoints(-1)">- Fail</button>
          </div>

          <p class="hint">+ = Success / - = Fail</p>

          <hr>

          <p>⚔️ STR: ${player.stats.str}</p>
          <p>🧠 INT: ${player.stats.int}</p>
          <p>🛡️ DEF: ${player.stats.def}</p>
          <p>⚡ LUCK: ${player.stats.luck}</p>
        </div>
      </div>
    `;
  },

  // 👥 PARTY RENDER
  renderParty(party, containerId = "partyContainer") {
    const el = document.getElementById(containerId);
    if (!el) return;

    let html = "";

    party.forEach((p, i) => {
      const rank = window.getRank ? window.getRank(p.points) : "Unranked";

      html += `
        <div class="player-card"
             draggable="true"
             ondragstart="dragStart(event, ${i})"
             ondragover="allowDrop(event)"
             ondrop="drop(event, ${i})">

          <div class="card-header" onclick="toggleCard(this)">
            <strong>${p.name}</strong>
            <span>▼</span>
          </div>

          <div class="card-body">

            <p>Points: ${p.points}</p>
            <p>Rank: ${rank}</p>
            <p>Level 0 Complete: ${p.level0Complete}</p>

            <div class="action-buttons">
              <button onclick="addPoints(1, ${i})">+ Success</button>
              <button onclick="addPoints(-1, ${i})">- Fail</button>
            </div>

            <p class="hint">+ = Success / - = Fail</p>

            <hr>

            <p>⚔️ STR: ${p.stats.str}</p>
            <p>🧠 INT: ${p.stats.int}</p>
            <p>🛡️ DEF: ${p.stats.def}</p>
            <p>⚡ LUCK: ${p.stats.luck}</p>

            <hr>

            <button class="remove-btn" onclick="removePlayer(${i})">
              Remove
            </button>

          </div>
        </div>
      `;
    });

    el.innerHTML = html;
  },

  // ➕ ADD PLAYER
  addPlayer(name, partyMode = false) {
    const player = this.create(name);

    if (partyMode) {
      const party = this.loadParty();
      party.push(player);
      this.saveParty(party);
      this.renderParty(party); // 🔥 immediate update
    } else {
      this.saveSolo(player);
      this.renderSolo(player); // 🔥 immediate update
    }
  }
};

window.PlayerStatus = PlayerStatus;