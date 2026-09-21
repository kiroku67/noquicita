/* =========================================================
   Para Grecia — carrusel con subtítulos sincronizados
   ========================================================= */

/* --- Contenido del carrusel ---------------------------------
   Entradas de imagen (.jpeg/.jpg/.png) y al final el
   video mensaje (se detecta por la extensión .mp4).      */
const SLIDES_DATA = [
    { src: "assets/img/minecraft_girasol.png", alt: "Minecraft Girasol" },
    { src: "assets/img/foto1.jpeg", alt: "Foto 1" },
    { src: "assets/img/foto2.jpeg", alt: "Foto 2" },
    { src: "assets/img/foto3.jpeg", alt: "Foto 3" },
    { src: "assets/img/foto4.jpeg", alt: "Foto 4" },
    { src: "assets/img/foto5.jpeg", alt: "Foto 5" },
    { src: "assets/img/foto6.jpeg", alt: "Foto 6" },
    { src: "assets/img/foto7.jpeg", alt: "Foto 7" },
    { src: "assets/img/foto8.jpeg", alt: "Foto 8" },
    { src: "assets/img/foto9.jpg", alt: "Foto 9" },
    { src: "assets/video/mensaje-grecia.mp4", alt: "Mensaje final" }
];

/* --- Subtítulos de la canción -------------------------------
   TIEMPOS AJUSTADOS AL VIDEO — no tocar.                  */
const SUBTITLES = [
    { start: 8,   end: 13,  text: "Los sabios dicen" },
    { start: 15,  end: 20,  text: "Que solo los tontos se precipitan" },
    { start: 22,  end: 26,  text: "Pero no puedo evitar" },
    { start: 28,  end: 34,  text: "Enamorarme de ti Grecia" },
    { start: 37,  end: 41,  text: "Si me quedara..." },
    { start: 43,  end: 49,  text: "¿Sería un pecado?" },
    { start: 51,  end: 55,  text: "Si no puedo evitar" },
    { start: 56,  end: 64,  text: "Enamorarme de ti Grecia" },
    { start: 66,  end: 68,  text: "Como un río que fluye" },
    { start: 69,  end: 72,  text: "Seguro hacia el mar" },
    { start: 73,  end: 75,  text: "Querida, así es" },
    { start: 76,  end: 81,  text: "Algunas cosas están destinadas a volver" },
    { start: 83,  end: 88,  text: "Toma mi mano" },
    { start: 89,  end: 96,  text: "Toma mi vida entera también" },
    { start: 98,  end: 102, text: "Porque no puedo evitar" },
    { start: 103, end: 110, text: "Enamorarme de ti Grecia" },
    { start: 112, end: 114, text: "Como un río que fluye" },
    { start: 115, end: 118, text: "Seguro hacia el mar" },
    { start: 119, end: 121, text: "Querida, así es" },
    { start: 122, end: 128, text: "Algunas cosas están destinadas a volver" },
    { start: 130, end: 134, text: "Toma mi mano" },
    { start: 136, end: 141, text: "Toma mi vida entera también" },
    { start: 143, end: 147, text: "Porque no puedo evitar" },
    { start: 148, end: 155, text: "Enamorarme de ti Grecia" },
    { start: 158, end: 161, text: "Porque no puedo evitar" },
    { start: 163, end: 175, text: "Enamorarme de ti mi niña hermosa" }
];

/* ==================== Referencias del DOM ==================== */

const carousel = document.querySelector(".carousel");
const dotsContainer = document.querySelector(".dots");
const prevButton = document.querySelector(".arrow.prev");
const nextButton = document.querySelector(".arrow.next");
const audio = document.querySelector("#audio");
const subtitleEl = document.querySelector("#subtitle");

let currentSlide = 0;
let slides = [];

/* ==================== Construcción del carrusel ==================== */

