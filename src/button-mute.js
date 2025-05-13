
(function () {
    window.createMuteButton = function (container, digitalJoin, feedbackJoin, labelJoin, iconClass) {
      if (!window.CrComLib || !container) return;
  
      const wrapper = document.createElement('label');
      wrapper.className = 'mute-group';
  
      const button = document.createElement('button');
      button.id = 'mute-btn';
  
      const icon = document.createElement('i');
      icon.className = `fas ${iconClass}`;
  
      const label = document.createElement('span');
      label.textContent = 'Mute';
  
      button.appendChild(icon);
      button.appendChild(label);
      wrapper.appendChild(button);
      container.appendChild(wrapper);
  
      // Events
      button.addEventListener('mousedown', () => CrComLib.publishEvent('b', digitalJoin, true));
      button.addEventListener('mouseup', () => CrComLib.publishEvent('b', digitalJoin, false));
      button.addEventListener('mouseleave', () => CrComLib.publishEvent('b', digitalJoin, false));
      // Touch
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        CrComLib.publishEvent('b', digitalJoin, true);
      });
      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        CrComLib.publishEvent('b', digitalJoin, false);
      });
  
      CrComLib.subscribeState('b', feedbackJoin, (val) => {
        button.classList.toggle('active', val);
      });
  
      CrComLib.subscribeState('s', labelJoin, (val) => {
        label.textContent = val;
      });
    };
  })();
  