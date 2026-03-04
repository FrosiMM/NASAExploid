function createStars() {
  const container = document.getElementById("stars-bg");
  const count = 180;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2.5 + 0.5;
    const duration = Math.random() * 4 + 2;
    const opacity = Math.random() * 0.7 + 0.2;
    const delay = Math.random() * 5;

    star.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${duration}s;
      --op: ${opacity};
      animation-delay: ${delay}s;
    `;

    container.appendChild(star);
  }
}

createStars();
