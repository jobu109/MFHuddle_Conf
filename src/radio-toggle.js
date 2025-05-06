(function () {
  window.createRadioToggle = function (container, config) {
    if (!window.CrComLib || !container || !Array.isArray(config.buttons)) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'radio-toggle';
    wrapper.style.width = `${config.buttons.length * 104 + 8}px`; // 104px per button + 8px padding

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

      input.addEventListener('change', () => {
        config.buttons.forEach((b, i) => {
          CrComLib.publishEvent('b', b.feedbackJoin, i === index);
        });
      });

      wrapper.appendChild(input);
      wrapper.appendChild(label);

      if (btn.textJoin) {
        CrComLib.subscribeState('s', btn.textJoin, (val) => {
          if (val) label.textContent = val;
        });
      }

      CrComLib.subscribeState('b', btn.digitalJoin, (val) => {
        if (val) input.checked = true;
      });
    });

    container.appendChild(wrapper);

    function updateSliderPosition(index) {
      slider.style.left = `${index * 104 + 5}px`;
    }

    wrapper.addEventListener('change', () => {
      const selectedIndex = inputs.findIndex(entry => entry.input.checked);
      if (selectedIndex >= 0) updateSliderPosition(selectedIndex);
    });

    updateSliderPosition(0);
  };
})();