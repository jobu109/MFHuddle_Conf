(function () {
    window.createCircularPreloader = function(container, textJoin, defaultText = 'Please Wait........') {
      if (!container || !window.CrComLib) return;
  
      container.classList.add("circular-preloader-container");
  
      const center = document.createElement('div');
      center.className = 'center';
      container.appendChild(center);
  
      const circles = [];
      for (let i = 0; i < 6; i++) {
        const circle = document.createElement('div');
        circle.className = 'circle';
        circle.style.setProperty('--delay', `${i * 0.1}s`);
        center.appendChild(circle);
        circles.push(circle);
      }
  
      function render(text) {
        const angleStep = 360 / text.length;
        let y = 0;
  
        circles.forEach(circle => {
          circle.innerHTML = '';
          let j = 0;
          for (let i = 0; i < 360; i += angleStep) {
            const letter = document.createElement('span');
            letter.className = 'letter';
            letter.innerText = text[j] || '';
            const angleOffset = -175; // shift 175 degrees counter-clockwise
            letter.style.transform = `rotate(${i + angleOffset}deg) translateY(${-150 + y}px)`;

            circle.appendChild(letter);
            j++;
          }
          circle.style.zIndex = 1000 - y;
          y += 10;
        });
      }
  
      render(defaultText);
  
      if (textJoin) {
        CrComLib.subscribeState('s', textJoin, (val) => {
          render(val || defaultText);
        });
      }
    }
  })();