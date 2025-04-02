let words = JSON.parse(localStorage.getItem("ctwrWords")) || [];

function renderWordCloud() {
  const canvas = document.getElementById("wordCloudCanvas");
  const ctx = canvas.getContext('2d');
  const ratio = window.devicePixelRatio || 1;

  // Set canvas size for HiDPI
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const wordList = words.map((word) => [word, 10 + Math.floor(Math.random() * 40)]);

  WordCloud(canvas, {
    list: wordList,
    gridSize: 10,
    weightFactor: 2,
    fontFamily: 'Segoe UI, sans-serif',
    color: 'random-dark',
    rotateRatio: 0.5,
    rotationSteps: 2,
    backgroundColor: '#f4f4f9',
    drawOutOfBound: false,
    shrinkToFit: true,
  });
}

document.getElementById("wordForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("wordInput");
  const word = input.value.trim();
  if (word) {
    words.push(word);
    localStorage.setItem("ctwrWords", JSON.stringify(words));
    renderWordCloud();
    input.value = "";
  }
});

document.getElementById("resetBtn").addEventListener("click", function () {
  if (confirm("Clear all words?")) {
    words = [];
    localStorage.removeItem("ctwrWords");
    renderWordCloud();
  }
});

window.onload = renderWordCloud;
