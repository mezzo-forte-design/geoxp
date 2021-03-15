// libs
import Mustache from 'mustache'; // usage: const output = Mustache.render(template, hash);
import { Notify, Block, Report } from "notiflix";
import Hammer from 'hammerjs';
import NoSleep from 'nosleep.js';
import PatternLock from 'patternlock';
import ProgressBar from 'progressbar.js';

// utils
import { parseUrlParams } from '../utils.js';

// templates
import * as templates from './templates.js';

// languages texts
import { langs, availableLanguages } from '../config/langs.config.js';

export default class UI {
  constructor(geoXp) {
    this._MAX_INACTIVITY = 15000;
    this._unlockPattern = '7-4-1-5-3-6-9'; // M shape
    this._noSleep = new NoSleep();
    this._uiFX = new UIFX();

    this._geoXp = geoXp;

    // save lang object
    this._langs = langs;

    // init Notify
    Notify.Init({
      width : '100%',
      position : 'left-bottom',
      warning : {
        textColor: 'var(--dark)'
      }
    });

    Block.Init({
      fontFamily      : 'MessinaSans',
      svgColor        : 'var(--dark)',
      svgSize         : '60px',
      messageColor    : 'var(--dark)',
      messageFontSize : '20px'
    });

    Report.Init({
      fontFamily       : 'MessinaSans',
      svgSize          : '90px',
      messageColor     : 'var(--dark)',
      messageFontSize  : '18px',
      backgroundColor  : 'var(--light)',
      borderRadius     : '6px',
      info: {
        backOverlayColor : 'rgba(18, 18, 18, .5)',
        buttonBackground : 'var(--dark)'
      },
      warning: {
        backOverlayColor : 'rgba(18, 18, 18, .5)',
        buttonBackground : 'var(--dark)'
      }
    });

    // adjust container height
    this.adjustHeight();
    // listen to screen resizing (e.g. virtual keyboard is open)
    window.addEventListener('resize', this.adjustHeight);

    // set swipe handler
    this.setSwipeHandler();
  }

  adjustHeight() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setSwipeHandler() {
    const containerLeft = document.getElementById('experience-help');
    if (containerLeft) {
      this._hammerRight = new Hammer(containerLeft);
      this._hammerRight.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
      this._hammerRight.on('swipe', e => {
        if (e.deltaX > 0) {
          document.getElementById('experience-main-tab').click();
        }
      });
    }

    const containerMain = document.getElementById('experience-main');
    if (containerMain) {
      this._hammerLeft = new Hammer(containerMain);
      this._hammerLeft.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
      this._hammerLeft.on('swipe', e => {
        if (e.deltaX < 0) {
          document.getElementById('experience-help-tab').click();
        }
      });
    }
  }

