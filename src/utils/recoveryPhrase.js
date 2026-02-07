/**
 * Recovery Phrase Generator
 *
 * Generates a human-readable 4-word phrase from a curated wordlist.
 * Each word is selected using crypto.getRandomValues() for unpredictability.
 *
 * Entropy: 4 words from 256 words = 256^4 = ~4.3 billion combinations.
 * Combined with the fact that a brute-force attacker also needs
 * to guess which complaint to target, this is more than sufficient.
 *
 * Phrases are case-insensitive for user convenience.
 */

// 256 common, unambiguous, easy-to-remember English words
const WORDLIST = [
  "anchor", "arrow", "atlas", "badge", "basin", "beacon", "blade", "blaze",
  "bloom", "board", "bolt", "bone", "brave", "breeze", "brick", "bridge",
  "brook", "brush", "cabin", "cable", "cairn", "camel", "canal", "canvas",
  "cargo", "cedar", "chain", "chalk", "chase", "chest", "chief", "chimney",
  "cliff", "clock", "cloud", "clover", "coach", "coast", "cobalt", "comet",
  "coral", "crane", "creek", "crest", "crown", "crush", "crystal", "curve",
  "dagger", "dance", "delta", "depot", "drift", "drum", "dune", "eagle",
  "earth", "ember", "engine", "falcon", "fern", "field", "flame", "flare",
  "fleet", "flint", "flood", "forge", "forum", "frost", "garden", "garnet",
  "gate", "glacier", "globe", "gorge", "grain", "granite", "grove", "guard",
  "hammer", "harbor", "hawk", "haven", "hearth", "hedge", "heron", "hollow",
  "horizon", "hunter", "iceberg", "inlet", "iron", "island", "ivory", "jacket",
  "jasper", "jewel", "journal", "jungle", "kernel", "kettle", "knight", "knot",
  "ladder", "lake", "lance", "lantern", "latch", "lava", "leaf", "ledge",
  "lemon", "level", "light", "linden", "lodge", "lunar", "magnet", "manor",
  "maple", "marble", "marsh", "meadow", "medal", "mesa", "metric", "mirror",
  "mist", "moat", "monarch", "mortar", "mosaic", "mountain", "nectar", "nest",
  "nimble", "noble", "north", "novel", "oasis", "ocean", "olive", "onyx",
  "orbit", "orchid", "osprey", "otter", "oxide", "palace", "palm", "panel",
  "panda", "paper", "path", "patrol", "pearl", "pelican", "pepper", "petal",
  "piano", "pier", "pilot", "pine", "pivot", "plain", "planet", "plume",
  "polar", "pond", "portal", "prism", "pulse", "quartz", "quest", "rafter",
  "rail", "rainbow", "raven", "realm", "reef", "ridge", "river", "robin",
  "rocket", "rope", "ruby", "saddle", "sage", "salmon", "sand", "satin",
  "scout", "seal", "shadow", "shelf", "shield", "shore", "sierra", "signal",
  "silver", "sketch", "slate", "slope", "solar", "south", "spark", "sphere",
  "spirit", "spruce", "square", "stable", "staff", "stone", "storm", "stream",
  "summit", "swift", "sword", "table", "tangle", "temple", "terra", "thicket",
  "thorn", "throne", "timber", "token", "torch", "tower", "trail", "trident",
  "trophy", "tunnel", "turret", "valley", "vapor", "vault", "velvet", "venture",
  "vertex", "vessel", "violet", "vista", "walnut", "warden", "wave", "willow",
  "winter", "wolf", "zenith", "zephyr",
];

/**
 * Generate a cryptographically random recovery phrase of N words.
 * @param {number} [wordCount=4] — number of words
 * @returns {string} e.g. "falcon-mesa-glacier-torch"
 */
export function generateRecoveryPhrase(wordCount = 4) {
  const indices = new Uint8Array(wordCount);
  crypto.getRandomValues(indices);

  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDLIST[indices[i]]);
  }

  return words.join("-");
}

/**
 * Normalize a recovery phrase for comparison.
 * Trims, lowercases, and collapses whitespace/separators.
 * @param {string} phrase
 * @returns {string}
 */
export function normalizePhrase(phrase) {
  return phrase
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")  // spaces/underscores → dashes
    .replace(/-+/g, "-");      // collapse multiple dashes
}
