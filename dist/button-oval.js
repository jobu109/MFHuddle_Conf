window.createOvalButton = function (container, digitalJoin, feedbackJoin, labelJoin, iconClass) {
  if (!window.CrComLib || !container) return;

  const wrapper = document.createElement('label');
  wrapper.className = 'oval-btn-wrapper';

  const button = document.createElement('button');
  button.className = 'oval-btn';

  const icon = document.createElement('i');
  icon.className = `fas ${iconClass} oval-btn-icon`; // <-- use argument here

  const label = document.createElement('span');
  label.className = 'oval-btn-label';
  label.textContent = 'Button';

  button.appendChild(icon);
  button.appendChild(label);
  wrapper.appendChild(button);
  container.appendChild(wrapper);

  // Events and feedback
  button.addEventListener('mousedown', () => CrComLib.publishEvent('b', digitalJoin, true));
  button.addEventListener('mouseup', () => CrComLib.publishEvent('b', digitalJoin, false));
  button.addEventListener('mouseleave', () => CrComLib.publishEvent('b', digitalJoin, false));
  button.addEventListener('touchstart', () => CrComLib.publishEvent('b', digitalJoin, true));
  button.addEventListener('touchend', () => CrComLib.publishEvent('b', digitalJoin, false));

  CrComLib.subscribeState('b', feedbackJoin, (val) => {
    button.classList.toggle('active', val);
  });

  CrComLib.subscribeState('s', labelJoin, (val) => {
    label.textContent = val;
  });
};
