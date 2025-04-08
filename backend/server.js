const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { cleanWord, isProfane } = require('./utils/wordUtils');
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'images')));

const DATA_DIR = path.join(__dirname, 'data');

app.get('/words', (req, res) => {
  const event = req.query.event;
  if (!event) return res.status(400).send({ error: 'Missing event parameter' });

  const filePath = path.join(__dirname, 'data', 'events', `${event}.json`);
  console.log(`Attempting to load event file from: ${filePath}`); // Add this line for debugging

  if (!fs.existsSync(filePath)) {
    const defaultEventData = { words: [] }; // Empty array for new event
    fs.writeFileSync(filePath, JSON.stringify(defaultEventData, null, 2));
    console.log(`Created new event file for ${event}`);
  }

  const words = JSON.parse(fs.readFileSync(filePath));
  res.json(words);
});

app.post('/submit-word', (req, res) => {
  const { word, event } = req.body;
  if (!word || !event) return res.status(400).send({ error: 'Missing word or event' });

  const cleaned = cleanWord(word);
  if (isProfane(cleaned)) return res.status(400).send({ error: 'Inappropriate word' });

  const filePath = getEventFile(event);
  const words = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

  if (words.some(w => w.word.toLowerCase() === cleaned.toLowerCase())) {
    return res.status(409).send({ error: 'Duplicate word' });
  }

  words.push({ word: cleaned, timestamp: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(words, null, 2));
  res.status(201).send({ message: 'Word added' });
});

console.log("🔄 Attempting to sync blocklists...");
exec("node sync-blocklists.js", (err, stdout, stderr) => {
  if (err) {
    console.warn("⚠️  Blocklist sync failed:", err.message);
  } else {
    console.log("✅ Blocklists synced.");
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
  }
});

app.listen(PORT, () => {
  console.log(`CTWR Word Cloud backend running at http://localhost:${PORT}`);
});
