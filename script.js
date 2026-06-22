const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const heroVideo = document.querySelector(".hero-video");
const heroVideoSource = document.querySelector(".hero-video source");
const videoLoader = document.querySelector(".video-loader");
const heroSoundToggle = document.querySelector(".hero-sound-toggle");
const filterButtons = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll(".dispatch-card");
const toast = document.querySelector(".toast");
const signupForm = document.querySelector(".signup-form");
const pillarCarousel = document.querySelector(".pillar-carousel");
const pillarCards = document.querySelectorAll(".pillar-carousel article");
const pillarDots = document.querySelectorAll(".pillar-dots span");
const pillarPrev = document.querySelector(".pillar-nav.prev");
const pillarNext = document.querySelector(".pillar-nav.next");
const dispatchCarousel = document.querySelector(".dispatch-list");
const dispatchCards = document.querySelectorAll(".dispatch-card");
const dispatchDots = document.querySelectorAll(".dispatch-dots span");
const dispatchPrev = document.querySelector(".dispatch-nav.prev");
const dispatchNext = document.querySelector(".dispatch-nav.next");
const frameworkSection = document.querySelector(".framework-section");
const frameworkSteps = document.querySelectorAll(".framework-step");
const typeRevealHeadlines = document.querySelectorAll(".type-reveal[data-reveal]");

let toastTimer;
let heroVideoSourceLoaded = false;
let frameworkRaf = 0;

function buildCharacterReveal() {
  typeRevealHeadlines.forEach((headline) => {
    const text = headline.dataset.reveal || headline.textContent || "";

    headline.setAttribute("aria-label", text);
    headline.textContent = "";

    Array.from(text).forEach((char, index) => {
      const span = document.createElement("span");
      span.className = "type-char";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--char-index", String(index));
      span.textContent = char === " " ? "\u00A0" : char;
      headline.appendChild(span);
    });
  });
}

function initCharacterReveal() {
  if (!typeRevealHeadlines.length) {
    return;
  }

  buildCharacterReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCharacterReveal, { once: true });
} else {
  initCharacterReveal();
}

function hideVideoLoader() {
  videoLoader?.classList.add("is-hidden");
}

function loadHeroVideo() {
  if (!heroVideo || !heroVideoSource || heroVideoSourceLoaded) {
    return;
  }

  const source = heroVideoSource.dataset.src;

  if (!source) {
    return;
  }

  heroVideoSource.src = source;
  heroVideoSource.removeAttribute("data-src");
  heroVideoSourceLoaded = true;
  heroVideo.load();

  heroVideo.play().catch(() => {
    // Autoplay can still be blocked on some browsers until the video is ready.
  });
}

function syncHeroSoundButton() {
  if (!heroSoundToggle || !heroVideo) {
    return;
  }

  const soundOn = !heroVideo.muted;
  heroSoundToggle.classList.toggle("is-on", soundOn);
  heroSoundToggle.setAttribute("aria-pressed", String(soundOn));
  heroSoundToggle.textContent = soundOn ? "Sound on" : "Sound off";
}

function setHeroSound(enabled) {
  if (!heroVideo) {
    return;
  }

  if (enabled) {
    loadHeroVideo();
    heroVideo.muted = false;
    heroVideo.volume = 1;
    heroVideo.play().catch(() => {
      // The click came from the user, but keep the UI responsive if playback stalls.
    });
  } else {
    heroVideo.muted = true;
  }

  syncHeroSoundButton();
}

if (heroVideo && videoLoader) {
  if (heroVideo.readyState >= 3) {
    hideVideoLoader();
  }

  heroVideo.addEventListener("loadeddata", hideVideoLoader, { once: true });
  heroVideo.addEventListener("canplay", hideVideoLoader, { once: true });
  heroVideo.addEventListener("playing", hideVideoLoader, { once: true });
  window.setTimeout(hideVideoLoader, 6000);
}

if (heroVideo && heroSoundToggle) {
  heroVideo.defaultMuted = true;
  heroVideo.muted = true;
  syncHeroSoundButton();

  heroSoundToggle.addEventListener("click", () => {
    setHeroSound(heroVideo.muted);
  });

  const loadSoon = () => loadHeroVideo();

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadSoon, { timeout: 1200 });
  } else {
    window.setTimeout(loadSoon, 220);
  }
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function syncMenuToggleLabel(isOpen) {
  if (!menuToggle) {
    return;
  }

  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

function setMenuState(isOpen) {
  if (!siteNav || !menuToggle) {
    return;
  }

  siteNav.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
  syncMenuToggleLabel(isOpen);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = !siteNav?.classList.contains("open");
  setMenuState(isOpen);
});

