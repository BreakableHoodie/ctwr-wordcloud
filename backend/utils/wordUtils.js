const Filter = require('bad-words');
const filter = new Filter();

// Extend the base bad-words list
filter.addWords('dumb', 'stupid', 'idiot', 'moron', 'lame');

// Leetspeak character map
const leetMap = {
  '@': 'a',
  '1': 'i',
  '!': 'i',
  '$': 's',
  '3': 'e',
  '0': 'o',
  '*': '',
  '#': 'h',
  '|': 'i',
  '+': 't'
};

// Political / high-risk blocklist
const blockedTerms = [
  'trump', 'biden', 'elon', 'musk', 'putin', 'trudeau',
  'liberal', 'conservative', 'democrat', 'republican',
  'nazi', 'communist', 'marx', 'hitler', 'kkk',
  'maga', 'antifa', 'capitalism', 'socialism', 'zionist',
  'genocide', 'apartheid', 'hamas', 'israel', 'palestine'
];

// Collapse repeated characters: hellooooo -> helloo
function collapseRepeats(word) {
  return word.replace(/(.)\1{2,}/g, '$1$1');
}

// Translate leetspeak symbols to letters
function normalizeLeetspeak(word) {
  return word.replace(/[@!$130*#|+]/gi, (char) => leetMap[char.toLowerCase()] || '');
}

// Normalize for checking: lowercase, collapse, leetspeak
function normalizeForCheck(word) {
  const original = word.toLowerCase();
  const collapsed = collapseRepeats(original);
  const normalized = normalizeLeetspeak(collapsed);
  return normalized;
}

// Final check: filter + manual blocklist
function isProfane(word) {
  const normalized = normalizeForCheck(word);
  if (filter.isProfane(normalized)) return true;

  return blockedTerms.some(blocked => normalized.includes(blocked));
}

function cleanWord(word) {
  return word.trim().replace(/\s+/g, ' ');
}

module.exports = { cleanWord, isProfane };
