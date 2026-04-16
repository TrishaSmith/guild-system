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

  // 💾 STORAGE
  saveSolo(player) {
    localStorage.setItem("player", JSON.stringify(player));
  },

  saveParty(party) {
    localStorage.setItem("party", JSON.stringify(party));
  },

  loadSolo() {
    return JSON.parse(localStorage.getItem("player")) || null;
  },

  loadParty() {
    return JSON.parse(localStorage.getItem("party")) || [];
  },

  // 🎮 SOLO RENDER
  renderSolo(player, containerId = "playerInfo") {
    const el = document.getElementById(containerId);
    if (!el || !player) return;

    el.innerHTML = `
      <div class="player-card">
        <div class="card-header">
          <strong>${player.name}</strong>
        </div>

        <div class="card-body">
          <p>Points: ${player.points}</p>
          <p>Rank: ${window.getRank(player.points)}</p>

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
            <p>Rank: ${window.getRank(p.points)}</p>

            <div class="action-buttons">
              <button onclick="addPoints(1, ${i})">+ Success</button>
              <button onclick="addPoints(-1, ${i})">- Fail</button>
            </div>

            <p class="hint">+ = Success / - = Fail</p>

            <hr>

            <p>⚔️ STR: ${p.stats?.str ?? 0}</p>
            <p>🧠 INT: ${p.stats?.int ?? 0}</p>
            <p>🛡️ DEF: ${p.stats?.def ?? 0}</p>
            <p>⚡ LUCK: ${p.stats?.luck ?? 0}</p>

            <hr>

            <button class="remove-btn" onclick="removePlayer(${i})">
              Remove
            </button>

          </div>
        </div>
      `;
    }); // ✅ THIS WAS MISSING

    el.innerHTML = html; // ✅ ALSO REQUIRED
  },

  // ➕ ADD PLAYER
  addPlayer(name, partyMode = false) {
    const player = this.create(name);

    if (partyMode) {
      const party = this.loadParty();
      party.push(player);
      this.saveParty(party);
    } else {
      this.saveSolo(player);
    }
  }
};

window.PlayerStatus = PlayerStatus;