  setVisibilityChangeHandler(onPageHidden, onPageVisible) {
    // Set the name of the hidden property and the change event for visibility
    let hidden;
    let visibilityChange;

    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    // if the page is shown, play the video
    const handleVisibilityChange = e => {
      if (document[hidden]) {
        if (typeof onPageHidden === 'function') {
          onPageHidden(e);
        }
      } else {
        if (typeof onPageVisible === 'function') {
          onPageVisible(e);
        }
      }
    }

    // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }

  setAutomaticLock() {
    this._lastAction = new Date().getTime();

    this._hammerAll = new Hammer(document.body);
    this._hammerAll.on('tap swipe pan', e => {
      this._lastAction = new Date().getTime();
    });

    setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - this._lastAction;
      if (elapsed >= this._MAX_INACTIVITY && !this._locked && !this._lockFading) {
        this.lockScreen();
      }
    }, 2000)
  }

  setHomeLinkLang() {
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
      homeLink.href = `/?lang=${this._currentLang}`;
    }
  }

  setTabsTitles() {
    const mainButton = document.getElementById('experience-main-tab');
    if (mainButton) mainButton.innerHTML = this._TEXTS.map;

    const helpButton = document.getElementById('experience-help-tab');
    if (helpButton) helpButton.innerHTML = this._TEXTS.code;
  }

  renderHelp(container, onCodeConfirm) {
    // show code input prompt
    this.showCodeInput(3, container, onCodeConfirm);

    // render faqs
    const faqs = Mustache.render(templates.FAQ, {
      title : this._TEXTS.faqTitle,
      faqs  : this._TEXTS.faqs.map((el, idx) => new Object({ idx, ...el }))
    });

    container.insertAdjacentHTML('beforeend', faqs);
  }

  getLanguageFromURL() {
    // current lang
    const urlLang = parseUrlParams(window.location.href).lang || 'it';
    this._currentLang = availableLanguages.includes(urlLang) ? urlLang : 'it';
    // get texts
    this._TEXTS = this._langs[this._currentLang] || {};
  }

  setLanguage(lang) {
    this._currentLang = availableLanguages.includes(lang) ? lang : 'it';
    this._TEXTS = this._langs[this._currentLang] || {};
  }

  getLanguage() {
    return this._currentLang;
  }

  getTexts() {
    return this._TEXTS;
  }

  static get desktopBlock() {
    return templates.desktopBlock;
  }

  static get notSupported() {
    return templates.notSupported;
  }

  createStartButton(onclick) {
    return this._createNode('button', {
      id        : 'start-button',
      class     : 'basic-button color-dark',
      innerHTML : this._TEXTS.startButton,
      onclick   : onclick
    });
  }

  createLockButton() {
    return this._createNode('button', {
      id        : 'lock-button',
      class     : 'basic-button color-dark',
      onclick   : this.lockScreen.bind(this),
      style     : {
        position        : 'absolute',
        bottom          : '10px',
        right           : '10px',
        width           : '60px',
        height          : '60px',
        'border-radius' : '50%',
        'border-width'  : '2px'
      }
    });
  }

  flashMessage(options) {
    Notify[options.type](this._TEXTS[options.msg]);
  }

  showBlockLoader(options) {
    Block[options.type](options.element, this._TEXTS[options.msg]);
  }

  hideBlockLoader(options) {
    Block.Remove(options.element);
  }

  modalMessage(options) {
    Report[options.type](...this._TEXTS[options.msg]);
  }

  closeModal(options) {
    const closeModal = document.getElementById('NXReportButton');
    if (closeModal) closeModal.click();
  }

  lockScreen() {
    // create black overlay
    this._patternOverlay = this._createNode('div', {
      class: 'overlay d-flex align-items-center justify-content-center bg-dark',
      style: { opacity: 0 , 'z-index': 9999 }
    });

    // create lock pattern container
    const patternContainer = this._createNode('div', {
      id    : 'patternHolder',
      class : 'bg-transp',
    });

    // append to body
    this._patternOverlay.appendChild(patternContainer);
    document.body.appendChild(this._patternOverlay);

    // fade in overlay
    this._lockFading = true;
    this._uiFX.fadeIn(this._patternOverlay, {
      duration : 1000,
      easing   : 'swing',
      complete : () => { this._lockFading = false; this._locked = true; }
    });

    // activate no sleep
    this._noSleep.enable();

    // set unlock pattern
    const lock = new PatternLock('#patternHolder', {
      delimiter: '-'
    });

    lock.checkForPattern(this._unlockPattern, () => {
      // correct pattern
      this.unlockScreen();
    }, () => {
      // wrong pattern
      const lines = document.querySelectorAll('.patt-lines');
      lines.forEach(line => this._uiFX.fadeOut(line, {
        duration : 1200,
        complete : () => lock.reset()
      }));
    });
  }

  unlockScreen() {
    // disable no sleep
    this._noSleep.disable();

    // fade out overlay
    this._lockFading = true;
    this._uiFX.fadeOut(this._patternOverlay, {
      duration : 1000,
      easing   : 'swing',
      complete : () => {
        this._patternOverlay.remove();
        this._locked = false;
        this._lockFading = false;
      }
    });
  }

  _createNode(node, attributes) {
    const el = document.createElement(node);
    for (let key in attributes) {
      if (key === 'innerHTML' || key === 'innerText') {
        el[key] = attributes[key];
      } else if (key === 'onclick') {
        if (typeof attributes[key] === 'function') {
          el.onclick = attributes[key];
        } else {
          console.warn('onclick must be a valid function - ', attributes[key]);
        }
      } else if (key === 'style') {
        const style = attributes[key];
        if (style.constructor === Object) {
          const styleString = Object.entries(style).map(entry => `${entry[0]}:${entry[1]};`).join('');
          el.setAttribute('style', styleString);
        } else  {
          console.warn('style must be a valid object - ', attributes[key]);
        }
      } else {
        el.setAttribute(key, attributes[key]);
      }
    }
    return el;
  }

  showCodeInput(chars, container, confirmHandler) {
    const previous = container.querySelector('#playing-audio-message');
    this._uiFX.fadeOut(previous, {
      duration : 1000,
      complete : () => {
        if (previous) previous.remove();
        const codeInputInterface = this._generateCodeInputInterface(chars, confirmHandler);
        container.appendChild(codeInputInterface);
      }
    });
  }

  _generateCodeInputInterface(chars, confirmHandler) {

    const codeInputContainer = this._createNode('div', {
      id    : 'code-input-container',
      class : 'text-center '
    });

    // number of inputs = chars
    const codeInputs = Mustache.render(templates.codeInput, {
      instruction : this._TEXTS.codeInputInstruction,
      inputs      : new Array(chars)
    });

    const confirmButton = this._createNode('button', {
      id        : 'confirm-button',
      class     : 'large-button dark-button mt-5',
      innerHTML : this._TEXTS.confirmButton,
      onclick   : e => {
        const inputs = [...document.querySelectorAll('#code-input > input[type=text]')];
        e.code = inputs.map(el => el.value.toUpperCase()).join('');
        confirmHandler(e);
      }
    });

    codeInputContainer.insertAdjacentHTML('beforeend', codeInputs);

    codeInputContainer.appendChild(confirmButton);

    this._setOnKeyupListener(codeInputContainer, confirmButton);

    return codeInputContainer;
  }

  _setOnKeyupListener(container, confirmButton) {
    container.onkeyup = e => {
      const target = e.srcElement;

      if (target.nodeName !== 'INPUT') {
        return;
      }

      // when maxlength length is reached, skip to next
      const myLength = target.value.length;
      const maxLength = parseInt(target.attributes["maxlength"].value, 10);
      if (myLength >= maxLength) {
        let next = target;
        while (next = next.nextElementSibling) {
          if (next == null)
            break;
          if (next.nodeName === "INPUT") {
            next.focus();
            break;
          }
        }
      }

      // when input is empty, skip to previous
      if (e.key === 'Backspace' && target.value === '') {
        let prev = target;
        while (prev = prev.previousElementSibling) {
          if (prev == null)
            break;
          if (prev.nodeName === "INPUT") {
            prev.focus();
            break;
          }
        }
      }

      if (e.key === 'Enter') {
        confirmButton.click();
      }
    }
  }

  resetCodeInput(container) {
    const inputs = [...container.querySelectorAll('input[type=text]')];
    inputs.forEach(el => el.value = '');

    container.querySelector('#confirm-button').classList.remove('disabled');
  }

  showMap(container) {
    const mapContainer = container.querySelector('#spots-map');
    mapContainer.innerHTML = templates.map;

    this.showWalkMessage(container);
  }

  showWalkMessage(container) {
    const walkInstruction = Mustache.render(templates.headerFloatingBox, {
      instruction: this._TEXTS.walkInstruction
    });

    const header = container.querySelector('#experience-textured-header');
    header.innerHTML = walkInstruction;

  }

  showPlayingAudio(container, soundId) {
    // switch to main tab
    const tabButton = document.getElementById('experience-main-tab');
    if (!tabButton.classList.contains('active')) {
      tabButton.click();
    }

    // expand header
    const header = container.querySelector('#experience-textured-header');
    header.classList.add('playing');

    // gets sound info
    let sound = this._geoXp.audio.getCurrentAudioInfo(soundId);
    if (!sound) {
      console.log('sound not found!');
      return;
    }

    // show playing progress/interactive player and show spot title
    const player = Mustache.render(templates.interactivePlayer, {
      audioTitle : sound.label,
      playing    : sound.playing
    });

    header.innerHTML = player;

    const interactivePlayerContainer = container.querySelector('#interactive-player-container > .progress-circle');
    // set height equal to width
    interactivePlayerContainer.style.height = interactivePlayerContainer.style.width;

    // start circle progress bar
    const bar = new ProgressBar.Circle(interactivePlayerContainer, {
      strokeWidth: 3,
      duration: sound.duration * 1000,
      color: '#A5A093',
      trailColor: '#403f3f',
      trailWidth: 1,
      svgStyle: null
    });

    if (sound.playing) bar.animate(1.0);

    // play pause listener
    const playPauseButton = container.querySelector('#interactive-player-container > .play-pause-button');
    playPauseButton.addEventListener('click', e => {
      sound = this._geoXp.audio.getCurrentAudioInfo(soundId);
      if (sound.playing) {
        this._geoXp.audio.pause(sound.id);
        bar.stop(true);
        playPauseButton.classList.remove('playing');
      } else {
        const duration = (sound.duration - sound.seek) * 1000;
        this._geoXp.audio.play(sound.id);
        bar.animate(1.0, { duration });
        playPauseButton.classList.add('playing');
      }
    });

    const skipButtons = [...container.querySelectorAll('.skip-button')];
    skipButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        sound = this._geoXp.audio.getCurrentAudioInfo(soundId);

        let newTime = sound.seek + parseInt(e.currentTarget.dataset.skip);
        if (newTime < 0) newTime = 0;
        if (newTime > sound.duration) newTime = sound.duration;

        // stop animation
        bar.stop(true);

        // skip track to seek time
        this._geoXp.audio.seek(sound.id, newTime);

        // calc and set progress position
        const progressPosition = newTime / sound.duration;
        bar.set(progressPosition);

        // calc remaining duration and start aimation
        bar.animate(1.0, {
          duration: (sound.duration - newTime) * 1000
        });
      });
    });

    const progressTimer = container.querySelector('#progress-timer');

    const updateTimer = () => {
      sound = this._geoXp.audio.getCurrentAudioInfo(soundId);
      this._TIMER_ANIMATION = window.requestAnimationFrame(updateTimer);
      progressTimer.innerHTML = this.secToTimer(sound.seek);
    };

    updateTimer();

    // set spot in map as active
    // const ellipse = container.querySelector(`#ellipse_${code}`);
    // if (ellipse) ellipse.classList.add('active');
  }

  cancelTimerAnimation() {
    window.cancelAnimationFrame(this._TIMER_ANIMATION);
  }

  hidePlayingAudio(container, code) {
    const header = container.querySelector('#experience-textured-header');
    header.classList.remove('playing');

    const ellipse = container.querySelector(`#ellipse_${code}`);
    if (ellipse) {
      ellipse.classList.remove('active');
      ellipse.classList.add('visited');
    }

    this.showWalkMessage(container);
  }

  secToTimer(sec) {
    if (sec > 0) {
      const o = new Date(0);
      const p =  new Date(sec * 1000);
      const array = new Date(p.getTime() - o.getTime())
        .toISOString()
        .split('T')[1]
        .split('Z')[0]
        .split(':');
      return `${array[1]}:${array[2].split('.')[0]}`;
    } else {
      return '00:00';
    }
  }

  unlockHelpTab() {
    const helpButton = document.getElementById('experience-help-tab');
    if (helpButton) helpButton.classList.remove('disabled');
  }

  showHelpTab() {
    const helpButton = document.getElementById('experience-help-tab');
    if (helpButton) helpButton.click();
  }

  showMainTab() {
    const mainButton = document.getElementById('experience-main-tab');
    if (mainButton) mainButton.click();
  }

  /* INTRODUCTION */
  showFloatingOverlay(next) {
    document.body.insertAdjacentHTML('beforeend', templates.blackFloatingOverlay);
    // get overlay
    const floatingOverlay = document.getElementById('intro-floating-overlay');
    // fade in
    this._uiFX.fadeIn(floatingOverlay, {
      duration : 500,
      display  : 'flex',
      complete : next
    });
  }

  showLanguageSelector(online, version, next) {
    // render new content
    const overlayContent = Mustache.render(templates.languageSelect, {
      offline          : !online,
      version          : version,
      offlineLangAlert : this._TEXTS.offlineLangAlert,
      confirmButton    : this._TEXTS.confirmButton,
      it               : this._currentLang === 'it',
      fr               : this._currentLang === 'fr',
      en               : this._currentLang === 'en',
      es               : this._currentLang === 'es',
      de               : this._currentLang === 'de'
    });
    // get overlay
    const floatingOverlay = document.getElementById('intro-floating-overlay');
    // get current content as DOM element
    const outEl = floatingOverlay.querySelector('.intro-content');
    // append new content
    floatingOverlay.insertAdjacentHTML('beforeend', overlayContent);
    // change confirm button language on select change
    const select = document.getElementById('lang-select');
    if (select) {
      select.addEventListener('change', e => {
        const confirmButton = document.getElementById('confirm-language');
        if (confirmButton) confirmButton.innerHTML = this._langs[e.currentTarget.value].confirmButton;
      });
    }
    // get new content as DOM element
    const inEl = document.getElementById('lang-select-container');
    // crossfade
    this._uiFX.crossFade(outEl, inEl, {
      duration : 500,
      display  : 'flex'
    });
    // set confirm handler
    document.getElementById('confirm-language').addEventListener('click', next);
  }

  showHeadphonesInstructions(next, back) {
    // render new content
    const overlayContent = Mustache.render(templates.headphonesInstructions, {
      confirmButton : this._TEXTS.confirmButton,
      instruction   : this._TEXTS.headphonesInstructions
    });
    // get overlay
    const floatingOverlay = document.getElementById('intro-floating-overlay');
    // get current content as DOM element
    const outEl = floatingOverlay.querySelector('.intro-content');
    // append new content
    floatingOverlay.insertAdjacentHTML('beforeend', overlayContent);
    // get new content as DOM element
    const inEl = document.getElementById('headphones-instruction-container');
    // crossfade
    this._uiFX.crossFade(outEl, inEl, {
      duration : 500,
      display  : 'flex'
    });
    // set confirm handler
    document.getElementById('confirm-headphones').addEventListener('click', next);
    // set back handler
    document.getElementById('back-arrow-headphones').addEventListener('click', back);
  }

  showTestAudio(next, back, dismiss) {
    // get overlay
    const floatingOverlay = document.getElementById('intro-floating-overlay');
    // render new content
    const overlayContent = Mustache.render(templates.testAudio, {
      confirmAudioButton  : this._TEXTS.confirmAudioButton,
      dismissAudioButton  : this._TEXTS.dismissAudioButton,
      instruction_caption : this._TEXTS.audioTestCaption,
      instruction         : this._TEXTS.audioTestInstructions
    });
    // get current content as DOM element
    const outEl = floatingOverlay.querySelector('.intro-content');
    // append new content
    floatingOverlay.insertAdjacentHTML('beforeend', overlayContent);
    // get new content as DOM element
    const inEl = document.getElementById('test-audio-container');
    // crossfade
    this._uiFX.crossFade(outEl, inEl, {
      duration : 500, // duration of each fade
      display  : 'flex'
    });
    // set confirm handler
    document.getElementById('confirm-audio').addEventListener('click', next);
    // set back handler
    document.getElementById('back-arrow-audio').addEventListener('click', back);
    // set dismiss handler
    document.getElementById('dismiss-audio').addEventListener('click', dismiss);
  }

  showUnlockInstructions(next, back) {
    // get overlay
    const floatingOverlay = document.getElementById('intro-floating-overlay');
    // render new content
    const overlayContent = Mustache.render(templates.unlockInstructions, {
      continueButton      : this._TEXTS.continueButton,
      instruction         : this._TEXTS.unlockInstructions,
      instruction_caption : this._TEXTS.unlockInstructionsCaption
    });
    // get current content as DOM element
    const outEl = floatingOverlay.querySelector('.intro-content');
    // append new content
    floatingOverlay.insertAdjacentHTML('beforeend', overlayContent);
    // get new content as DOM element
    const inEl = document.getElementById('unlock-instruction-container');
    // crossfade
    this._uiFX.crossFade(outEl, inEl, {
      duration : 500, // duration of each fade
      display  : 'flex'
    });
    // set video playback rate
    document.getElementById("unlock-video").playbackRate = .7;
    // set back handler
    document.getElementById('back-arrow-unlock').addEventListener('click', back);
    // confirm
    document.getElementById('confirm-unlock').addEventListener('click', next);
  }

  fadeOutLastScreen(complete) {
    const floatingOverlay = document.getElementById('intro-floating-overlay');
    const el  = floatingOverlay.querySelector('.intro-content');
    this._uiFX.fadeOut(el, {
      duration : 1000,
      display  : 'flex',
      complete
    });
  }

}

