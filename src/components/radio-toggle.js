import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';

class RadioToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.joins = {
      left: this.getAttribute('digital-join-left'),
      middle: this.getAttribute('digital-join-middle'),
      right: this.getAttribute('digital-join-right'),
    };

    this.feedbacks = {
      left: this.getAttribute('feedback-left'),
      middle: this.getAttribute('feedback-middle'),
      right: this.getAttribute('feedback-right'),
    };

    this.textJoins = {
      left: this.getAttribute('text-join-left'),
      middle: this.getAttribute('text-join-middle'),
      right: this.getAttribute('text-join-right'),
    };

    this.labels = {
      left: 'Button 1',
      middle: 'Button 2',
      right: 'Button 3',
    };
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
    this.subscribeJoins();
    this.subscribeTextLabels();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .inputf {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          background: rgba(240, 240, 240, 0.1);
          border-radius: 6px;
          position: relative;
          font-family: 'Poppins', sans-serif;
        }
  
        .inputf input {
          display: none;
        }
  
        .inputf label {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 40px;
          cursor: pointer;
          position: relative;
          z-index: 2;
          font-weight: 500;
          color: #888;
          font-size: 0.9rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
  
        .slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 100px;
          height: 40px;
          background: white;
          border-radius: 6px;
          transition: 0.25s ease-in-out;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          z-index: 1;
        }
  
        #radio-left:checked ~ .slider { left: 2px; }
        #radio-middle:checked ~ .slider { left: 104px; }
        #radio-right:checked ~ .slider { left: 206px; }
  
        #radio-left:checked ~ label[for="radio-left"] { color: green; }
        #radio-middle:checked ~ label[for="radio-middle"] { color: orange; }
        #radio-right:checked ~ label[for="radio-right"] { color: red; }
      </style>
  
      <div class="inputf">
        <input type="radio" name="selector" id="radio-left" checked>
        <input type="radio" name="selector" id="radio-middle">
        <input type="radio" name="selector" id="radio-right">
  
        <span class="slider"></span>
  
        <label for="radio-left" id="label-left"></label>
        <label for="radio-middle" id="label-middle"></label>
        <label for="radio-right" id="label-right"></label>
      </div>
    `;
  
    this.shadowRoot.querySelector('#label-left').textContent = 'Button 1';
    this.shadowRoot.querySelector('#label-middle').textContent = 'Button 2';
    this.shadowRoot.querySelector('#label-right').textContent = 'Button 3';
  }
  

  setupEvents() {
    const setState = (active) => {
      ['left', 'middle', 'right'].forEach((key) => {
        if (this.feedbacks[key]) {
          CrComLib.publishEvent('b', this.feedbacks[key], key === active);
        }
      });
    };

    this.shadowRoot.querySelector('#radio-left').addEventListener('change', () => setState('left'));
    this.shadowRoot.querySelector('#radio-middle').addEventListener('change', () => setState('middle'));
    this.shadowRoot.querySelector('#radio-right').addEventListener('change', () => setState('right'));
  }

  subscribeJoins() {
    Object.entries(this.joins).forEach(([key, join]) => {
      if (!join) return;
      CrComLib.subscribeState('b', join, (val) => {
        if (val) {
          this.shadowRoot.querySelector(`#radio-${key}`).checked = true;
        }
      });
    });
  }

  subscribeTextLabels() {
    Object.entries(this.textJoins).forEach(([key, join]) => {
      if (!join) return;
      CrComLib.subscribeState('s', join, (val) => {
        const el = this.shadowRoot.querySelector(`#label-${key}`);
        if (el) el.textContent = val;
      });
    });
  }
}

customElements.define('radio-toggle', RadioToggle);
