(function () {
  window.createRadioToggle = function (container, config) {
    if (!window.CrComLib || !container || !Array.isArray(config.buttons)) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'radio-toggle';
    wrapper.style.width = `${config.buttons.length * 104 + 8}px`;

    const slider = document.createElement('span');
    slider.className = 'slider';
    slider.style.width = '100px';
    wrapper.appendChild(slider);

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

      // Momentary press logic
      input.addEventListener('change', () => {
        config.buttons.forEach((b, i) => {
          if (i === index) {
            // Pulse the digital join
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

      // Subscribe to feedbackJoin to update selection
      if (btn.feedbackJoin) {
        CrComLib.subscribeState('b', btn.feedbackJoin, (val) => {
          input.checked = val;
          if (val) updateSliderPosition(index);
        });
      }

      wrapper.appendChild(input);
      wrapper.appendChild(label);
    });

    container.appendChild(wrapper);

    function updateSliderPosition(index) {
      slider.style.left = `${index * 104 + 5}px`;
    }

    // Initialize slider
    const initialIndex = inputs.findIndex(entry => entry.input.checked);
    if (initialIndex >= 0) updateSliderPosition(initialIndex);
  };
})();
