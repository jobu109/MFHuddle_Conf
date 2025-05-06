import { getWebXPanel, runsInContainerApp } from "@crestron/ch5-webxpanel";
import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';
import moment from 'moment';
import './components/circular-gauge.js';
import './components/3d-button.js';
import './components/volume-slider.js';
import './components/analog-clock.js';
import './components/rolling-menu.js';
import './components/radio-toggle.js';
import './components/circular-preloader.js';
import './components/shutdown-progress.js';
import './components/glass-carousel.js';
const { WebXPanel, isActive, WebXPanelConfigParams, WebXPanelEvents, getVersion, getBuildDate } = getWebXPanel(!runsInContainerApp());

window.CrComLib = CrComLib;

const configuration = {
    host: "192.168.1.197",
    ipId: "0x05",
    port: 49200,
    roomId: "2",
    tokenSource: "",
    tokenUrl: "",
    authToken: "",
    contractName: ""
}

if (isActive) {
    console.log(`WebXPanel version: ${getVersion()}`);
    console.log(`WebXPanel build date: ${getBuildDate()}`);

    WebXPanel.initialize(configuration);

    window.addEventListener(WebXPanelEvents.CONNECT_CIP, ({ detail }) => {
        const { url, ipId, roomId } = detail;
        console.log(`Connected to ${url}, 0x${ ipId.toString(16)}, ${roomId}`);
    });
    window.addEventListener(WebXPanelEvents.DISCONNECT_CIP, ({ detail }) => {
        const { reason } = detail;
        console.log(`Disconnected from CIP. Reason: ${reason}`);
    });
}
window.addEventListener("DOMContentLoaded", () => {
  initializeCrComLibEvents();
  updateLayoutVariables();
  createToggleSquare(document.getElementById('quick-toggle-1'), '21', '31');
  createToggleSquare(document.getElementById('quick-toggle-2'), '22', '32');
  createToggleSquare(document.getElementById('quick-toggle-3'), '23', '33');
  createToggleRollingReverse(document.getElementById('mic-toggle-1'), '41', '51');
  createToggleRollingReverse(document.getElementById('mic-toggle-2'), '42', '52');
  createToggleRollingReverse(document.getElementById('mic-toggle-3'), '43', '53');
  createToggleRollingReverse(document.getElementById('mic-toggle-4'), '44', '54');
  createToggleRollingReverse(document.getElementById('mic-toggle-5'), '45', '55');
  createToggleRollingReverse(document.getElementById('mic-toggle-6'), '46', '56');
  createToggleRolling(document.getElementById('mute-toggle-1'), '61', '71');
  createToggleRolling(document.getElementById('mute-toggle-2'), '62', '72');
  createToggleRolling(document.getElementById('mute-toggle-3'), '63', '73');
  createToggleRolling(document.getElementById('mute-toggle-4'), '64', '74');
  createToggleRolling(document.getElementById('mute-toggle-5'), '65', '75');
  createToggleRolling(document.getElementById('mute-toggle-6'), '66', '75');
  createToggleSwitch(document.getElementById('tv-toggle-1'), '81', '91');
  createToggleSwitch(document.getElementById('tv-toggle-2'), '82', '92');
  createToggleSwitch(document.getElementById('tv-toggle-3'), '83', '92');
  createToggleSwitch(document.getElementById('tv-toggle-4'), '84', '94');
  createToggleSwitch(document.getElementById('tv-toggle-5'), '85', '95');
  createToggleSwitch(document.getElementById('tv-toggle-6'), '86', '96');
});

function initializeCrComLibEvents() {
  CrComLib.subscribeState('s', '1', (value) => {
    const elem = document.getElementById('room-name');
    if (elem) elem.innerHTML = value;
  });

  CrComLib.subscribeState('s', '2', (value) => {
    const elem = document.getElementById('help-number');
    if (elem) elem.innerHTML = value;
  });
}

function updateLayoutVariables() {
  const topBar = document.getElementById('top-bar');
  const bottomBar = document.getElementById('bottom-bar');

  const topHeight = topBar?.offsetHeight || 0;
  const bottomHeight = bottomBar?.offsetHeight || 0;

  document.documentElement.style.setProperty('--top-bar-height', `${topHeight}px`);
  document.documentElement.style.setProperty('--bottom-bar-height', `${bottomHeight}px`);
}

const subpages = ['video', 'mics', 'camera', 'call', 'settings'];

let currentActiveSubpage = null;