siteNav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    setMenuState(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

function updateFrameworkStory() {
  if (!frameworkSteps.length) {
    return;
  }

  const focusLine = window.innerHeight * 0.45;
  let activeStep = frameworkSteps[0];
  let closestDistance = Number.POSITIVE_INFINITY;

  frameworkSteps.forEach((step) => {
    const rect = step.getBoundingClientRect();
    const stepCenter = rect.top + rect.height / 2;
    const distance = Math.abs(stepCenter - focusLine);

    if (distance < closestDistance) {
      closestDistance = distance;
      activeStep = step;
    }
  });

  frameworkSteps.forEach((step) => {
    step.classList.toggle("is-active", step === activeStep);
  });

  frameworkSection?.classList.toggle("is-complete", activeStep === frameworkSteps[frameworkSteps.length - 1]);
}

function scheduleFrameworkStoryUpdate() {
  if (frameworkRaf) {
    return;
  }

  frameworkRaf = window.requestAnimationFrame(() => {
    frameworkRaf = 0;
    updateFrameworkStory();
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    cards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.tier !== filter;
    });

    dispatchCarousel?.scrollTo({ left: 0, behavior: "smooth" });
    window.requestAnimationFrame(updateDispatchCarousel);
  });
});

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Issue alerts are enabled for ADITI.");
  signupForm.reset();
});

function updateNavState(carousel, prevButton, nextButton) {
  if (!carousel) {
    return;
  }

  const maxScroll = carousel.scrollWidth - carousel.clientWidth;
  const hasScroll = maxScroll > 2;
  const atStart = carousel.scrollLeft <= 2;
  const atEnd = carousel.scrollLeft >= maxScroll - 2;

  if (prevButton) {
    prevButton.hidden = !hasScroll || atStart;
  }

  if (nextButton) {
    nextButton.hidden = !hasScroll || atEnd;
  }
}

function updateDots(carousel, cardList, dotList) {
  if (!carousel || !dotList.length) {
    return;
  }

  const cardsToMeasure = Array.from(cardList).filter((card) => !card.hidden);
  const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
  let index = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  cardsToMeasure.forEach((card, cardIndex) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(carouselCenter - cardCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      index = cardIndex;
    }
  });

  dotList.forEach((dot, dotIndex) => {
    dot.hidden = dotIndex >= cardsToMeasure.length;
    dot.classList.toggle("active", dotIndex === index);
  });
}

function updatePillarDots() {
  updateDots(pillarCarousel, pillarCards, pillarDots);
  updateNavState(pillarCarousel, pillarPrev, pillarNext);
}

pillarPrev?.addEventListener("click", () => {
  pillarCarousel?.scrollBy({ left: -pillarCarousel.clientWidth * 0.85, behavior: "smooth" });
});

pillarNext?.addEventListener("click", () => {
  pillarCarousel?.scrollBy({ left: pillarCarousel.clientWidth * 0.85, behavior: "smooth" });
});

pillarCarousel?.addEventListener("scroll", () => {
  window.requestAnimationFrame(updatePillarDots);
});

updatePillarDots();

function getVisibleDispatchCards() {
  return Array.from(dispatchCards).filter((card) => !card.hidden);
}

function updateDispatchDots() {
  updateDots(dispatchCarousel, getVisibleDispatchCards(), dispatchDots);
  updateNavState(dispatchCarousel, dispatchPrev, dispatchNext);
}

function updateDispatchCarousel() {
  updateDispatchDots();
}

dispatchPrev?.addEventListener("click", () => {
  dispatchCarousel?.scrollBy({ left: -dispatchCarousel.clientWidth * 0.9, behavior: "smooth" });
});

dispatchNext?.addEventListener("click", () => {
  dispatchCarousel?.scrollBy({ left: dispatchCarousel.clientWidth * 0.9, behavior: "smooth" });
});

dispatchCarousel?.addEventListener("scroll", () => {
  window.requestAnimationFrame(updateDispatchCarousel);
});

window.addEventListener("scroll", scheduleFrameworkStoryUpdate, { passive: true });
window.addEventListener("resize", () => {
  updatePillarDots();
  updateDispatchCarousel();
  scheduleFrameworkStoryUpdate();
});

updateDispatchCarousel();
updateFrameworkStory();
