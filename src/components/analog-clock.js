import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';

class AnalogClock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.timeJoin = this.getAttribute('time-join') || '1';
    this.cityJoin = this.getAttribute('city-join') || '2';
  }

  connectedCallback() {
    this.render();
    this.drawMarkers();
    this.subscribeTime();
    this.subscribeCity();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
        display: block;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        overflow: visible;
        }

        .container {
          display: flex;
          background: transparent;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .city-name {
          font-family: 'Segoe UI', sans-serif;
          font-size: 32px;
          font-weight: 600;
          color: white;
          margin-bottom: 20px;
        }

        .clock {
        width: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
        overflow: visible;
        border-radius: 50%;

        background: radial-gradient(
            circle,
            rgba(4, 170, 142, 0.25) 0%,
            rgba(0, 0, 0, 0.6) 50%,
            rgba(0, 0, 0, 0.9) 100%
        );

        box-shadow: 0 0 60px 15px rgba(4, 170, 142, 0.4);
        }

        .glow-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        height: 90%;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(4, 170, 142, 0.3), transparent 70%);
        box-shadow: 0 0 40px 3px rgba(4, 170, 142, 0.6);
        z-index: 0;
        }

        .points {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .point {
          width: 1px;
          height: 12px;
          display: block;
          background: rgba(255, 255, 255, 0.7);
          position: absolute;
          top: calc(50% - 6px);
          left: calc(50% - 0.5px);
        }

        .point.big {
          height: 14px;
          background: white;
          top: calc(50% - 7px);
        }

        .point.big .text {
          font-family: 'Segoe UI', sans-serif;
          color: white;
          position: absolute;
          top: 100%;
          font-size: 20px;
          font-weight: 600;
          width: 40px;
          text-align: center;
          left: calc(50% - 20px);
        }

        .seconds, .minutes, .hours {
          width: 2px;
          position: absolute;
          top: 50%;
          left: calc(50% - 1px);
          transform-origin: 1px 0;
        }

        .seconds {
          height: 182px;
          background: orange;
          transform-origin: 1px 26px;
          top: calc(50% - 26px);
        }

        .minutes, .hours {
          background: white;
        }

        .hours {
          height: 110px;
        }

        .minutes {
          height: 155px;
        }

        .minutes::before, .hours::before {
          content: "";
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translate(-50%, 0);
          width: 12px;
          height: calc(100% - 22px);
          background: white;
          border-radius: 2mm;
        }

        .pivot, .pivot::before {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }

        .pivot {
          width: 10px;
          height: 10px;
          background: black;
          border: 3px solid white;
        }

        .pivot::before {
          content: "";
          width: 5px;
          height: 5px;
          border: 3px solid orange;
        }
      </style>

      <div class="container">
        <div class="city-name" id="city">Loading...</div>
        <div class="clock">
        <div class="glow-ring"></div> 
        <div class="points"></div>
        <div class="minutes"></div>
        <div class="seconds"></div>
        <div class="hours"></div>
        <div class="pivot"></div>
        </div>

      </div>
    `;
  }

  drawMarkers() {
    const points = this.shadowRoot.querySelector('.points');
    let j = 12;
    for (let i = 0; i < 360; i += 6) {
      const point = document.createElement('span');
      point.className = 'point';
      if ((i / 6) % 5 === 0) {
        point.className += ' big';
        const text = document.createElement('span');
        text.className = 'text';
        text.textContent = j;
        text.style.transform = `rotate(${-i}deg) translateY(2px)`;
        j = (j === 12) ? 1 : j + 1;
        point.appendChild(text);
      }
      point.style.transform = `rotate(${i}deg) translateY(-150px)`;
      points.appendChild(point);
    }
  }

  subscribeTime() {
    const secondsHand = this.shadowRoot.querySelector('.seconds');
    const minutesHand = this.shadowRoot.querySelector('.minutes');
    const hoursHand = this.shadowRoot.querySelector('.hours');

    CrComLib.subscribeState('s', this.timeJoin, (val) => {
      const parts = val.trim().split(':');
      if (parts.length !== 3) return;

      const [h, m, s] = parts.map(Number);
      const hourDeg = ((h % 12) + m / 60) * 30;
      const minuteDeg = m * 6;
      const secondDeg = s * 6;

      secondsHand.style.transition = s === 0 ? "none" : "0.25s";
      minutesHand.style.transition = m === 0 ? "none" : "0.25s";
      hoursHand.style.transition = h === 0 ? "none" : "0.25s";

      secondsHand.style.transform = `rotate(${secondDeg - 180}deg)`;
      minutesHand.style.transform = `rotate(${minuteDeg - 180}deg)`;
      hoursHand.style.transform = `rotate(${hourDeg - 180}deg)`;
    });
  }

  subscribeCity() {
    const cityLabel = this.shadowRoot.getElementById('city');
    CrComLib.subscribeState('s', this.cityJoin, (val) => {
      cityLabel.textContent = val || 'City';
    });
  }
}

customElements.define('analog-clock', AnalogClock);
