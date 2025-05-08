
(function() {
  window.createToggleSwitch = function(container, digitalJoin, feedbackJoin) {
    if (!window.CrComLib || !container) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'tsw-toggle-center';

    const center = document.createElement('div');
    center.className = 'tsw-toggle-center';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `toggle-switch-${digitalJoin}`;

    const label = document.createElement('label');
    label.className = 'tsw-toggle-switch';
    label.setAttribute('for', input.id);

    const modeOff = document.createElement('div');
    modeOff.className = 'tsw-toggle-mode';
    const textOff = document.createElement('div');
    textOff.className = 'tsw-toggle-text';
    textOff.textContent = 'OFF';
    modeOff.appendChild(textOff);

    const modeOn = document.createElement('div');
    modeOn.className = 'tsw-toggle-mode';
    const textOn = document.createElement('div');
    textOn.className = 'tsw-toggle-text';
    textOn.textContent = 'ON';
    modeOn.appendChild(textOn);

    const indicatorLeft = document.createElement('div');
    indicatorLeft.className = 'tsw-toggle-indicator tsw-toggle-left';

    const indicatorRight = document.createElement('div');
    indicatorRight.className = 'tsw-toggle-indicator tsw-toggle-right';

    label.appendChild(modeOff);
    label.appendChild(modeOn);
    label.appendChild(indicatorLeft);
    label.appendChild(indicatorRight);

    center.appendChild(input);
    center.appendChild(label);
    wrapper.appendChild(center);
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
