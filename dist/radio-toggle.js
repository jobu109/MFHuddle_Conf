(function () {
  window.createRadioToggle = function (container, config) {
    if (!window.CrComLib || !container || !Array.isArray(config.buttons)) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'radio-toggle';
    //wrapper.style.width = `${config.buttons.length * 104}px`;
    wrapper.style.width = '100%'; // Allow container to auto-size

  
    const inputs = [];

    config.buttons.forEach((btn, index) => {
      const id = `radio-${config.groupId}-${btn.digitalJoin}`;

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `selector-${config.groupId}`;
      input.id = id;
      if (index === 0) input.checked = true;
      inputs.push({ input, join: btn.digitalJoin });

      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.id = `label-${config.groupId}-${index}`;
      label.textContent = btn.label;

      // Pulse the digital join when selected
      input.addEventListener('change', () => {
        config.buttons.forEach((b, i) => {
          if (i === index) {
            CrComLib.publishEvent('b', b.digitalJoin, true);
            setTimeout(() => {
              CrComLib.publishEvent('b', b.digitalJoin, false);
            }, 100);
          }
        });
      });

      // Optional dynamic label
      if (btn.textJoin) {
        CrComLib.subscribeState('s', btn.textJoin, (val) => {
          if (val) label.textContent = val;
        });
      }

      // Feedback state for pressed effect
      if (btn.feedbackJoin) {
        CrComLib.subscribeState('b', btn.feedbackJoin, (val) => {
          input.checked = val;
          //const labelEl = document.getElementById(`label-${config.groupId}-${index}`);
          if (val) {
            label.classList.add('pressed');
          } else {
            label.classList.remove('pressed');
          }
        });
      }

      wrapper.appendChild(input);
      wrapper.appendChild(label);
    });

    container.appendChild(wrapper);
  };
})();
