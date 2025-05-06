import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';

class CircularPreloader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.textJoin = this.getAttribute('text-join');
    this.defaultText = 'Your Text Goes Here';
  }

  connectedCallback() {
    this.render();
    this.populateCircles(this.defaultText);
    this.subscribeToTextJoin();
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
        }

        .circle {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          transform-style: preserve-3d;
          animation: rotate 10s ease-in-out infinite var(--delay);
        }

        .letter {
          position: absolute;
          display: block;
          font-size: 50px;
          font-family: Poppins, sans-serif;
          font-weight: 900;
          color: white;
          text-shadow: 1px 1px 0 rgb(80, 80, 80);
        }

        .circle:nth-child(1) .letter {
          text-shadow: 1px 1px 0 black, 2px 2px 0 black, 2px 3px 0 black,
            2px 4px 0 black, 2px 5px 0 black;
        }

        .circle:nth-child(1) .letter {
        color: white;
        font-size: 50px;
        text-shadow: 1px 1px 0 black, 2px 2px 0 black, 2px 3px 0 black,
                    2px 4px 0 black, 2px 5px 0 black;
        }

        .circle:nth-child(2) .letter {
        color: #cccccc; /* light gray */
        font-size: 47px;
        }

        .circle:nth-child(3) .letter {
        color: #999999; /* medium gray */
        font-size: 44px;
        }

        .circle:nth-child(4) .letter {
        color: #666666; /* darker gray */
        font-size: 41px;
        }

        .circle:nth-child(5) .letter {
        color: #333333; /* very dark gray */
        font-size: 38px;
        }

        .circle:nth-child(6) .letter {
        color: black;
        font-size: 35px;
        text-shadow: 5px 10px 0 rgba(255, 255, 255, 0);
        }

        @keyframes rotate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
        }
      </style>

      <div class="center">
        <div class="circle" style="--delay: 0s"></div>
        <div class="circle" style="--delay: 0.1s"></div>
        <div class="circle" style="--delay: 0.2s"></div>
        <div class="circle" style="--delay: 0.3s"></div>
        <div class="circle" style="--delay: 0.4s"></div>
        <div class="circle" style="--delay: 0.5s"></div>
      </div>
    `;
  }

  populateCircles(text) {
    const circles = this.shadowRoot.querySelectorAll('.circle');
    const angleStep = 360 / text.length;
    let y = 0;

    circles.forEach((circle) => {
      circle.innerHTML = ''; // Clear previous letters
      let j = 0;
      for (let i = 0; i < 360; i += angleStep) {
        const letter = document.createElement('span');
        letter.className = 'letter';
        letter.innerText = text[j] || '';
        letter.style.transform = `rotate(${i}deg) translateY(${-150 + y}px)`;
        circle.appendChild(letter);
        j++;
      }
      circle.style.zIndex = 1000 - y;
      y += 10;
    });
  }

  subscribeToTextJoin() {
    if (this.textJoin) {
      CrComLib.subscribeState('s', this.textJoin, (val) => {
        this.populateCircles(val || this.defaultText);
      });
    }
  }
}

customElements.define('circular-preloader', CircularPreloader);
