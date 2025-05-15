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
  //host: "10.14.1.144",
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
  createOvalButton(document.getElementById('vol-dwn'), 'volume.dwn_btn', 'volume.dwn_fb', '', 'fa-volume-down');  //dig press, dig FB, Label, fa-icon
  createOvalButton(document.getElementById('vol-up'), 'volume.up_btn', 'volume.up_fb', '', 'fa-volume-up');
  createMuteButton(document.getElementById('vol-mute'), 'volume.mute_btn', 'volume.mute_fb', '', 'fa-volume-mute');
  createOvalButton(document.getElementById('pwr-btn'), 'power.on_btn', 'power.on_fb', '', 'fa-power-off');
  createRectButton(document.getElementById('source-btn-1'), 'source[0].btn', 'source[0].fb', 'source[0].label');  //press, fb, label
  createRectButton(document.getElementById('source-btn-2'), 'source[1].btn', 'source[1].fb', 'source[1].label');  //press, fb, label
  createRectButton(document.getElementById('source-btn-3'), 'source[2].btn', 'source[2].fb', 'source[2].label');  //press, fb, label
  createRectButton(document.getElementById('source-btn-4'), 'source[3].btn', 'source[3].fb', 'source[3].label');  //press, fb, label
  createRectButton(document.getElementById('source-btn-5'), 'source[4].btn', 'source[4].fb', 'source[4].label');  //press, fb, label
  createRectButton(document.getElementById('source-btn-6'), 'source[5].btn', 'source[5].fb', 'source[5].label');  //press, fb, label
  createRectButton(document.getElementById('call-btn-1'), 'call[0].btn', 'call[0].fb', 'call[0].label');  //press, fb, label
  createRectButton(document.getElementById('call-btn-2'), 'call[1].btn', 'call[1].fb', 'call[1].label');  //press, fb, label
  createRectButton(document.getElementById('call-btn-3'), 'call[2].btn', 'call[2].fb', 'call[2].label');  //press, fb, label
  createRectButton(document.getElementById('call-btn-4'), 'call[3].btn', 'call[3].fb', 'call[3].label');  //press, fb, label
  createRectButton(document.getElementById('call-btn-5'), 'call[4].btn', 'call[4].fb', 'call[4].label');  //press, fb, label
  createRectButton(document.getElementById('call-btn-6'), 'call[5].btn', 'call[5].fb', 'call[5].label');  //press, fb, label
  createNavButton(document.getElementById('nav-home'),'nav[0].btn', 'nav[0].fb', 'nav[0].label','fa-home');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-video'),'nav[1].btn', 'nav[1].fb', 'nav[1].label', 'fa-tv');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-displays'),'nav[2].btn', 'nav[2].fb', 'nav[2].label', 'fa-display');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-mics'),'nav[3].btn', 'nav[3].fb', 'nav[3].label', 'fa-microphone');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-camera'),'nav[4].btn', 'nav[4].fb', 'nav[4].label', 'fa-camera');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-call'),'nav[5].btn', 'nav[5].fb', 'nav[5].label', 'fa-phone');  //dig press, dig FB, Label, fa-icon
  createNavButton(document.getElementById('nav-settings'),'nav[6].btn', 'nav[6].fb', 'nav[6].label', 'fa-cog');  //dig press, dig FB, Label, fa-icon
  createToggleSquare(document.getElementById('quick-toggle-1'), 'quick[0].btn', 'quick[0].fb');  //digital press, FB
  createToggleSquare(document.getElementById('quick-toggle-2'), 'quick[1].btn', 'quick[1].fb');  //digital press, FB
  createToggleSquare(document.getElementById('quick-toggle-3'), 'quick[2].btn', 'quick[2].fb');  //digital press, FB
  createToggleRollingReverse(document.getElementById('mic-toggle-1'), 'mics[0].btn', 'mics[0].fb');
  createToggleRollingReverse(document.getElementById('mic-toggle-2'), 'mics[1].btn', 'mics[1].fb');
  createToggleRollingReverse(document.getElementById('mic-toggle-3'), 'mics[2].btn', 'mics[2].fb');
  createToggleRollingReverse(document.getElementById('mic-toggle-4'), 'mics[3].btn', 'mics[3].fb');
  createToggleRollingReverse(document.getElementById('mic-toggle-5'), 'mics[4].btn', 'mics[4].fb');
  createToggleRollingReverse(document.getElementById('mic-toggle-6'), 'mics[5].btn', 'mics[5].fb');
  createToggleRolling(document.getElementById('mute-toggle-1'), 'presets[0].btn', 'presets[0].fb');
  createToggleRolling(document.getElementById('mute-toggle-2'), 'presets[1].btn', 'presets[1].fb');
  createToggleRolling(document.getElementById('mute-toggle-3'), 'presets[2].btn', 'presets[2].fb');
  createToggleRolling(document.getElementById('mute-toggle-4'), 'presets[3].btn', 'presets[3].fb');
  createToggleRolling(document.getElementById('mute-toggle-5'), 'presets[4].btn', 'presets[4].fb');
  createToggleRolling(document.getElementById('mute-toggle-6'), 'presets[5].btn', 'presets[5].fb');
  createToggleSwitch(document.getElementById('tv-toggle-1'), 'tvs[0].on_btn', 'tvs[0].on_fb');
  createToggleSwitch(document.getElementById('tv-toggle-2'), 'tvs[1].on_btn', 'tvs[1].on_fb');
  createToggleSwitch(document.getElementById('tv-toggle-3'), 'tvs[2].on_btn', 'tvs[2].on_fb');
  createToggleSwitch(document.getElementById('tv-toggle-4'), 'tvs[3].on_btn', 'tvs[3].on_fb');
  createToggleSwitch(document.getElementById('tv-toggle-5'), 'tvs[4].on_btn', 'tvs[4].on_fb');
  createToggleSwitch(document.getElementById('tv-toggle-6'), 'tvs[5].on_btn', 'tvs[5].on_fb');
  createToggleHole(document.getElementById('toggle-hole-1'), 'tvs[6].on_btn', 'tvs[6].on_fb');
  createVolumeSlider(document.getElementById('volumeslider1'), 'volume.level_fb', 'volume.level_set');
  createCircularGauge(document.getElementById('gauge-mic-1'), 'miclevel[0].level_set', 'miclevel[0].level_fb', 'miclevel[0].label');//Analog Set, Analogfb, text join
  createCircularGauge(document.getElementById('gauge-mic-2'), 'miclevel[1].level_set', 'miclevel[1].level_fb', 'miclevel[1].label');//Analog Set, Analogfb, text join
  createCircularGauge(document.getElementById('gauge-mic-3'), 'miclevel[2].level_set', 'miclevel[2].level_fb', 'miclevel[2].label');//Analog Set, Analogfb, text join
  createCircularGauge(document.getElementById('gauge-mic-4'), 'miclevel[3].level_set', 'miclevel[3].level_fb', 'miclevel[3].label');//Analog Set, Analogfb, text join
  createShutdownProgress(document.getElementById('shutdown-progress'), 'shutdownprogress.level_fb', 'shutdownprogress.label');//analog join, text join
  createAnalogClock(document.getElementById("analog-clock"), 'clock.time' , 'clock.cityname');
  createFlipCards(document.getElementById('flip-card'), {
    selectedBaseJoin: '151',  // Digital input base join for flip (auto-generated +1 for each "card" ...)
    pressedBaseJoin: '141',     // Digital output base join for press
    cards: [
      { image: 'assets/img/Circle_Glass.png', title: 'Display 1', description: 'Display 1 has been selected' },
      { image: 'assets/img/Circle_Glass.png', title: 'Display 2', description: 'Display 2 has been selected' },
      { image: 'assets/img/Circle_Glass.png', title: 'Display 3', description: 'Display 3 has been selected' },
    ]
  });
  /* Glass Carousel */
  createGlassCarousel(document.getElementById('glass-carousel-1'), { join:'carousel.level_set', feedbackjoin:'carousel.level_fb',});

    createRectButton(document.getElementById('tv1-hdmi1'), 'tvs[0].hdmi1_btn', 'tvs[0].hdmi1_fb', 'tvs[0].hdmi1_label');
    createRectButton(document.getElementById('tv1-hdmi2'), 'tvs[0].hdmi2_btn', 'tvs[0].hdmi2_fb', 'tvs[0].hdmi2_label');

    createRectButton(document.getElementById('tv2-hdmi1'), 'tvs[1].hdmi1_btn', 'tvs[1].hdmi1_fb', 'tvs[1].hdmi1_label');
    createRectButton(document.getElementById('tv2-hdmi2'), 'tvs[1].hdmi2_btn', 'tvs[1].hdmi2_fb', 'tvs[1].hdmi2_label');

    createRectButton(document.getElementById('tv3-hdmi1'), 'tvs[2].hdmi1_btn', 'tvs[2].hdmi1_fb', 'tvs[2].hdmi1_label');
    createRectButton(document.getElementById('tv3-hdmi2'), 'tvs[2].hdmi2_btn', 'tvs[2].hdmi2_fb', 'tvs[2].hdmi2_label');

    createRectButton(document.getElementById('tv4-hdmi1'), 'tvs[3].hdmi1_btn', 'tvs[3].hdmi1_fb', 'tvs[3].hdmi1_label');
    createRectButton(document.getElementById('tv4-hdmi2'), 'tvs[3].hdmi2_btn', 'tvs[3].hdmi2_fb', 'tvs[3].hdmi2_label');

    createRectButton(document.getElementById('tv5-hdmi1'), 'tvs[4].hdmi1_btn', 'tvs[4].hdmi1_fb', 'tvs[4].hdmi1_label');
    createRectButton(document.getElementById('tv5-hdmi2'), 'tvs[4].hdmi2_btn', 'tvs[4].hdmi2_fb', 'tvs[4].hdmi2_label');

    setTimeout(() => {
      createToggleSwitch(document.getElementById('tv1-power'), 'tvs[0].on_btn', 'tvs[0].on_fb');
      createToggleSwitch(document.getElementById('tv2-power'), 'tvs[1].on_btn', 'tvs[1].on_fb');
      createToggleSwitch(document.getElementById('tv3-power'), 'tvs[2].on_btn', 'tvs[2].on_fb');
      createToggleSwitch(document.getElementById('tv4-power'), 'tvs[3].on_btn', 'tvs[3].on_fb');
      createToggleSwitch(document.getElementById('tv5-power'), 'tvs[4].on_btn', 'tvs[4].on_fb');
    }, 2000); // delay long enough for carousel DOM to render
  /* Glass Carousel */

  createCircularPreloader(document.getElementById('circular-preloader'), 'circular.label','Please Wait.......');  
  createRollingMenu(document.getElementById('rolling-menu-1'), {
    analogJoin: '22',         // join that controls selected item
    feedbackJoin: '23',       // join to send back selected index
    itemCountJoin: '21',      // join for item count
    baseTextJoin: '31'    // starting join for item labels (e.g. 510, 511, ...auto increments)
  });
  
  createRadioToggle(document.getElementById('radio-toggle1'), {
    groupId: 'grp1',
    buttons: [
      { label: 'Button 1', digitalJoin: 'radio[0].btn_1', feedbackJoin: 'radio[0].btn_1_fb', textJoin: 'radio[0].label_1' },
      { label: 'Button 2', digitalJoin: 'radio[0].btn_2', feedbackJoin: 'radio[0].btn_2_fb', textJoin: 'radio[0].label_2' },
      { label: 'Button 3', digitalJoin: 'radio[0].btn_3', feedbackJoin: 'radio[0].btn_3_fb', textJoin: 'radio[0].label_3' },
    ]
  });
  
  createRadioToggle(document.getElementById('radio-toggle2'), {
    groupId: 'grp2',
    buttons: [
      { label: 'Button 1', digitalJoin: 'radio[1].btn_1', feedbackJoin: 'radio[1].btn_1_fb', textJoin: 'radio[1].label_1' },
      { label: 'Button 2', digitalJoin: 'radio[1].btn_2', feedbackJoin: 'radio[1].btn_2_fb', textJoin: 'radio[1].label_2' },
      { label: 'Button 3', digitalJoin: 'radio[1].btn_3', feedbackJoin: 'radio[1].btn_3_fb', textJoin: 'radio[1].label_3' },
      { label: 'Button 4', digitalJoin: 'radio[1].btn_4', feedbackJoin: 'radio[1].btn_4_fb', textJoin: 'radio[1].label_4' },
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