class UIFX {
  constructor() {
    this._easing = {
        linear    : progress => progress,
        quadratic : progress => Math.pow(progress, 2),
        swing     : progress => 0.5 - Math.cos(progress * Math.PI) / 2,
        circ      : progress => 1 - Math.sin(Math.acos(progress)),
        back      : (progress, x) => Math.pow(progress, 2) * ((x + 1) * progress - x),
        bounce    : progress => {
            for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                if (progress >= (7 - 4 * a) / 11) {
                    return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                }
            }
        },
        elastic: (progress, x) => Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress)
    };
  }

  fadeOut(element, options = {}) {
    // if no element is provided, call oncomplete function
    if (!element) {
      if (typeof options.complete === 'function') {
        options.complete();
      }
      return;
    }
    // otherwise exec animation
    const to = 1;
    element.style.display = options.display || 'block';
    this._animate({
        duration : options.duration || 500,
        delta    : progress => this._easing[options.easing || 'swing'](progress),
        step     : delta => element.style.opacity = to - delta,
        complete : options.complete
    });
  }

  fadeIn(element, options = {}) {
    // if no element is provided, call oncomplete function
    if (!element) {
      if (typeof options.complete === 'function') {
        options.complete();
      }
      return;
    }
    // otherwise exec animation
    const to = 0;
    element.style.display = options.display || 'block';
    this._animate({
        duration : options.duration || 500,
        delta    : progress => this._easing.swing(progress),
        step     : delta => element.style.opacity = to + delta,
        complete : options.complete
    });
  }

  slideLeft(element, options = {}) {
    // if no element is provided, call oncomplete function
    if (!element) {
      if (typeof options.complete === 'function') {
        options.complete();
      }
      return;
    }
    // otherwise exec animation
    element.style.position = 'relative';
    element.style.left = options.from ? `${options.from}px` : 0;
    element.style.transition = `left ${options.duration || 500}ms ease-in-out`;
    setTimeout(() => {
      element.style.left = options.to ? `${options.to}px` : '-1000px';
      setTimeout(() => {
        if (typeof options.complete === 'function') {
          options.complete();
        }
      }, (options.duration || 500) + 10);
    }, 0);
  }

  slideRight(element, options = {}) {
    // if no element is provided, call oncomplete function
    if (!element) {
      if (typeof options.complete === 'function') {
        options.complete();
      }
      return;
    }
    // otherwise exec animation
    element.style.position = 'relative';
    element.style.right = options.from ? `${options.from}px` : 0;
    element.style.transition = `right ${options.duration || 500}ms ease-in-out`;
    setTimeout(() => {
      element.style.right = options.to ? `${options.to}px` : '-1000px';
      setTimeout(() => {
        if (typeof options.complete === 'function') {
          options.complete();
        }
      }, (options.duration || 500) + 10);
    }, 0);
  }

  crossFade(elementOut, elementIn, options = {}) {
    // if element to hide out is defined, crossfade
    if (elementOut) {
      this.fadeOut(elementOut, {
        complete : () => {
          elementOut.remove();
          this.fadeIn(elementIn, { ...options });
        },
        ...options
      });
    } else if (elementIn) {
      // else just fade in element to show
      this.fadeIn(elementIn, { ...options });
    }
  }

  _animate(options) {
      const start = new Date;
      const id = setInterval(() => {
          const timePassed = new Date - start;
          let progress = timePassed / options.duration;
          if (progress > 1) {
            progress = 1;
          }
          options.progress = progress;
          const delta = options.delta(progress);
          options.step(delta);
          if (progress == 1) {
            clearInterval(id);
            if (typeof options.complete === 'function') {
              options.complete();
            }
          }
      }, options.delay || 10);
  }
}
