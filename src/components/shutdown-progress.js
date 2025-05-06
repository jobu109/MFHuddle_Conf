import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';

class ShutdownProgress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.analogJoin = this.getAttribute('analog-join');
    this.textJoin = this.getAttribute('text-join');
  }

  connectedCallback() {
    this.render();
    this.subscribeAnalog();
    this.subscribeText();
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

        .file-transfer {
          width: 420px;
          padding: 10px;
          box-sizing: border-box;
          border-radius: 3mm;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.3);
          backdrop-filter: blur(4px);
          font-family: "Segoe UI", sans-serif;
        }

        .head {
          display: flex;
          justify-content: center; /* center horizontally */
          margin-bottom: 10px;
        }
        .details {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .left {
          display: flex;
          align-items: center;
          color: rgb(15, 15, 15);
        }

        .title {
          font-size: 14px;
          font-weight: 500;
          text-align: center;
        }

        .details {
          margin: 20px 0;
          padding: 0 5px;
          color: rgb(15, 15, 15);
        }

        .percentage {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          width: 100%;
        }

        .progress {
          width: calc(100% - 10px);
          height: 10px;
          background: rgba(100, 100, 100, 0.2);
          margin: auto;
          border-radius: 2mm;
          position: relative;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 0%;
          background: rgb(6, 197, 17);
          border-radius: 2mm;
          transition: width 0.3s ease-out;
        }

        .note {
          padding: 0 5px 5px 5px;
          font-size: 12px;
          color: rgb(15, 15, 15);
          font-weight: 300;
        }
      </style>

      <div class="center">
        <div class="file-transfer">
          <div class="head">
            <div class="left">
              <span class="title">System Shutdown in Progress</span>
            </div>
          </div>

          <div class="details">
            <div class="percentage"><span class="value">0%</span> Complete</div>
          </div>

          <div class="progress">
            <div class="progress-fill"></div>
          </div>

          <div class="note" id="note">Estimated 0 Seconds Remaining...</div>
        </div>
      </div>
    `;
  }

  subscribeAnalog() {
    if (!this.analogJoin) return;
    const valueSpan = this.shadowRoot.querySelector('.value');
    const bar = this.shadowRoot.querySelector('.progress-fill');

    CrComLib.subscribeState('n', this.analogJoin, (val) => {
      const percent = Math.max(0, Math.min(100, Math.round(val)));
      valueSpan.textContent = `${percent}%`;
      bar.style.width = `${percent}%`;
    });
  }

  subscribeText() {
    if (!this.textJoin) return;
    const note = this.shadowRoot.querySelector('#note');
    CrComLib.subscribeState('s', this.textJoin, (val) => {
      note.textContent = val || 'Estimated 0 Seconds Remaining...';
    });
  }
}

customElements.define('shutdown-progress', ShutdownProgress);
