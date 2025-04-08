# CTWR Word Cloud (Canvas Version)

🗣️ A modular, canvas-based word cloud built for civic tech booths, workshops, and demo days.  
Visitors submit words, hashtags, or ideas, and see them grow in a live cloud in real time.

---

## 🧩 Project Structure

```txt
/
├── event.html              → Frontend entry point for individual events
├── events/                 → JSON configs for each event
├── js/                     → Modular frontend logic
├── css/                    → Shared styling
├── backend/                → Local-only API to persist and fetch words
```

---

## 🚀 How to Run It Locally

### 1. Start the Backend

```bash
cd backend
npm install
node server.js
```

This starts the local API at `http://localhost:3000`.

### 2. Open the Frontend

You can open `event.html` directly in your browser, or serve with a static web server:

```bash
# Example (Python)
python3 -m http.server 8080
# Then visit: http://localhost:8080/event.html?e=example-event-2025
```

---

## ✍️ Adding a New Event

1. Duplicate a config file in `/events/`, e.g.:

   ```json
   {
     "eventId": "new-event-2025",
     "title": "Shape the Region with a Word",
     "subtitle": "Add your ideas and see them come to life."
   }
   ```

2. Link to it via:

   ```text
   event.html?e=new-event-2025
   ```

---

## 🧠 Future Plans

- Optional WebSocket support
- Hosted backend (Railway, Fly.io)
- Admin tools (export, moderation)
- QR-code linking for public participation

---

## 👐 Contributing

We welcome help from designers, devs, and dreamers!  
Open an issue or chat with us at [CivicTechWR.org](https://civictechwr.org)

---

## 📄 License

MIT – Built with care by Civic Tech WR
