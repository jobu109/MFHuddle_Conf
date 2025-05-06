
// TSW-compatible reusable toggle square loader
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('[data-toggle-square]');
  toggles.forEach(el => {
    const toggle = el.querySelector('input[type="checkbox"]');
    const digitalJoin = el.getAttribute('data-digital-join') || '1';
    const feedbackJoin = el.getAttribute('data-feedback-join') || digitalJoin;

    toggle.addEventListener('change', () => {
      CrComLib.publishEvent('b', digitalJoin, toggle.checked);
    });

    CrComLib.subscribeState('b', feedbackJoin, (val) => {
      toggle.checked = val;
    });
  });
});

function createToggleSquare(containerId, digitalJoin, feedbackJoin) {
  const tpl = document.getElementById('template-toggle-square');
  const clone = tpl.content.cloneNode(true);
  const wrapper = clone.querySelector('[data-toggle-square]');
  wrapper.setAttribute('data-digital-join', digitalJoin);
  wrapper.setAttribute('data-feedback-join', feedbackJoin);
  document.getElementById(containerId).appendChild(clone);
}


window.createToggleSquare = createToggleSquare;