function buildSlides() {
    slides = SLIDES_DATA.map((item, index) => {
        const slide = document.createElement("div");
        slide.className = "slide" + (index === 0 ? " active" : "");

        if (item.src.endsWith(".mp4")) {
            const video = document.createElement("video");
            video.loop = true;           // el video del gato se repite hasta que navegue
            video.preload = "auto";

            const source = document.createElement("source");
            source.src = item.src;
            source.type = "video/mp4";
            video.appendChild(source);

            slide.appendChild(video);
        } else {
            const img = document.createElement("img");
            img.src = item.src;
            img.alt = item.alt;
            slide.appendChild(img);
        }

        carousel.appendChild(slide);
        return slide;
    });

    /* Puntos de navegación (uno por slide) */
    SLIDES_DATA.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = "dot" + (index === 0 ? " active" : "");
        dot.type = "button";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Ir a la foto " + (index + 1));
        dot.addEventListener("click", () => showSlide(index));
        dotsContainer.appendChild(dot);
    });
}

/* ==================== Navegación ==================== */

function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentSlide = index;

    slides.forEach((slide, i) => {
        const isActive = i === index;
        slide.classList.toggle("active", isActive);

        /* Reproduce el video solo cuando su slide está activa */
        const video = slide.querySelector("video");
        if (video) {
            if (isActive) {
                video.play().catch(() => { /* autoplay bloqueado: se usa el botón */ });
                advanceAfterVideo(video);
            } else {
                video.pause();
                clearTimeout(videoAdvanceTimer);
            }
        }
    });

    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));

    /* Autoplay del carrusel: avanza en loop, pero se pausa
       en la slide del video para que no se le escape. */
    if (isVideoSlide(index)) {
        stopAutoAdvance();
    } else {
        startAutoAdvance();
    }
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

prevButton.addEventListener("click", () => changeSlide(-1));
nextButton.addEventListener("click", () => changeSlide(1));

/* Teclado: flechas para navegar */
document.addEventListener("keydown", (event) => {
    if (document.activeElement === audio) return; // dejar las teclas al reproductor
    if (event.key === "ArrowLeft") changeSlide(-1);
    if (event.key === "ArrowRight") changeSlide(1);
});

/* Móvil: deslizar para cambiar de foto */
let touchStartX = 0;
carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

carousel.addEventListener("touchend", (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
        changeSlide(deltaX < 0 ? 1 : -1);
    }
}, { passive: true });

/* ==================== Subtítulos sincronizados ==================== */

audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;

    const currentSubtitle = SUBTITLES.find(item =>
        currentTime >= item.start && currentTime < item.end
    );

    subtitleEl.textContent = currentSubtitle ? currentSubtitle.text : "";
});

/* ==================== Al terminar la canción ==================== */

audio.addEventListener("ended", () => {
    subtitleEl.textContent = "";
    showSlide(0);
});

/* ==================== Autoplay del carrusel ==================== */

const SLIDE_INTERVAL_MS = 6000;   // tiempo de cada foto en el carrusel

let autoAdvanceTimer = null;
let videoAdvanceTimer = null;

function isVideoSlide(index) {
    return slides[index].querySelector("video") !== null;
}

/* Al llegar a la slide del video, espera a que se reproduzca una
   vez completa y recién ahí avanza (wrappea a la primera imagen).
   El video queda en loop mientras está en pantalla. */
function advanceAfterVideo(video) {
    clearTimeout(videoAdvanceTimer);

    const advance = () => {
        videoAdvanceTimer = setTimeout(() => {
            clearTimeout(videoAdvanceTimer);
            if (isVideoSlide(currentSlide)) {
                changeSlide(1); // última slide -> vuelve a la primera
            }
        }, (video.duration && isFinite(video.duration)) ? video.duration * 1000 : 15000);
    };

    if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
        advance();
    } else {
        video.addEventListener("loadedmetadata", advance, { once: true });
    }
}

function startAutoAdvance() {
    stopAutoAdvance();
    autoAdvanceTimer = setInterval(() => changeSlide(1), SLIDE_INTERVAL_MS);
}

function stopAutoAdvance() {
    if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }
}

/* ==================== Inicio ==================== */

buildSlides();
startAutoAdvance();