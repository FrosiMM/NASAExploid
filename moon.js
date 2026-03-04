const MOON_PHASES = [
  { name: "Новий місяць",       emoji: "🌑", shadow: "100%",   align: "left"  },
  { name: "Молодий місяць",     emoji: "🌒", shadow: "75%",    align: "left"  },
  { name: "Перша чверть",       emoji: "🌓", shadow: "50%",    align: "left"  },
  { name: "Прибуваючий місяць", emoji: "🌔", shadow: "25%",    align: "left"  },
  { name: "Повний місяць",      emoji: "🌕", shadow: "0%",     align: "none"  },
  { name: "Спадаючий місяць",   emoji: "🌖", shadow: "25%",    align: "right" },
  { name: "Остання чверть",     emoji: "🌗", shadow: "50%",    align: "right" },
  { name: "Старий місяць",      emoji: "🌘", shadow: "75%",    align: "right" },
];

const MOON_FACTS = [
  { icon: "📏", label: "Діаметр",        value: "3 474 км" },
  { icon: "🌍", label: "Відстань до Землі", value: "384 400 км" },
  { icon: "⚖️", label: "Маса",           value: "7.34 × 10²² кг" },
  { icon: "🔄", label: "Оборот навколо Землі", value: "27.3 дні" },
  { icon: "🌡️", label: "Темп. вдень",   value: "+127 °C" },
  { icon: "❄️", label: "Темп. вночі",   value: "–173 °C" },
  { icon: "🕳️", label: "Є атмосфера?",  value: "Майже ні" },
  { icon: "🚀", label: "1-й висадок",   value: "20 лип 1969" },
];

function getMoonPhase(date) {
  const knownNew = new Date(2000, 0, 6, 18, 14, 0);
  const SYNODIC = 29.53058867;
  const diff = (date - knownNew) / (1000 * 60 * 60 * 24);
  const cycles = diff / SYNODIC;
  const phase = (cycles - Math.floor(cycles)) * SYNODIC;

  let index = Math.round((phase / SYNODIC) * 8) % 8;
  const percent = Math.round((phase / SYNODIC) * 100);
  return { index, percent, dayInCycle: Math.round(phase) };
}

function getSunrise(date) {
  const hours = 5 + Math.floor(Math.random() * 2);
  const mins = Math.floor(Math.random() * 60);
  return `${String(hours).padStart(2,"0")}:${String(mins).padStart(2,"0")}`;
}

function renderMoon() {
  const today = new Date();
  const { index, percent, dayInCycle } = getMoonPhase(today);
  const phase = MOON_PHASES[index];

  document.getElementById("moon-phase-name").textContent = phase.emoji + " " + phase.name;

  const shadow = document.getElementById("moon-shadow");
  if (phase.align === "left") {
    shadow.style.background = `linear-gradient(to right, transparent ${100 - parseInt(phase.shadow)}%, var(--bg) ${100 - parseInt(phase.shadow)}%)`;
  } else if (phase.align === "right") {
    shadow.style.background = `linear-gradient(to left, transparent ${100 - parseInt(phase.shadow)}%, var(--bg) ${100 - parseInt(phase.shadow)}%)`;
  } else {
    shadow.style.background = "transparent";
  }

  const daysToFull = index <= 4 ? 14 - dayInCycle : 29 - dayInCycle + 14;
  const nextFull = new Date(today.getTime() + Math.abs(daysToFull) * 24 * 60 * 60 * 1000);

  document.getElementById("moon-stats-grid").innerHTML = `
    <div class="moon-stat">
      <div class="moon-stat-label">День циклу</div>
      <div class="moon-stat-value">${dayInCycle} / 29</div>
    </div>
    <div class="moon-stat">
      <div class="moon-stat-label">Освітлення</div>
      <div class="moon-stat-value">${percent}%</div>
    </div>
    <div class="moon-stat">
      <div class="moon-stat-label">Наступне повня</div>
      <div class="moon-stat-value">${nextFull.toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}</div>
    </div>
  `;

  const timeline = document.getElementById("phase-timeline");
  timeline.innerHTML = MOON_PHASES.map((p, i) => `
    <div class="phase-item ${i === index ? "current" : ""}">
      <span class="phase-item-emoji">${p.emoji}</span>
      <div class="phase-item-name">${p.name.split(" ")[0]}</div>
    </div>
  `).join("");

  const factsGrid = document.getElementById("facts-grid");
  factsGrid.innerHTML = MOON_FACTS.map((f, i) => `
    <div class="fact-item" style="animation-delay:${i * 0.07}s">
      <div class="fact-item-icon">${f.icon}</div>
      <div class="fact-item-label">${f.label}</div>
      <div class="fact-item-value">${f.value}</div>
    </div>
  `).join("");
}

renderMoon();
