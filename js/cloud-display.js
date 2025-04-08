export function renderWordCloud(words) {
  const svg = d3.select("#wordCloudSVG");
  svg.selectAll("*").remove();

  const svgElement = document.getElementById("wordCloudSVG");
  const width = svgElement.clientWidth || 800;
  const height = svgElement.clientHeight || 500;

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(words.map(d => ({
      text: d.word,
      size: 12 + (d.word.length % 20) * 2 // deterministic sizing for demo
    })))
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .font("Segoe UI")
    .fontSize(d => d.size)
    .on("end", draw);

  layout.start();

  function draw(words) {
    svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", d => d.size + "px")
      .style("fill", d => d3.schemeCategory10[Math.abs(hashCode(d.text)) % 10])
      .style("opacity", 0)
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .text(d => d.text)
      .transition()
      .duration(600)
      .style("opacity", 1);
  }

  // Deterministic color mapping
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }
}
