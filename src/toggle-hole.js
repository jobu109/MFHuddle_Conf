(function () {
  window.createToggleHole = function (container, digitalJoin, feedbackJoin) {
    if (!window.CrComLib || !container) return;

    const wrapper = document.createElement('label');
    wrapper.className = 'switch-hole';

    const input = document.createElement('input');
    input.type = 'checkbox';

    const slider = document.createElement('span');
    slider.className = 'slider-hole';

    wrapper.appendChild(input);
    wrapper.appendChild(slider);
    container.appendChild(wrapper);

    // Prevent the UI from changing .checked itself
    input.addEventListener('click', (e) => {
      e.preventDefault(); // stops the visual toggle
      CrComLib.publishEvent('b', digitalJoin, true);
      setTimeout(() => {
        CrComLib.publishEvent('b', digitalJoin, false);
      }, 100);
    });

    // Only update .checked from feedback input
    CrComLib.subscribeState('b', feedbackJoin, (val) => {
      input.checked = val;
    });
  };
})();
