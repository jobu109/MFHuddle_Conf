
(function() {
  window.createToggleRollingReverse = function(container, digitalJoin, feedbackJoin) {
    if (!window.CrComLib || !container) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'toggle-rolling-reverse';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `toggle-${digitalJoin}`;

    const label = document.createElement('label');
    label.setAttribute('for', input.id);

    const thumb = document.createElement('div');
    thumb.className = 'thumb';

    const rotator = document.createElement('div');
    rotator.className = 'rotator';

    const sideLeft = document.createElement('div');
    sideLeft.className = 'side left';

    const sideRight = document.createElement('div');
    sideRight.className = 'side right';

    rotator.appendChild(sideLeft);
    rotator.appendChild(sideRight);
    thumb.appendChild(rotator);
    label.appendChild(thumb);
    wrapper.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
      // Momentary press
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