function openSubpage(id) {
  const container = document.getElementById('subpage-container');
  const newSubpage = document.getElementById(`subpage-${id}`);
  const newContent = document.getElementById(`${id}-content`);

  // Start expanding subpage container
  container.style.width = getComputedStyle(document.documentElement).getPropertyValue('--subpage-width').trim();

  // Hide old subpage and show new one
  if (currentActiveSubpage && currentActiveSubpage !== newSubpage) {
    currentActiveSubpage.classList.remove('active');
    setTimeout(() => {
      container.querySelectorAll('.subpage').forEach(page => {
        page.style.display = 'none';
      });
      if (newSubpage) {
        newSubpage.style.display = 'inline-block';
        setTimeout(() => {
          newSubpage.classList.add('active');
        }, 10);
      }
      currentActiveSubpage = newSubpage;
    }, 600);
  } else {
    if (newSubpage) {
      newSubpage.style.display = 'inline-block';
      setTimeout(() => {
        newSubpage.classList.add('active');
      }, 10);
    }
    currentActiveSubpage = newSubpage;
  }

  // Close all current content pages first
  closeContentPages();

  // After transition ends, show the new content page
  setTimeout(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.classList.remove('active');
    }

    if (newContent) {
      newContent.classList.remove('closing');
      newContent.classList.add('active');
    }
  }, 600);
}


function closeContentPages(excludePage = null) {
  document.querySelectorAll('.content-page').forEach(page => {
    if (page !== excludePage) {
      page.classList.remove('active');
      page.classList.add('closing');
      setTimeout(() => {
        page.classList.remove('closing');
      }, 600); // match transition
    }
  });
}

function closeSubpages() {
  const container = document.getElementById('subpage-container');

  if (currentActiveSubpage) {
    currentActiveSubpage.classList.remove('active');
    currentActiveSubpage = null;
  }

  // Start content slide-out
  closeContentPages();

  // After transition ends, collapse subpage and show main content
  setTimeout(() => {
    container.querySelectorAll('.subpage').forEach(page => {
      page.style.display = 'none';
    });
    container.style.width = '0';

    const homePage = document.getElementById('main-content');
    if (homePage) {
      homePage.classList.add('active');
    }
  }, 600);
}

// Hook up nav buttons:
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    openSubpage(btn.dataset.page);
  });
});

// Home button
const homeBtn = document.querySelector('.nav-btn[data-page="home"]');
if (homeBtn) {
  homeBtn.addEventListener('click', closeSubpages);
}

// Mute Button
const muteBtn = document.getElementById('mute-btn');
if (muteBtn) {
  muteBtn.addEventListener('click', () => {
    muteBtn.classList.toggle('active');
  });
}

// Btns for volume up and down
const slider = document.querySelector('volume-slider'); // NEW: use custom element
const downBtn = document.getElementById('volume-down');
const upBtn = document.getElementById('volume-up');
let holdInterval;

// Convert gradient-bar value (0–65535) to percentage
function getCurrentPercent() {
  return slider ? Math.round((slider.value / 65535) * 100) : 0;
}

// Convert percent (0–100) to 0–65535 value and update slider
function updateVolume(newPercent) {
  if (!slider) return;
  const clamped = Math.max(0, Math.min(newPercent, 100));
  const value = Math.round((clamped / 100) * 65535);
  slider.value = value; // Triggers UI update inside the component
}

// Hold behavior (volume up/down)
function startHolding(change) {
  if (holdInterval) clearInterval(holdInterval);
  holdInterval = setInterval(() => {
    const currentPercent = getCurrentPercent();
    updateVolume(currentPercent + change);
  }, 200); // Repeat every 200ms
}

function stopHolding() {
  clearInterval(holdInterval);
}

// Volume Down
if (downBtn) {
  downBtn.addEventListener('click', () => {
    updateVolume(getCurrentPercent() - 3);
  });
  downBtn.addEventListener('mousedown', () => startHolding(-3));
  downBtn.addEventListener('mouseup', stopHolding);
  downBtn.addEventListener('mouseleave', stopHolding);
  downBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startHolding(-3); });
  downBtn.addEventListener('touchend', stopHolding);
}

// Volume Up
if (upBtn) {
  upBtn.addEventListener('click', () => {
    updateVolume(getCurrentPercent() + 3);
  });
  upBtn.addEventListener('mousedown', () => startHolding(3));
  upBtn.addEventListener('mouseup', stopHolding);
  upBtn.addEventListener('mouseleave', stopHolding);
  upBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startHolding(3); });
  upBtn.addEventListener('touchend', stopHolding);
}



