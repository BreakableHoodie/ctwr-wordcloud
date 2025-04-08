import { submitWord } from "./utils.js";

export function setupForm(apiUrl, eventId, onSubmitSuccess) {
  const form = document.getElementById("wordForm");
  const input = document.getElementById("wordInput");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const word = input.value.trim();
    if (!word) return;

    const success = await submitWord(apiUrl, eventId, word);
    if (success) {
      input.value = "";
      onSubmitSuccess();
    } else {
      alert("Word rejected (duplicate, profanity, or error)");
    }
  });
}
