const fs = require('fs');
const path = require('path');
const https = require('https');
const naughtyWords = require('naughty-words'); // Import naughty-words
const { ProfanityEngine } = require('@coffeeandfun/google-profanity-words'); // Import ProfanityEngine

const sources = [
  {
    name: 'cmu',
    url: 'https://www.cs.cmu.edu/~biglou/resources/bad-words.txt',
    format: 'text'
  },
  {
    name: 'zacanger',
    url: 'https://raw.githubusercontent.com/zacanger/profane-words/refs/heads/master/words.json',
    format: 'json'
  },
];

const blocklistDir = path.join(__dirname, 'blocklists');

if (!fs.existsSync(blocklistDir)) {
  fs.mkdirSync(blocklistDir, { recursive: true });
}

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function normalizeLines(content) {
  return Array.from(new Set(
    content
      .split(/\r?\n/)
      .map(line => line.trim().toLowerCase())
      .filter(Boolean)
  ));
}

const profanity = new ProfanityEngine({ language: 'en' });

async function run() {
  for (const src of sources) {
    try {
      let words = [];
      if (src.words) {
        words = src.words;
      } else {
        const raw = await download(src.url);
        if (src.format === 'json') {
          const json = JSON.parse(raw);
          words = Array.isArray(json) ? json : Object.values(json).flat();
        } else {
          words = normalizeLines(raw);
        }
      }

      const output = normalizeLines(words.join('\n')).join('\n');
      fs.writeFileSync(path.join(blocklistDir, `${src.name}.txt`), output);
      console.log(`✅ Saved ${words.length} words from ${src.name}`);
    } catch (err) {
      console.error(`❌ Failed to fetch ${src.name}:`, err.message);
    }
  }

  // Fetch Google profanity list using ProfanityEngine
  try {
    const naughty = await profanity.all(); // Fetch all profanity words
    if (naughty && naughty.length > 0) {
      fs.writeFileSync(path.join(blocklistDir, 'google-profanity-words.txt'), normalizeLines(naughty.join('\n')).join('\n'));
      console.log(`✅ Saved ${naughty.length} words from google-profanity-words.`);
    } else {
      console.error('❌ Google profanity list is empty or invalid.');
    }
  } catch (err) {
    console.error(`❌ Failed to fetch google-profanity-words:`, err.message);
  }

  // Handling naughty-words
  try {
    const naughty = naughtyWords.en || [];
    if (Array.isArray(naughty) && naughty.length > 0) {
      fs.writeFileSync(path.join(blocklistDir, 'naughty-words.txt'), normalizeLines(naughty.join('\n')).join('\n'));
      console.log(`✅ Saved ${naughty.length} words from naughty-words package.`);
    } else {
      console.error('❌ naughty-words list is empty or invalid.');
    }
  } catch (err) {
    console.error(`❌ Failed to fetch naughty-words:`, err.message);
  }
}

run();
