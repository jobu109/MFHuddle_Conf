
(function() {
  window.createToggleSwitch = function(container, digitalJoin, feedbackJoin) {
    if (!window.CrComLib || !container) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'toggle-switch-wrapper';

    const center = document.createElement('div');
    center.className = 'center';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `toggle-switch-${digitalJoin}`;

    const label = document.createElement('label');
    label.className = 'switch';
    label.setAttribute('for', input.id);

    const modeOff = document.createElement('div');
    modeOff.className = 'mode';
    const textOff = document.createElement('div');
    textOff.className = 'text';
    textOff.textContent = 'OFF';
    modeOff.appendChild(textOff);

    const modeOn = document.createElement('div');
    modeOn.className = 'mode';
    const textOn = document.createElement('div');
    textOn.className = 'text';
    textOn.textContent = 'ON';
    modeOn.appendChild(textOn);

    const indicatorLeft = document.createElement('div');
    indicatorLeft.className = 'indicator left';

    const indicatorRight = document.createElement('div');
    indicatorRight.className = 'indicator right';

    label.appendChild(modeOff);
    label.appendChild(modeOn);
    label.appendChild(indicatorLeft);
    label.appendChild(indicatorRight);

    center.appendChild(input);
    center.appendChild(label);
    wrapper.appendChild(center);
    container.appendChild(wrapper);

    input.addEventListener('change', () => {
      CrComLib.publishEvent('b', digitalJoin, input.checked);
    });

    CrComLib.subscribeState('b', feedbackJoin, (val) => {
      input.checked = val;
    });
  };
})();
