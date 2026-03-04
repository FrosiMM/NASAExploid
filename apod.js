const NASA_KEY = "LVtMWwBy9qQM3kGLCv8pSvmRCFLf4G49f7ao5fYg";

async function loadAPOD() {
  const container = document.getElementById("apod-container");

  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);
    const data = await response.json();

    let mediaHTML = "";
    if (data.media_type === "image") {
      mediaHTML = `
        <div class="apod-image-wrap">
          <img src="${data.url}" alt="${data.title}" />
        </div>
      `;
    } else {
      mediaHTML = `
        <div class="apod-image-wrap" style="background:#080f1e;display:flex;align-items:center;justify-content:center;">
          <div style="font-size:60px">🎬</div>
        </div>
      `;
    }

    container.innerHTML = `
      ${mediaHTML}
      <div class="apod-info">
        <div class="apod-label">📸 Фото астрономічного дня</div>
        <h3 class="apod-title">${data.title}</h3>
        <div class="apod-date">${formatDate(data.date)}</div>
        <p class="apod-text">${data.explanation}</p>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="error-msg">Не вдалося завантажити фото дня. Перевір з'єднання з інтернетом.</div>`;
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}

loadAPOD();
