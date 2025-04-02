let words = JSON.parse(localStorage.getItem("ctwrWords")) || [];

function renderWordCloud() {
  const canvas = document.getElementById("wordCloudCanvas");
  const wordList = words.map(w => [w, Math.floor(Math.random() * 10) + 10]);
  WordCloud(canvas, { list: wordList });
}

document.getElementById("wordForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const word = document.getElementById("wordInput").value.trim();
  if (word) {
    words.push(word);
    localStorage.setItem("ctwrWords", JSON.stringify(words));
    renderWordCloud();
    document.getElementById("wordInput").value = "";
  }
});

window.onload = renderWordCloud;
