import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';

class RollingMenu extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.analogJoin = this.getAttribute('analog-join') || '1';
    this.feedbackJoin = this.getAttribute('analog-feedback') || this.analogJoin;
    this.itemCountJoin = this.getAttribute('item-count-join') || '2'; // New
    this.baseTextJoin = this.getAttribute('text-join-base') || '10'; // New: serial start join

    this.items = [];
    this.itemEls = [];
    this.angle = 0;
    this.currentIndex = 0;
    this.threshold = 80;
    this.accumulatedDeltaY = 0;
  }

  connectedCallback() {
    this.render();
    setTimeout(() => {
      if (this.items.length === 0) this.updateItemCount(15);
    }, 1000); // fallback after 1 second if no join sets item count
    this.subscribeAnalog();
    this.subscribeItemCount();
    this.subscribeLabels();
    this.setupScroll();
  }
  

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .center {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }
        .menu {
        width: 100%;
        height: 100%;
        background: transparent;
        position: relative;
        }
        .items {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }
        .item {
          display: block;
          text-decoration: none;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 24px;
          font-weight: 500;
          width: 100%;
          height: 40px;
          text-align: center;
          position: absolute;
          top: calc(50% - 20px);
          backface-visibility: hidden;
          transition: 0.2s;
        }
        .item.active {
          text-shadow: 0 0 10px white, 0 0 20px white;
        }
      </style>
      <div class="center">
        <div class="menu">
          <div class="items"></div>
        </div>
      </div>
    `;
    this.itemsContainer = this.shadowRoot.querySelector('.items');
  }

  setupScroll() {
    let startY = 0;
  
    // Mouse wheel support
    this.shadowRoot.querySelector('.menu').addEventListener('wheel', (e) => {
      e.preventDefault();
      this.handleScrollDelta(e.deltaY);
    });
  
    // Touch support
    this.shadowRoot.querySelector('.menu').addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    });
  
    this.shadowRoot.querySelector('.menu').addEventListener('touchmove', (e) => {
      const deltaY = startY - e.touches[0].clientY;
      this.handleScrollDelta(deltaY);
      startY = e.touches[0].clientY;
    });
  }
  
  // Reusable scroll handler
  handleScrollDelta(deltaY) {
    this.accumulatedDeltaY += deltaY;
  
    if (Math.abs(this.accumulatedDeltaY) >= this.threshold) {
        const direction = this.accumulatedDeltaY < 0 ? 1 : -1;
      this.currentIndex = (this.currentIndex + direction + this.items.length) % this.items.length;
      this.rotateToIndex(this.currentIndex);
      this.publishCurrentIndex();
      this.accumulatedDeltaY = 0;
    }
  }
  

  rotateToIndex(index) {
    this.angle = index * (360 / this.items.length); 
    let iter = this.angle;
    [...this.itemEls].reverse().forEach((item, i) => {
    const containerHeight = this.shadowRoot.querySelector('.menu').offsetHeight;
    const baseDepth = containerHeight * 0.35; // 35% of height is a good depth ring
const spacing = Math.max(60, baseDepth / this.items.length); // Don't go below 60px       
    item.style.transform = `rotateX(${iter}deg) translateZ(${spacing}px)`;
    const opacity = this.findOpacity(iter % 360);
      item.style.opacity = opacity;
      item.className = 'item' + (opacity === 1 ? ' active' : '');
      iter += 360 / this.items.length;
    });
    
  }

  findOpacity(angle) {
    let newAngle = (angle + 360) % 360;
    if (newAngle > 180) newAngle = 360 - newAngle;
    return 1 - (newAngle % 90) / 90;
  }

  publishCurrentIndex() {
    CrComLib.publishEvent('n', this.feedbackJoin, this.currentIndex + 1); // 1-based
  }

  subscribeAnalog() {
    CrComLib.subscribeState('n', this.analogJoin, (val) => {
      const idx = Math.max(0, Math.min(this.items.length - 1, val - 1));
      this.currentIndex = idx;
      this.rotateToIndex(idx);
    });
  }

  subscribeItemCount() {
    CrComLib.subscribeState('n', this.itemCountJoin, (val) => {
      this.updateItemCount(val);
    });
  }

  updateItemCount(count) {
    this.items = new Array(parseInt(count)).fill('').map((_, i) => `Item ${i + 1}`);
    this.itemsContainer.innerHTML = '';
    this.itemEls = [];

    this.items.forEach((text, i) => {
      const div = document.createElement('div');
      div.classList.add('item');
      div.textContent = text;
      this.itemsContainer.appendChild(div);
      this.itemEls.push(div);
    });

    this.rotateToIndex(this.currentIndex);
  }

  subscribeLabels() {
    for (let i = 0; i < 20; i++) { // Support up to 20 items
      const join = parseInt(this.baseTextJoin) + i;
      CrComLib.subscribeState('s', join.toString(), (val) => {
        if (i < this.items.length) {
          this.items[i] = val;
          if (this.itemEls[i]) this.itemEls[i].textContent = val;
        }
      });
    }
  }
}

customElements.define('rolling-menu', RollingMenu);
