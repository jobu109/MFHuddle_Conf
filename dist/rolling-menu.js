(function () {
    window.createRollingMenu = function (container, config) {
      if (!window.CrComLib || !container) return;
  
      const {
        analogJoin = '1',
        feedbackJoin = analogJoin,
        itemCountJoin = '2',
        baseTextJoin = '10'
      } = config;
  
      container.classList.add('rolling-menu-container');
      container.innerHTML = `
        <div class="center">
          <div class="menu">
            <div class="items"></div>
          </div>
        </div>
      `;
  
      const menu = container.querySelector('.menu');
      const itemsContainer = container.querySelector('.items');
  
      let items = [];
      let itemEls = [];
      let angle = 0;
      const threshold = 80;
      let accumulatedDeltaY = 0;
  
      function findOpacity(angle) {
        let newAngle;
        if (angle >= 0 && angle <= 90) newAngle = angle;
        else if (angle > 90 && angle <= 180) newAngle = 180 - angle;
        else if (angle > 180 && angle <= 270) newAngle = angle - 180;
        else newAngle = 360 - angle;
        return 1 - (newAngle % 90) / 90;
      }
  
      function rotateItems() {
        const increment = 360 / itemEls.length;
        let iter = angle;
  
        itemEls.forEach((item) => {
          item.style.transform = `rotateX(${iter}deg) translateZ(120px)`;
          const opacity = findOpacity(iter % 360);
          item.style.opacity = opacity;
          item.className = 'item' + (opacity === 1 ? ' active' : '');
          iter += increment;
        });
      }
  
      function handleScrollDelta(deltaY) {
        accumulatedDeltaY += deltaY;
        const increment = 360 / itemEls.length;
      
        if (Math.abs(accumulatedDeltaY) >= threshold) {
          let rotation = (deltaY < 0)
            ? Math.ceil(accumulatedDeltaY / threshold) * increment
            : Math.floor(accumulatedDeltaY / threshold) * increment;
      
          // INVERT ROTATION DIRECTION
          angle -= rotation;
      
          rotateItems();
      
          const virtualIndex = Math.round((angle / increment) % itemEls.length);
          const normalizedIndex = ((virtualIndex % itemEls.length) + itemEls.length) % itemEls.length;
          CrComLib.publishEvent('n', feedbackJoin, normalizedIndex + 1);
      
          accumulatedDeltaY = 0;
        }
      }
      
  
      function updateItemCount(count) {
        const parsedCount = parseInt(count);
        const safeCount = !isNaN(parsedCount) && parsedCount > 0 ? parsedCount : 10;
        items = new Array(safeCount).fill('').map((_, i) => `Item ${i + 1}`);
        itemsContainer.innerHTML = '';
        itemEls = [];
  
        items.forEach((text, i) => {
          const el = document.createElement('a');
          el.classList.add('item');
          el.href = '#';
          el.textContent = text;
          itemsContainer.appendChild(el);
          itemEls.push(el);
        });
  
        setTimeout(() => rotateItems(), 50);
      }
  
      function subscribeLabels() {
        for (let i = 0; i < 20; i++) {
          const join = parseInt(baseTextJoin) + i;
          CrComLib.subscribeState('s', join.toString(), (val) => {
            if (typeof val !== 'string' || val.trim() === '') return;
            if (i < items.length) {
              items[i] = val;
              if (itemEls[i]) itemEls[i].textContent = val;
            }
          });
        }
      }
  
      menu.addEventListener('wheel', (e) => {
        e.preventDefault();
        handleScrollDelta(e.deltaY);
      });
  
      let startY = 0;
      menu.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      });
  
      menu.addEventListener('touchmove', (e) => {
        const deltaY = startY - e.touches[0].clientY;
        handleScrollDelta(deltaY);
        startY = e.touches[0].clientY;
      });
  
      CrComLib.subscribeState('n', analogJoin, (val) => {
        const idx = Math.max(0, Math.min(items.length - 1, val - 1));
        const increment = 360 / (itemEls.length || 1);
        angle = idx * increment;
        rotateItems();
      });
  
      CrComLib.subscribeState('n', itemCountJoin, (val) => {
        updateItemCount(val);
      });
  
      updateItemCount(10);
      subscribeLabels();
    };
  })();
  