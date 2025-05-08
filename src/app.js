import { getWebXPanel, runsInContainerApp } from "@crestron/ch5-webxpanel";
import { CrComLib } from '@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib';

const { WebXPanel, isActive, WebXPanelEvents, getVersion, getBuildDate } = getWebXPanel(!runsInContainerApp());

window.CrComLib = CrComLib;
window.bridgeReceiveIntegerFromNative = CrComLib.bridgeReceiveIntegerFromNative;
window.bridgeReceiveBooleanFromNative = CrComLib.bridgeReceiveBooleanFromNative;
window.bridgeReceiveStringFromNative = CrComLib.bridgeReceiveStringFromNative;
window.bridgeReceiveObjectFromNative = CrComLib.bridgeReceiveObjectFromNative;

const configuration = {
  host: "192.168.1.197",
  ipId: "0x04",
  port: 49200,
  roomId: "2",
  tokenSource: "",
  tokenUrl: "",
  authToken: ""
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
  createOvalButton(document.getElementById('vol-dwn'), '121', '131', '121', 'fa-volume-down');  //dig press, dig FB, Label, fa-icon
  createOvalButton(document.getElementById('vol-up'), '122', '132', '122', 'fa-volume-up');
  createRectButton(document.getElementById('source-btn-1'), '133', '143', '133');  //press, fb, label
  createRectButton(document.getElementById('source-btn-2'), '134', '144', '134');  //press, fb, label
  createRectButton(document.getElementById('source-btn-3'), '135', '145', '135');  //press, fb, label
  createRectButton(document.getElementById('source-btn-4'), '136', '146', '136');  //press, fb, label
  createRectButton(document.getElementById('source-btn-5'), '137', '147', '137');  //press, fb, label
  createRectButton(document.getElementById('source-btn-6'), '138', '148', '138');  //press, fb, label
  createNavButton(document.getElementById('nav-home'),'1', '11', '41', 'fa-home');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-video'),'2', '12', '42', 'fa-tv');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-displays'),'3', '13', '43', 'fa-display');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-mics'),'4', '14', '44', 'fa-microphone');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-camera'),'5', '15', '45', 'fa-camera');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-call'),'6', '16', '46', 'fa-phone');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-settings'),'7', '17', '47', 'fa-cog');  //dig press, dig FB, Label, fa-icon
  createMuteButton(document.getElementById('vol-mute'), '123', '133', '123', 'fa-volume-mute');
  createToggleSquare(document.getElementById('quick-toggle-1'), '21', '31');  //digital press, FB
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
  createToggleSwitch(document.getElementById('tv-toggle-1'), '101', '111');
  createToggleSwitch(document.getElementById('tv-toggle-2'), '102', '112');
  createToggleSwitch(document.getElementById('tv-toggle-3'), '103', '113');
  createToggleSwitch(document.getElementById('tv-toggle-4'), '104', '114');
  createToggleSwitch(document.getElementById('tv-toggle-5'), '105', '115');
  createToggleSwitch(document.getElementById('tv-toggle-6'), '106', '166');
  createVolumeSlider(document.getElementById('volumeslider1'), '13', '12');
  createCircularGauge(document.getElementById('gauge-mic-1'), '51', '61', '11');//Analog Set, Analogfb, text join
  createCircularGauge(document.getElementById('gauge-mic-2'), '52', '62', '12');
  createCircularGauge(document.getElementById('gauge-mic-3'), '53', '63', '13');
  createCircularGauge(document.getElementById('gauge-mic-4'), '54', '64', '14');
  createShutdownProgress(document.getElementById('shutdown-progress'), '5', '6');//analog join, text join
  createAnalogClock(document.getElementById("analog-clock"), '51' , '52');
  createFlipCards(document.getElementById('flip-card'), {
    selectedBaseJoin: '151',  // Digital input base join for flip (auto-generated +1 for each "card" ...)
    pressedBaseJoin: '141',     // Digital output base join for press
    cards: [
      { image: 'assets/img/Circle_Glass.png', title: 'Display 1', description: 'Display 1 has been selected' },
      { image: 'assets/img/Circle_Glass.png', title: 'Display 2', description: 'Display 2 has been selected' },
      { image: 'assets/img/Circle_Glass.png', title: 'Display 3', description: 'Display 3 has been selected' },
    ]
  });
  createGlassCarousel(document.getElementById('glass-carousel-1'), {
    join: 31 ,// Analog join from Crestron
    feedbackJoin: 41
  });
  createGlassCarousel(document.getElementById('glass-carousel-2'), {
    join: 32, // Analog join from Crestron
    feedbackJoin: 42
  });
    
  createCircularPreloader(document.getElementById('circular-preloader'), '21','Please Wait.......');  
  createRollingMenu(document.getElementById('rolling-menu-1'), {
    analogJoin: '22',         // join that controls selected item
    feedbackJoin: '23',       // join to send back selected index
    itemCountJoin: '21',      // join for item count
    baseTextJoin: '31'    // starting join for item labels (e.g. 510, 511, ...auto increments)
  });
  
  createRadioToggle(document.getElementById('radio-toggle1'), {
    groupId: 'grp1',
    buttons: [
      { label: 'Button 1', digitalJoin: '81', feedbackJoin: '91', textJoin: '81' },
      { label: 'Button 2', digitalJoin: '82', feedbackJoin: '92', textJoin: '82' },
      { label: 'Button 3', digitalJoin: '83', feedbackJoin: '93', textJoin: '83' },
    ]
  });
  
  createRadioToggle(document.getElementById('radio-toggle1'), {
    groupId: 'grp1',
    buttons: [
      { label: 'Button 1', digitalJoin: '84', feedbackJoin: '94', textJoin: '84' },
      { label: 'Button 2', digitalJoin: '85', feedbackJoin: '95', textJoin: '85' },
      { label: 'Button 3', digitalJoin: '86', feedbackJoin: '96', textJoin: '86' },
      { label: 'Button 4', digitalJoin: '87', feedbackJoin: '97', textJoin: '87' },
    ]
  });
  

});

function initializeCrComLibEvents() {
  CrComLib.subscribeState('s', '1', (value) => {
    const elem = document.getElementById('room-name');
    if (elem) elem.innerHTML = value;
  });

  CrComLib.subscribeState('s', '2', (value) => {
    const elem = document.getElementById("time-date");
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

window.openSubpage = function(id) {
  const container = document.getElementById('subpage-container');
  const newSubpage = document.getElementById(`subpage-${id}`);
  const newContent = document.getElementById(`${id}-content`);

  // Start expanding subpage container
  container.style.width = getComputedStyle(document.documentElement).getPropertyValue('--subpage-width').trim();
  //close subpages if home is selected. 
  if (id === 'home') {
    closeSubpages(); // collapse subpage container
    return;
  }
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

window.closeSubpages = function() {
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

    const homePage = document.getElementById('home-content');
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




