
(function() {
    window.createToggleSquare = function(container, digitalJoin, feedbackJoin) {
      if (!window.CrComLib || !container) return;
  
      const wrapper = document.createElement('label');
      wrapper.className = 'switch';
  
      const input = document.createElement('input');
      input.type = 'checkbox';
  
      const slider = document.createElement('span');
      slider.className = 'slider-square';
      wrapper.appendChild(input);
      wrapper.appendChild(slider);
      container.appendChild(wrapper);
  
      // Publish to CrComLib when toggled
      input.addEventListener('change', () => {
        CrComLib.publishEvent('b', digitalJoin, true);
        setTimeout(() => {
          CrComLib.publishEvent('b', digitalJoin, false);
        }, 100);
      });
  
      // Subscribe to feedback
      CrComLib.subscribeState('b', feedbackJoin, (val) => {
        input.checked = val;
      });
    };
  })();
  