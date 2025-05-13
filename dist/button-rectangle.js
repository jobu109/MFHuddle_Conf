
(function () {
    window.createRectButton = function (container, digitalJoin, feedbackJoin, labelJoin) {
      if (!window.CrComLib || !container) return;
  
      const button = document.createElement('button');
      button.className = 'rect-btn';
  
      const label = document.createElement('span');
      label.className = 'rect-btn-label';
      label.textContent = 'Button';
  
      button.appendChild(label);
      container.appendChild(button);
  
      // Press events
      button.addEventListener('mousedown', () => CrComLib.publishEvent('b', digitalJoin, true));
      button.addEventListener('mouseup', () => CrComLib.publishEvent('b', digitalJoin, false));
      button.addEventListener('mouseleave', () => CrComLib.publishEvent('b', digitalJoin, false));
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        CrComLib.publishEvent('b', digitalJoin, true);
      });
      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        CrComLib.publishEvent('b', digitalJoin, false);
      });
  
      // Feedback
      CrComLib.subscribeState('b', feedbackJoin, (val) => {
        button.classList.toggle('active', val);
      });
  
      // Label update
      CrComLib.subscribeState('s', labelJoin, (val) => {
        label.textContent = val || 'Button'; // Default fallback;
      });
    };
  })();
  