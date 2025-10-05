(() => {
  const slider = document.querySelector(".testimonials__slider");
  const track = slider.querySelector(".testimonials__cards");
  const slides = Array.from(track.children);
  const dotsContainer = slider.querySelector(".testimonials__dots");

  if (!slider || slides.length === 0) return;

  let index = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let autoplayInterval = 5000;
  let autoplayID = null;
  let pointerId = null;
  let slidesPerView = window.innerWidth >= 1200 ? 3 : 1;
  let slideWidth = slider.clientWidth / slidesPerView;

  const snapThreshold = 0.2;

  function updateSlideWidth() {
    if (window.innerWidth >= 1200) {
      slidesPerView = 3;
    } else if (window.innerWidth >= 768) {
      slidesPerView = 2;
    } else {
      slidesPerView = 1;
    }
    slideWidth = slider.clientWidth / slidesPerView;
  }

  function setSliderTransform() {
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function setPositionByIndex() {
    currentTranslate = -index * slideWidth;
    prevTranslate = currentTranslate;
    track.style.transition = "transform 0.35s cubic-bezier(0.22, 0.9, 0.3, 1)";
    setSliderTransform();
    updateDots();
  }

  function createDots() {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.classList.add("testimonials__dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        index = i;
        setPositionByIndex();
        stopAutoplay();
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".testimonials__dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayID = setInterval(() => {
      index = (index + 1) % slides.length;
      setPositionByIndex();
    }, autoplayInterval);
  }

  function stopAutoplay() {
    if (autoplayID) clearInterval(autoplayID);
  }

  function pointerDown(e) {
    pointerId = e.pointerId;
    isDragging = true;
    startX = e.clientX;
    slider.setPointerCapture(pointerId);
    stopAutoplay();
    track.style.transition = "none";
    requestAnimationFrame(animation);
  }

  function pointerMove(e) {
    if (!isDragging || e.pointerId !== pointerId) return;
    const diff = e.clientX - startX;
    currentTranslate = prevTranslate + diff;
  }

  function pointerUp(e) {
    if (!isDragging || e.pointerId !== pointerId) return;
    isDragging = false;
    slider.releasePointerCapture(pointerId);
    const movedBy = currentTranslate - prevTranslate;
    const movedFraction = Math.abs(movedBy) / slideWidth;
    if (movedFraction > snapThreshold) {
      if (movedBy < 0) index = Math.min(index + 1, slides.length - 1);
      else index = Math.max(index - 1, 0);
    }
    setPositionByIndex();
    startAutoplay();
  }

  function animation() {
    setSliderTransform();
    if (isDragging) requestAnimationFrame(animation);
  }

  window.addEventListener("resize", () => {
    updateSlideWidth();
    setPositionByIndex();
  });

  track.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointercancel", pointerUp);

  createDots();
  updateSlideWidth();
  setPositionByIndex();
  startAutoplay();
})();
