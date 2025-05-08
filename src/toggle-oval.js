
(function() {
  window.createToggleOval = function(container, digitalJoin, feedbackJoin) {
    if (!window.CrComLib || !container) return;

    const wrapper = document.createElement('label');
    wrapper.className = 'switch-oval';

    const input = document.createElement('input');
    input.type = 'checkbox';

    const slider = document.createElement('span');
    slider.className = 'slider-oval';

    wrapper.appendChild(input);
    wrapper.appendChild(slider);
    container.appendChild(wrapper);

    input.addEventListener('change', () => {
      CrComLib.publishEvent('b', digitalJoin, true);
      setTimeout(() => {
        CrComLib.publishEvent('b', digitalJoin, false);
      }, 100);
    });

    CrComLib.subscribeState('b', feedbackJoin, (val) => {
      input.checked = val;
    });
  };
})();
