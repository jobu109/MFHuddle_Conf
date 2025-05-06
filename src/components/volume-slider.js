import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';

class GradientBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.analogJoin = parseInt(this.getAttribute('analog-join'), 10) || 1;
    this.sendJoin = parseInt(this.getAttribute('analog-send-event-on-release'), 10) || this.analogJoin;
    this.currentValue = 0;
  }

  connectedCallback() {
    this.render();
    this.fill = this.shadowRoot.querySelector('.fill');
    this.knob = this.shadowRoot.querySelector('.knob');
    this.label = this.shadowRoot.querySelector('.percent');
    this.bar = this.shadowRoot.querySelector('.bar');

    this.subscribeFeedback();
    this.addInputHandler();
  }
  get value() {
    return this.currentValue;
  }
  
  set value(val) {
    this.currentValue = Math.min(Math.max(val, 0), 65535);
    const percent = Math.round((this.currentValue / 65535) * 100);
  
    if (this.fill) {
      const remaining = 100 - percent;
      this.fill.style.width = `${remaining}%`;
      this.fill.style.left = `${percent}%`;
    }
  
    if (this.knob) {
      this.knob.style.left = `calc(${percent}% - 16px)`;
    }
  
    if (this.label) {
      this.label.textContent = `${percent}%`;
    }
  
    // publish analog feedback too
    CrComLib.publishEvent('n', this.sendJoin, this.currentValue);
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .bar {
        width: 450px;
        height: 28px;
        background: linear-gradient(
            to right,
            #4CAF50 0%,
            #4CAF50 45%,
            #FFEB3B 55%,
            #FFEB3B 70%,
            #F44336 80%,
            #F44336 100%
        );
        border-radius: 6mm;
        box-shadow: inset -1px 2px 2px rgb(0, 0, 0),
                    1px 1px 1px rgb(120, 120, 120);
        position: relative;
        overflow: visible;
        cursor: pointer;
        z-index: 0; /* base layer for stacking */
        }

        .fill {
        position: absolute;
        top: 0;
        bottom: 0;
        left: auto;
        right: 0;
        width: 100%; /* This will get reduced dynamically */
        background: rgb(42, 42, 42); /* Covers unused portion of the gradient */
        z-index: 1;
        transition: width 0.2s ease-in-out;
        border-radius: 6mm;
        }


        .knob {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(4, 170, 142, 0.8);
          cursor: pointer;
          z-index: 10;
        }

        .knob:active {
          box-shadow: 0 0 15px rgba(4, 170, 93, 0.9);
        }

        .percent {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 8px;
        width: auto;
        height: auto;
        line-height: 1;
        text-align: center;
        font-size: 24px;
        font-weight: 500;
        font-family: "Segoe UI";
        background: none;
        color: rgba(255, 255, 255, 0.9);
        text-shadow: 1px 1px rgba(0, 0, 0, 0.2);
        opacity: 1;
        transition: none;
        }
      </style>

      <div class="bar">
        <div class="knob" style="left: 0%;"></div>
        <span class="percent">0</span>
      </div>
    `;
  }

  generateGradient(percent) {
    if (percent <= 50) {
      return `linear-gradient(
        to right,
        #4CAF50 0%,
        #4CAF50 ${percent}%,
        #444 ${percent}%,
        #444 100%
      )`;
    } else if (percent <= 75) {
      return `linear-gradient(
        to right,
        #4CAF50 0%,
        #4CAF50 45%,
        #FFEB3B 55%,
        #FFEB3B ${percent}%,
        #444 ${percent}%,
        #444 100%
      )`;
    } else {
      return `linear-gradient(
        to right,
        #4CAF50 0%,
        #4CAF50 45%,
        #FFEB3B 55%,
        #FFEB3B 70%,
        #F44336 80%,
        #F44336 ${percent}%,
        #444 ${percent}%,
        #444 100%
      )`;
    }
  }

  subscribeFeedback() {
    CrComLib.subscribeState('n', this.analogJoin, (val) => {
      this.currentValue = val;
      const percent = Math.min(Math.max(val, 0), 65535);
      const percentValue = Math.round((percent / 65535) * 100);
  
      if (this.bar) this.bar.style.background = this.generateGradient(percentValue);
      if (this.label) this.label.textContent = `${percentValue}%`;
      if (this.knob) this.knob.style.left = `calc(${percentValue}% - 16px)`;
    });
  }
  
  addInputHandler() {
    const updateFromClientX = (clientX) => {
      const rect = this.bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = x / rect.width;
      const value = Math.round(percent * 65535);
      const percentRounded = Math.round(percent * 100);

      this.knob.style.left = `calc(${percentRounded}% - 16px)`;
      const remaining = 100 - percentRounded;
      this.bar.style.background = this.generateGradient(percentRounded);    
      this.label.textContent = this.label.textContent = `${percentRounded}%`;

      CrComLib.publishEvent('n', this.sendJoin, value);
    };

    let isDragging = false;

    const startDrag = (e) => {
      isDragging = true;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      if (clientX !== undefined) updateFromClientX(clientX);
    };

    const moveDrag = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      if (clientX !== undefined) updateFromClientX(clientX);
    };

    const endDrag = () => {
      isDragging = false;
    };

    // Mouse
    this.bar.addEventListener('mousedown', startDrag);
    this.knob.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('mouseup', endDrag);

    // Touch
    this.bar.addEventListener('touchstart', startDrag);
    this.knob.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', moveDrag);
    document.addEventListener('touchend', endDrag);
  }
  
}

customElements.define('volume-slider', GradientBar);
