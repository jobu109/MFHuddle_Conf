(function () {
  window.createShutdownProgress = function (container, analogJoin, textJoin) {
    if (!window.CrComLib || !container) return;

    // 1) Build the DOM structure
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
    container.appendChild(wrapper);

    // 2) Grab references to the elements we'll update
    const valueSpan = wrapper.querySelector('.tsw-shutdown-value');
    const fill      = wrapper.querySelector('.tsw-shutdown-fill');
    const note      = wrapper.querySelector('.tsw-shutdown-note');

    // 3) Store the total shutdown duration (in seconds) from Crestron
    let totalSecs = null;
    CrComLib.subscribeState('s', textJoin, (val) => {
      totalSecs = Math.max(0, Math.round(Number(val)));
      note.textContent = `Estimated ${totalSecs} Seconds Remaining...`;
    });

    // 4) Update the progress bar and recalc remaining seconds on each percent update
    CrComLib.subscribeState('n', analogJoin, (val) => {
      // val is 0–65535, so divide by 655.35 to get 0–100
      const percentRaw = val / 655.35;
      const percent    = Math.max(0, Math.min(100, Math.round(percentRaw)));

      valueSpan.textContent = `${percent}%`;
      fill.style.width       = `${percent}%`;

      if (totalSecs !== null) {
        const remaining = Math.round(totalSecs * (100 - percent) / 100);
        note.textContent = `Estimated ${remaining} Seconds Remaining...`;
      }

      if (percent >= 100) {
        note.textContent = 'Shutdown Complete';
      }
    });

  };
})();
