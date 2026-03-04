const NASA_KEY = "LVtMWwBy9qQM3kGLCv8pSvmRCFLf4G49f7ao5fYg";

const roverBtn = document.getElementById("load-photos-btn");
const roverSelect = document.getElementById("rover-select");
const solInput = document.getElementById("sol-input");
const galleryGrid = document.getElementById("gallery-grid");
const galleryStats = document.getElementById("gallery-stats");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxInfo = document.getElementById("lightbox-info");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxOverlay = document.getElementById("lightbox-overlay");

roverBtn.addEventListener("click", loadMarsPhotos);
lightboxClose.addEventListener("click", closeLightbox);
lightboxOverlay.addEventListener("click", closeLightbox);

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeLightbox();
});

async function loadMarsPhotos() {
  const rover = roverSelect.value;
  const sol = solInput.value;

  galleryGrid.innerHTML = `<div class="loader">Завантаження фото з Марсу...</div>`;
  galleryStats.textContent = "";

  try {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${NASA_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const photos = data.photos;

    if (!photos || photos.length === 0) {
      galleryGrid.innerHTML = `<div class="error-msg">Фото для цього Sol не знайдено. Спробуй інше значення Sol.</div>`;
      return;
    }

    const shown = photos.slice(0, 24);

    galleryStats.textContent = `Знайдено ${photos.length} фото · Показано ${shown.length} · ${rover.toUpperCase()} · Sol ${sol}`;

    galleryGrid.innerHTML = shown.map((photo, i) => `
      <div class="gallery-item" style="animation-delay:${i * 0.04}s" data-src="${photo.img_src}" data-info="${photo.camera.full_name} · Sol ${photo.sol} · ${photo.earth_date}">
        <img src="${photo.img_src}" alt="Марс фото" loading="lazy" />
        <div class="gallery-item-overlay">
          <div class="gallery-item-camera">${photo.camera.name}</div>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".gallery-item").forEach(item => {
      item.addEventListener("click", function() {
        openLightbox(this.dataset.src, this.dataset.info);
      });
    });

  } catch (err) {
    galleryGrid.innerHTML = `<div class="error-msg">Помилка при завантаженні. NASA API може бути тимчасово недоступний.</div>`;
  }
}

function openLightbox(src, info) {
  lightboxImg.src = src;
  lightboxInfo.textContent = info;
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

loadMarsPhotos();
