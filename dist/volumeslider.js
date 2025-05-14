(function () {
  window.createVolumeSlider = function (container, feedbackJoin, outputJoin) {
    if (!window.CrComLib || !container) return;

    // Create UI elements
    const bar = document.createElement('div');
    bar.className = 'volume-bar';

    const fill = document.createElement('div');
    fill.className = 'volume-fill';

    const knob = document.createElement('div');
    knob.className = 'volume-knob';

    const label = document.createElement('span');
    label.className = 'volume-percent';
    label.textContent = '0%';

    bar.appendChild(fill);
    bar.appendChild(knob);
    bar.appendChild(label);
    container.appendChild(bar);

    let currentValue = 0;

    function updateUI(val) {
      currentValue = Math.min(Math.max(val, 0), 65535);
      const percent = Math.round((currentValue / 65535) * 100);

      fill.style.width = `${100 - percent}%`;
      knob.style.left = `calc(${percent}% - 16px)`;
      label.textContent = `${percent}%`;
      bar.style.background = generateGradient(percent);

      const debugDiv = document.getElementById('debug-log');
      if (debugDiv) {

        debugDiv.innerText ='[updateUI called with:", val]';
      }
    }

    function generateGradient(percent) {
      if (percent <= 50) {
        return `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percent}%, #444 ${percent}%, #444 100%)`;
      } else if (percent <= 75) {
        return `linear-gradient(to right, #4CAF50 0%, #4CAF50 45%, #FFEB3B 55%, #FFEB3B ${percent}%, #444 ${percent}%, #444 100%)`;
      } else {
        return `linear-gradient(to right, #4CAF50 0%, #4CAF50 45%, #FFEB3B 55%, #FFEB3B 70%, #F44336 80%, #F44336 ${percent}%, #444 ${percent}%, #444 100%)`;
      }
    }

    function handleUserInput(clientX) {
      const rect = bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = x / rect.width;
      const value = Math.round(percent * 65535);

      //updateUI(value);
      CrComLib.publishEvent('n', outputJoin, value);

      const debugDiv = document.getElementById('debug-log');
      if (debugDiv) {
        debugDiv.innerText += `\n[FEEDBACK]
        Join: ${feedbackJoin}
        Value: ${val}
        Percent: ${Math.round((val / 65535) * 100)}%`;
      }      
    }

    let isDragging = false;

    const startDrag = (e) => {
      isDragging = true;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      if (clientX !== undefined) handleUserInput(clientX);
    };

    const moveDrag = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      if (clientX !== undefined) handleUserInput(clientX);
    };

    const endDrag = () => {
      isDragging = false;
    };

    // Event listeners
    bar.addEventListener('mousedown', startDrag);
    knob.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('mouseup', endDrag);

    bar.addEventListener('touchstart', startDrag);
    knob.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', moveDrag);
    document.addEventListener('touchend', endDrag);

    // Subscribe to Crestron analog feedback
    CrComLib.subscribeState('n', feedbackJoin, (val) => {
      updateUI(val);
    });
    
  };
})();