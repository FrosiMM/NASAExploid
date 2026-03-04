const NASA_KEY = "LVtMWwBy9qQM3kGLCv8pSvmRCFLf4G49f7ao5fYg";

async function loadAsteroids() {
  const summaryEl = document.getElementById("asteroid-summary");
  const listEl = document.getElementById("asteroid-list");
  const dangerEl = document.getElementById("danger-indicator");

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];

  try {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateStr}&end_date=${dateStr}&api_key=${NASA_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const asteroids = data.near_earth_objects[dateStr] || [];

    if (asteroids.length === 0) {
      summaryEl.innerHTML = `<div class="error-msg">Сьогодні немає даних про астероїди.</div>`;
      return;
    }

    asteroids.sort((a, b) => {
      const distA = parseFloat(a.close_approach_data[0].miss_distance.kilometers);
      const distB = parseFloat(b.close_approach_data[0].miss_distance.kilometers);
      return distA - distB;
    });

    const dangerCount = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
    const safeCount = asteroids.length - dangerCount;

    const biggest = asteroids.reduce((prev, cur) => {
      const prevMax = prev.estimated_diameter.meters.estimated_diameter_max;
      const curMax = cur.estimated_diameter.meters.estimated_diameter_max;
      return curMax > prevMax ? cur : prev;
    });
    const biggestSize = Math.round(biggest.estimated_diameter.meters.estimated_diameter_max);

    summaryEl.innerHTML = `
      <div class="summary-card summary-total">
        <div class="summary-card-num">${asteroids.length}</div>
        <div class="summary-card-label">Всього об'єктів</div>
      </div>
      <div class="summary-card summary-danger">
        <div class="summary-card-num">${dangerCount}</div>
        <div class="summary-card-label">Потенційно небезпечних</div>
      </div>
      <div class="summary-card summary-safe">
        <div class="summary-card-num">${safeCount}</div>
        <div class="summary-card-label">Безпечних</div>
      </div>
      <div class="summary-card summary-biggest">
        <div class="summary-card-num">${biggestSize} м</div>
        <div class="summary-card-label">Найбільший розмір</div>
      </div>
    `;

    if (dangerCount > 0) {
      dangerEl.className = "danger-indicator show alert";
      dangerEl.textContent = `⚠️  УВАГА: Сьогодні ${dangerCount} потенційно небезпечних астероїда поруч із Землею`;
    } else {
      dangerEl.className = "danger-indicator show ok";
      dangerEl.textContent = `✅  Жодного небезпечного астероїда сьогодні — Земля в безпеці`;
    }

    listEl.innerHTML = asteroids.map((asteroid, i) => {
      const approach = asteroid.close_approach_data[0];
      const distKm = Math.round(parseFloat(approach.miss_distance.kilometers)).toLocaleString("uk-UA");
      const speed = Math.round(parseFloat(approach.relative_velocity.kilometers_per_hour)).toLocaleString("uk-UA");
      const sizeMin = Math.round(asteroid.estimated_diameter.meters.estimated_diameter_min);
      const sizeMax = Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max);
      const isDangerous = asteroid.is_potentially_hazardous_asteroid;

      return `
        <div class="asteroid-item ${isDangerous ? "is-dangerous" : ""}" style="animation-delay:${i * 0.05}s">
          <div class="asteroid-icon">${isDangerous ? "☄️" : "🪨"}</div>
          <div>
            <div class="asteroid-name">${asteroid.name.replace(/[()]/g, "")}</div>
            <div class="asteroid-meta">
              📏 ${sizeMin}–${sizeMax} м &nbsp;·&nbsp;
              📡 ${distKm} км від Землі &nbsp;·&nbsp;
              💨 ${speed} км/год
            </div>
          </div>
          <div class="asteroid-size">
            <div class="asteroid-size-val">${sizeMax} м</div>
            <div class="asteroid-size-label">макс. розмір</div>
          </div>
          <div class="asteroid-danger-badge ${isDangerous ? "badge-danger" : "badge-safe"}">
            ${isDangerous ? "Небезпечний" : "Безпечний"}
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    summaryEl.innerHTML = `<div class="error-msg">Помилка при завантаженні даних. NASA API може бути тимчасово недоступний.</div>`;
  }
}

loadAsteroids();
