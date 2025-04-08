export async function loadConfig(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load config: ${path}`);
  return res.json();
}

export async function loadWords(apiUrl, eventId) {
  const res = await fetch(`${apiUrl}/words?event=${eventId}`);
  return res.ok ? res.json() : [];
}

export async function submitWord(apiUrl, eventId, word) {
  const res = await fetch(`${apiUrl}/submit-word`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, event: eventId }),
  });
  return res.ok;
}
