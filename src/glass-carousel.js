(function () {
  window.createGlassCarousel = function (container, options = {}) {
    if (!container) return;

    let currentIndex = 0;
    let startX = 0, endX = 0;

    container.classList.add('glass-carousel-container');

    const controlsHTML = `
      <div class="carousel-controls">
        <button class="glass-carousel-prev">&#10094;</button>
        <button class="glass-carousel-next">&#10095;</button>
      </div>`;

    // Auto-load slides from <template id="carousel-slide-X">
    const loadSlidesFromTemplates = () => {
      const slides = [];
      let index = 1;
      while (true) {
        const template = document.getElementById(`carousel-slide-${index}`);
        if (!template) break;
        slides.push(template.innerHTML);
        index++;
      }
      return slides;
    };

    const rawSlides = options.slides || loadSlidesFromTemplates();
    const slidesHTML = rawSlides.map((html, i) => `
      <div class="glass-slide${i === 0 ? ' active' : ''}">${html}</div>
    `).join('');

    container.innerHTML = `
      ${controlsHTML}
      <div class="glass-track-wrapper">
        <div class="glass-track">
          ${slidesHTML}
        </div>
      </div>
    `;

    const prevBtn = container.querySelector('.glass-carousel-prev');
    const nextBtn = container.querySelector('.glass-carousel-next');
    const track = container.querySelector('.glass-track');
    const slides = container.querySelectorAll('.glass-slide');
    const wrapper = container.querySelector('.glass-track-wrapper');

    function updateTransform() {
      const slide = slides[currentIndex];
      const slideRect = slide.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const offset = (wrapperRect.width / 2) - (slideRect.width / 2 + slide.offsetLeft);
      track.style.transform = `translateX(${offset}px)`;
    }

    function move(dir) {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + dir + slides.length) % slides.length;
      slides[currentIndex].classList.add('active');
      updateTransform();
    }

    prevBtn.addEventListener('click', () => move(-1));
    nextBtn.addEventListener('click', () => move(1));

    track.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
    track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });
    track.addEventListener('mousedown', (e) => startX = e.clientX);
    track.addEventListener('mouseup', (e) => {
      endX = e.clientX;
      handleSwipe();
    });

    function handleSwipe() {
      const diff = endX - startX;
      if (diff > 50) move(-1);
      else if (diff < -50) move(1);
    }

    window.addEventListener('resize', updateTransform);
    requestAnimationFrame(updateTransform);
  };
})();
