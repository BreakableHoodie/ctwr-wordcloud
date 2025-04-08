# CTWR Word Cloud Backend

A lightweight, local-only backend for storing and serving word cloud submissions by event.

## 📦 Setup

```bash
cd backend
npm install
node server.js
```

## 📡 Endpoints

### GET /words?event=your-event-id
Returns the word list for a specific event.

### POST /submit-word
Submit a word for a specific event.

**Body:**
```json
{
  "word": "#accessibility",
  "event": "youth-tech-labs-2025"
}
```

## 📁 Data Storage
Words are saved to flat JSON files under `/data/`, one per event.

## 🛡 Protections
- Duplicate word check
- Profanity filter (`bad-words` package)

## 💡 Example Usage
Run locally, connect to your frontend, and use `fetch()` or curl to send/receive word data.

