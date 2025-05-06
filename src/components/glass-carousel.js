
class GlassCarousel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentIndex = 0;
    this.totalSlides = parseInt(this.getAttribute('slides') || '5');
    this.startX = 0;
    this.endX = 0;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
    requestAnimationFrame(() => this.updateTransform());
  }

  render() {
    const slidesHTML = Array.from({ length: this.totalSlides }).map((_, i) => `
      <div class="slide${i === 0 ? ' active' : ''}">
        <span class="label">Slide ${i + 1}</span>
      </div>
    `).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }

        .carousel-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .controls {
          position: absolute;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 2;
        }

        .controls button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          color: white;
          font-size: 2rem;
          backdrop-filter: blur(10px);
          cursor: pointer;
        }

        .slide-track-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        .slide-track {
          align-items: center;
          display: flex;
          transition: transform 0.4s ease-in-out;
          height: 100%;
          will-change: transform;
        }

        .slide {
          width: 30vw;
          height: 40vh;
          max-width: 300px;
          max-height: 400px;
          margin: 0 1vw;
          position: relative;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(16px);
          border-radius: 18px;
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.15),
                      0 4px 24px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          flex-shrink: 0;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .slide:hover,
        .slide.active {
          box-shadow: 0 0 20px rgba(4, 170, 142, 0.8),
                      0 0 40px rgba(4, 170, 142, 0.4),
                      0 0 60px rgba(4, 170, 142, 0.2);
          transform: scale(1.1);
        }

        .label {
          position: relative;
          z-index: 2;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 1.2rem;
          text-align: center;
          padding: 1rem;
        }
      </style>
      <div class="carousel-wrapper">
        <div class="controls">
          <button id="prev">&#10094;</button>
          <button id="next">&#10095;</button>
        </div>
        <div class="slide-track-wrapper">
          <div class="slide-track">
            ${slidesHTML}
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const track = this.shadowRoot.querySelector('.slide-track');

    this.shadowRoot.getElementById('prev').addEventListener('click', () => this.move(-1));
    this.shadowRoot.getElementById('next').addEventListener('click', () => this.move(1));

    track.addEventListener('touchstart', (e) => this.startX = e.touches[0].clientX);
    track.addEventListener('touchend', (e) => {
      this.endX = e.changedTouches[0].clientX;
      this.handleSwipe();
    });

    track.addEventListener('mousedown', (e) => {
      this.startX = e.clientX;
    });

    track.addEventListener('mouseup', (e) => {
      this.endX = e.clientX;
      this.handleSwipe();
    });

    window.addEventListener('resize', () => this.updateTransform());
  }

  handleSwipe() {
    const threshold = 50;
    const distance = this.endX - this.startX;

    if (distance > threshold) {
      this.move(-1);
    } else if (distance < -threshold) {
      this.move(1);
    }
  }

  move(direction) {
    const slides = this.shadowRoot.querySelectorAll('.slide');
    slides[this.currentIndex].classList.remove('active');
    this.currentIndex = (this.currentIndex + direction + slides.length) % slides.length;
    slides[this.currentIndex].classList.add('active');
    this.updateTransform();
  }

  updateTransform() {
    const slides = this.shadowRoot.querySelectorAll('.slide');
    const track = this.shadowRoot.querySelector('.slide-track');
    const wrapper = this.shadowRoot.querySelector('.slide-track-wrapper');

    if (slides.length === 0 || !track || !wrapper) return;

    const slide = slides[this.currentIndex];
    const slideRect = slide.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const currentOffset = slide.offsetLeft;
    const offset = (wrapperRect.width / 2) - (slideRect.width / 2 + currentOffset);

    track.style.transform = `translateX(${offset}px)`;
  }
}

customElements.define('glass-carousel', GlassCarousel);
