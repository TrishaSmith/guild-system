// =========================
// 🧠 PLAYER STATUS SYSTEM (DATA LAYER)
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

  // 🧍 CREATE PLAYER (SINGLE SOURCE OF TRUTH)
  create(name) {
    return {
      name,
      points: 0,
      level0Complete: 0,
      stats: this.generateStats()
    };
  },

  // 🧩 NORMALIZE EXISTING DATA (CRITICAL FOR OLD SAVE DATA)
  normalizePlayer(p) {
    return {
      name: p?.name || "Unknown",
      points: p?.points ?? 0,
      level0Complete: p?.level0Complete ?? 0,
      stats: p?.stats || this.generateStats()
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
    const raw = JSON.parse(localStorage.getItem("player"));
    if (!raw) return null;

    const normalized = this.normalizePlayer(raw);
    this.saveSolo(normalized);
    return normalized;
  },

  loadParty() {
    const raw = JSON.parse(localStorage.getItem("party")) || [];

    const normalized = raw.map(p => this.normalizePlayer(p));
    this.saveParty(normalized);

    return normalized;
  },

  // ➕ FACTORY HELPERS (OPTIONAL BUT CLEAN)
  addToParty(name, party) {
    const player = this.create(name);
    party.push(player);
    return party;
  }
};

window.PlayerStatus = PlayerStatus;
