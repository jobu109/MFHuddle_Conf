import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';

class ThreeDButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.digitalJoin = this.getAttribute('digital-join') || '1';
    this.feedbackJoin = this.getAttribute('feedback-join') || null;
  }

  connectedCallback() {
    this.render();
    this.cacheElements();
    this.setupEvents();
    this.setupFeedback();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        :host {
          display: inline-block;
          font-family: 'Poppins', sans-serif;
        }
        button {
          width: 140px;
          height: 50px;
          position: relative;
          background: none;
          outline: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
        }
        .top {
          width: 100%;
          height: 100%;
          background: rgb(255, 255, 238);
          font-size: 16px;
          color: rgb(36, 38, 34);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7mm;
          outline: 2px solid rgb(36, 38, 34);
          transition: 0.2s;
          position: relative;
          overflow: hidden;
        }
        .bottom {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgb(229, 229, 199);
          top: 10px;
          left: 0;
          border-radius: 7mm;
          outline: 2px solid rgb(36, 38, 34);
          z-index: -1;
        }
        .bottom::before,
        .bottom::after {
          position: absolute;
          content: "";
          width: 2px;
          height: 9px;
          background: rgb(36, 38, 34);
          bottom: 0;
        }
        .bottom::before {
          left: 15%;
        }
        .bottom::after {
          left: 85%;
        }
        button::before {
          position: absolute;
          content: "";
          width: calc(100% + 2px);
          height: 100%;
          background: rgb(140, 140, 140);
          top: 14px;
          left: -1px;
          border-radius: 7mm;
          outline: 2px solid rgb(36, 38, 34);
          z-index: -1;
        }
        .top::before {
          position: absolute;
          content: "";
          width: 15px;
          height: 100%;
          background: rgba(0, 0, 0, 0.1);
          transform: skewX(30deg);
          left: -20px;
          transition: 0.25s;
        }
        button:active .top::before {
          left: calc(100% + 20px);
        }
        button.pressed .top {
          transform: translateY(10px);
        }
      </style>
      <button type="button">
        <div class="top"><slot>Click Me!</slot></div>
        <div class="bottom"></div>
      </button>
    `;
  }

  cacheElements() {
    this.button = this.shadowRoot.querySelector('button');
    this.top = this.shadowRoot.querySelector('.top');
  }

  setupEvents() {
    this.button.addEventListener('mousedown', () => {
      CrComLib.publishEvent('b', this.digitalJoin, true);
    });

    this.button.addEventListener('mouseup', () => {
      CrComLib.publishEvent('b', this.digitalJoin, false);
    });

    // Optional: simulate "click" effect without needing feedbackJoin
    if (!this.feedbackJoin) {
      this.button.addEventListener('mousedown', () => {
        this.button.classList.add('pressed');
      });
      this.button.addEventListener('mouseup', () => {
        this.button.classList.remove('pressed');
      });
      this.button.addEventListener('mouseleave', () => {
        this.button.classList.remove('pressed');
      });
    }
  }

  setupFeedback() {
    if (!this.feedbackJoin) return;

    CrComLib.subscribeState('b', this.feedbackJoin, (val) => {
      if (val) {
        this.button.classList.add('pressed');
      } else {
        this.button.classList.remove('pressed');
      }
    });
  }
}

customElements.define('three-d-button', ThreeDButton);
