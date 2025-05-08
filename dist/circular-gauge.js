
(function () {
  window.createCircularGauge = function(container, controlJoin, feedbackJoin, labelJoin = null) {
    if (!container || !window.CrComLib) return;

    container.classList.add("circular-wrapper");
    container.innerHTML = `
      <div class="circular-slider">
        <div class="circular-gauge-container">
          <div class="circular-knob-hitbox">
            <div class="circular-knob">
              <div class="circular-rotator">
                <div class="circular-text">0%</div>
              </div>
            </div>
          </div>
          <svg class="circular-progress-bar" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%;">
            <circle cx="150" cy="150" r="140"></circle>
            <circle id="circular-circle2" cx="150" cy="150" r="140"></circle>
            <line id="circular-gauge-pointer" x1="150" y1="150" x2="150" y2="20"
              stroke="white" stroke-width="4" stroke-linecap="round"
              transform="rotate(-135, 150, 150)" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="red" />
                <stop offset="65%" stop-color="orange" />
                <stop offset="100%" stop-color="limegreen" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="circular-label">Label</div>
      </div>
    `;

    const knob = container.querySelector(".circular-knob");
    const pointer = container.querySelector("#circular-gauge-pointer");
    const circle = container.querySelector("#circular-circle2");
    const text = container.querySelector(".circular-text");
    const label = container.querySelector(".circular-label");
    const hitbox = container.querySelector(".circular-knob-hitbox");

    let isDragging = false;

    hitbox.addEventListener("mousedown", () => isDragging = true);
    document.addEventListener("mouseup", () => isDragging = false);
    
document.addEventListener("touchmove", (e) => {
if (!isDragging) return;
const touch = e.touches[0];
handleDrag(touch);
});

hitbox.addEventListener("touchstart", () => isDragging = true);
document.addEventListener("touchend", () => isDragging = false);

function handleDrag(e) {
const rect = knob.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
const dx = e.clientX - centerX;
const dy = e.clientY - centerY;
const angleRad = Math.atan2(dy, dx);
let angleDeg = (angleRad * 180) / Math.PI;
let rotationAngle = (angleDeg - 135 + 360) % 360;

if (rotationAngle <= 270) {
  const percent = Math.round((rotationAngle / 270) * 100);
  updateGauge(percent);
  const crestronVal = Math.round((percent / 100) * 65535);
  CrComLib.publishEvent("n", controlJoin, crestronVal);
}
}


document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const rect = knob.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angleRad = Math.atan2(dy, dx);
      let angleDeg = (angleRad * 180) / Math.PI;
      let rotationAngle = (angleDeg - 135 + 360) % 360;

      if (rotationAngle <= 270) {
        const percent = Math.round((rotationAngle / 270) * 100);
        updateGauge(percent);
        const crestronVal = Math.round((percent / 100) * 65535);
        CrComLib.publishEvent("n", controlJoin, crestronVal);
      }
    });

    function updateGauge(percent) {
      const angle = (percent / 100) * 270 - 135;
      pointer.setAttribute("transform", `rotate(${angle}, 150, 150)`);
      text.textContent = `${percent}%`;
      const fill = 660 * (percent / 100);
      circle.style.strokeDashoffset = 880 - fill;
    }

    CrComLib.subscribeState("n", feedbackJoin, (val) => {
      const percent = Math.round((val / 65535) * 100);
      updateGauge(percent);
    });

    if (labelJoin) {
      CrComLib.subscribeState("s", labelJoin, (val) => {
        if (val !== null && val !== undefined && val !== "") {
          label.textContent = val;
        }
      });
    }
  };
})();
