import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';

class CircularGauge extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.percent = 0;
      this.feedbackJoin = this.getAttribute("feedback-join") || "1";
      this.controlJoin = this.getAttribute("control-join") || "2";
      this.labelJoin = this.getAttribute("label-join") || null;
    }
  
    connectedCallback() {
      this.render();
      this.cacheElements();
      this.setupListeners();
      this.setupFeedback();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <style>
          :host {
            display: block;
            width: 300px;
            user-select: none;
          }

            .wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
            }

          .slider {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            filter: drop-shadow(0 0 8px rgba(4, 170, 142, 0.8));
          }
          .gauge-container {
            width: 100%;
            position: relative;
          }
            .knob-hitbox {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            z-index: 10;
          }

          .knob {
            width: 73%;
            height: 73%;
            position: absolute;
            background: rgb(94 143 135);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 0 2px rgba(4, 170, 142, 0.8));
          }
            
            .knob:hover {
            box-shadow: 0 0 25px rgba(238, 6, 6, 0.6);
          }

          .rotator {
            width: 82%;
            height: 82%;
            background: #eee;
            background: rgba(11,127,107,0.8);
            border-radius: 50%;
            box-shadow: inset 1px 2px 1px white,
                        2px -1px 1px rgba(0, 0, 0, 0.2),
                        -1px 0px 1px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 0 8px rgba(4, 170, 142, 0.8));
          }
          .text {
            font-size: 1em; /* relative */
            font-weight: 600;
            color: white;
            border: 0.15em solid white;
            border-radius: 50%;
            width: 35%;
            height: 35%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .pointer {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            transform-origin: center;
          }

          .pointer span {
            font-size: 2rem;
            display: inline-block;
            transform-origin: left center;
          }

          .label {
            text-align: center;
            color: white;
            font-size: 1.5rem;
            font-family: 'Poppins', sans-serif;
            padding: 0px 0;
            width: 100%;
            height: auto;
            min-height: 20px;
            margin-top: 8px;
            margin-bottom: 8px;
            position: relative;
            overflow: visible;
          }

          circle {
            fill: none;
          }

          .progress-bar circle:nth-child(1) {
            stroke: #aaa;
            stroke-width: 15px;
            stroke-dasharray: 660;
            transform: rotate(135deg);
            transform-origin: center;
            stroke-linecap: round;
          }
          .progress-bar circle:nth-child(2) {
            stroke: url(#gradient);
            stroke-width: 15px;
            stroke-dasharray: 880;
            stroke-dashoffset: 880;
            transform: rotate(135deg);
            transform-origin: center;
            stroke-linecap: round;
          }
        </style>
        <div class="wrapper">
          <div class="slider">
            <div class="gauge-container">
            <div class="knob-hitbox">
              <div class="knob">
                <div class="rotator">
                  <div class="text">0</div>
                </div>
              </div>
            </div>
              <svg class="progress-bar" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%;">
                <circle cx="150" cy="150" r="140"></circle>
                <circle id="circle2" cx="150" cy="150" r="140"></circle>
                  <line id="gauge-pointer" x1="150" y1="150" x2="150" y2="20"
                    stroke="white" stroke-width="4" stroke-linecap="round"
                    transform="rotate(-135, 150, 150)" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="red" />
                    <stop offset="65%" stop-color="orange" />
                    <stop offset="100%" stop-color="limegreen" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="label">Mic Name</div>
          </div>
        </div>
      `;
    }
  
    cacheElements() {
      this.knob = this.shadowRoot.querySelector(".knob");
      this.pointer = this.shadowRoot.querySelector(".pointer");
      this.circle = this.shadowRoot.getElementById("circle2");
      this.text = this.shadowRoot.querySelector(".text");
      this.label = this.shadowRoot.querySelector(".label");
    }
  
    setupListeners() {
      let isDragging = false;
  
      this.shadowRoot.querySelector(".knob-hitbox").addEventListener("mousedown", () => isDragging = true);
      document.addEventListener("mouseup", () => isDragging = false);
  
      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
  
        const rect = this.knob.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
  
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = (angleRad * 180) / Math.PI;
        let rotationAngle = (angleDeg - 135 + 360) % 360;
  
        if (rotationAngle <= 270) {
          const percent = Math.round((rotationAngle / 270) * 100);
          this.updateGauge(percent);
          const crestronVal = Math.round((percent / 100) * 65535);
          CrComLib.publishEvent("n", this.controlJoin, crestronVal);
        }
      });
    }
  
    setupFeedback() {
      CrComLib.subscribeState("n", this.feedbackJoin, (val) => {
        const percent = Math.round((val / 65535) * 100);
        this.updateGauge(percent);
      });
      if (this.labelJoin) {
        CrComLib.subscribeState('s', this.labelJoin, (val) => {
          // Only update the label if the received value is not null, undefined, or an empty string
          if (val !== null && val !== undefined && val !== "") {
            this.label.textContent = val;
          }
        });
      }
    }
  
    updateGauge(percent) {
      const angle = (percent / 100) * 270 - 135;
    
      const pointerLine = this.shadowRoot.getElementById('gauge-pointer');
      if (pointerLine) {
        pointerLine.setAttribute('transform', `rotate(${angle}, 150, 150)`);
      }
    
      this.text.textContent = `${percent}%`;
    
      const fill = 660 * (percent / 100);
      this.circle.style.strokeDashoffset = 880 - fill;
    }
    
  }
  
  customElements.define("circular-gauge", CircularGauge);
  