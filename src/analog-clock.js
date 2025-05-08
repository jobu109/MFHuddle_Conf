(function () {
    window.createAnalogClock = function (container, timeJoin, cityJoin) {
      if (!container || !window.CrComLib) return;
  
      container.classList.add('tsw-clock-container');
      container.innerHTML = `
        <div class="tsw-clock-city" id="city">Default City</div>
        <div class="tsw-clock-face">
          <div class="tsw-clock-glow"></div>
          <div class="tsw-clock-points"></div>
          <div class="tsw-clock-minutes"></div>
          <div class="tsw-clock-seconds"></div>
          <div class="tsw-clock-hours"></div>
          <div class="tsw-clock-pivot"></div>
        </div>
      `;
  
      const cityLabel = container.querySelector('#city');
      const secondsHand = container.querySelector('.tsw-clock-seconds');
      const minutesHand = container.querySelector('.tsw-clock-minutes');
      const hoursHand = container.querySelector('.tsw-clock-hours');
      const points = container.querySelector('.tsw-clock-points');
  
      // Draw markers
      let j = 12;
      for (let i = 0; i < 360; i += 6) {
        const point = document.createElement('span');
        point.className = 'tsw-clock-point';
        if ((i / 6) % 5 === 0) {
          point.classList.add('big');
          const text = document.createElement('span');
          text.className = 'text';
          text.textContent = j;
          text.style.transform = `rotate(${-i}deg) translateY(2px)`;
          j = (j === 12) ? 1 : j + 1;
          point.appendChild(text);
        }
        point.style.transform = `rotate(${i}deg) translateY(-150px)`;
        points.appendChild(point);
      }
  
      // Bind Crestron joins
      CrComLib.subscribeState('s', timeJoin, (val) => {
        const parts = val.trim().split(':');
        if (parts.length !== 3) return;
        const [h, m, s] = parts.map(Number);
        const hourDeg = ((h % 12) + m / 60) * 30;
        const minuteDeg = m * 6;
        const secondDeg = s * 6;
  
        secondsHand.style.transition = s === 0 ? "none" : "0.25s";
        minutesHand.style.transition = m === 0 ? "none" : "0.25s";
        hoursHand.style.transition = h === 0 ? "none" : "0.25s";
  
        secondsHand.style.transform = `rotate(${secondDeg - 180}deg)`;
        minutesHand.style.transform = `rotate(${minuteDeg - 180}deg)`;
        hoursHand.style.transform = `rotate(${hourDeg - 180}deg)`;
      });
  
      CrComLib.subscribeState('s', cityJoin, (val) => {
        cityLabel.textContent = val || 'City';
      });
    };
  })();
  