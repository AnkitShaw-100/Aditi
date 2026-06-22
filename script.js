const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const heroVideo = document.querySelector(".hero-video");
const videoLoader = document.querySelector(".video-loader");
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

let toastTimer;

function hideVideoLoader() {
  videoLoader?.classList.add("is-hidden");
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

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

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

window.addEventListener("resize", () => {
  updatePillarDots();
  updateDispatchCarousel();
});

updateDispatchCarousel();
