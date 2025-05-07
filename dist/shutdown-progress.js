
(function () {
    window.createShutdownProgress = function (container, analogJoin, textJoin) {
      if (!window.CrComLib || !container) return;
  
      const wrapper = document.createElement('div');
      wrapper.className = 'tsw-shutdown-wrapper';
  
      wrapper.innerHTML = `
        <div class="tsw-shutdown-center">
          <div class="tsw-shutdown-box">
            <div class="tsw-shutdown-head">
              <div class="tsw-shutdown-left">
                <span class="tsw-shutdown-title">System Shutdown in Progress</span>
              </div>
            </div>
  
            <div class="tsw-shutdown-details">
              <div class="tsw-shutdown-percentage">
                <span class="tsw-shutdown-value">0%</span> Complete
              </div>
            </div>
  
            <div class="tsw-shutdown-progress">
              <div class="tsw-shutdown-fill"></div>
            </div>
  
            <div class="tsw-shutdown-note">Estimated 0 Seconds Remaining...</div>
          </div>
        </div>
      `;
  
      const valueSpan = wrapper.querySelector('.tsw-shutdown-value');
      const fill = wrapper.querySelector('.tsw-shutdown-fill');
      const note = wrapper.querySelector('.tsw-shutdown-note');
  
      CrComLib.subscribeState('n', analogJoin, (val) => {
        const percent = Math.max(0, Math.min(100, Math.round(val)));
        valueSpan.textContent = `${percent}%`;
        fill.style.width = `${percent}%`;
      });
  
      CrComLib.subscribeState('s', textJoin, (val) => {
        note.textContent = val || 'Estimated 0 Seconds Remaining...';
      });
  
      container.appendChild(wrapper);
    };
  })();
  