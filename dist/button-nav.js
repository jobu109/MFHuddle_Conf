
(function () {
  window.createNavButton = function (container, digitalJoin, feedbackJoin, labelJoin, iconClass, pageIdOverride = null) {
    if (!window.CrComLib || !container) return;

    const button = document.createElement('button');
    const pageId = pageIdOverride || container.id.replace('nav-', '');
    const defaultLabel = pageId.charAt(0).toUpperCase() + pageId.slice(1);

    button.classList.add('nav-btn');
    button.dataset.page = pageId;
    button.dataset.fbJoin = feedbackJoin;

    const icon = document.createElement('i');
    icon.className = `fas ${iconClass}`;

    const label = document.createElement('span');
    label.textContent = defaultLabel;

    button.appendChild(icon);
    button.appendChild(label);
    container.appendChild(button);

    // Digital press behavior
    button.addEventListener('mousedown', () => CrComLib.publishEvent('b', digitalJoin, true));
    button.addEventListener('mouseup', () => CrComLib.publishEvent('b', digitalJoin, false));
    button.addEventListener('mouseleave', () => CrComLib.publishEvent('b', digitalJoin, false));
    button.addEventListener('touchstart', () => CrComLib.publishEvent('b', digitalJoin, true));
    button.addEventListener('touchend', () => CrComLib.publishEvent('b', digitalJoin, false));

    // Click-driven navigation
    button.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      openSubpage(pageId);
    });

    // Feedback-driven navigation
    CrComLib.subscribeState('b', feedbackJoin, (val) => {
      if (val) {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        openSubpage(pageId);
      }
    });

    // Label text from Crestron
    CrComLib.subscribeState('s', labelJoin, (val) => {
      label.textContent = val || defaultLabel;
    });
  };
})();
