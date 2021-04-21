const VERSION = '1.0.5';
const PRECACHE = `precache-parco-v${VERSION}`;

import UI from './ui/ui.js';
import GeoXp from 'mezzoforte-geoxp';

import { config } from './config/geoXp.config';

export class App {
  constructor() {
    // geoXp instance
    this._geoXp = new GeoXp(config);
    window.geoXp = this._geoXp;

    // UI instance
    this._ui = new UI(this._geoXp);
    this._ui.getLanguageFromURL();
    // set language to home link
    this._ui.setHomeLinkLang();
    // set tabs
    this._ui.setTabsTitles();

    this._mainContainer = document.getElementById('experience-main');
    this._helpContainer = document.getElementById('experience-help');

    // bind listeners
    this._onCodeConfirm = this._onCodeConfirm.bind(this);

    // geoXp events subscription
    // new position update
    this._geoXp.event.on('position', position => {
      this._log('main', `Your position: ${position.coords.latitude}, ${position.coords.longitude}`);
      precision.innerHTML = `GPS precision: ${position.coords.accuracy.toFixed(3)}m`;
    });

    // incoming spot (preload audio)
    this._geoXp.event.on('incoming', spot => {
      
    });

    // active spot
    this._geoXp.event.on('active', spot => {
      this._log('spots', `Hai raggiunto lo spot <b>${spot._id}</b>! Play`);
    });

    // already visited spot
    // TODO - Così non funziona, gli spot già visitati possono essere più di uno
    this._geoXp.event.on('visited', spot => {

      console.warn('already visited');
      // show notification (wanna play?)
      this._ui.modalConfirm({
        title: 'Spot già visitato',
        msg: 'Vuoi riascoltarlo?',
        okCallback: () => {
 
          this._geoXp.replaySpot();
        }
      });

      // after 60 seconds close modal and hide loader
      clearTimeout(this._HIDE_TIMEOUT);
      this._HIDE_TIMEOUT = setTimeout(() => {
        this._ui.closeModal();
      }, 5000);
    });

    // outgoing spot
    this._geoXp.event.on('outgoing', spot => {
      this._log('spots', `Stai abbandonando lo spot <b>${spot._id}</b>!`);
    });

    // audio started
    this._geoXp.event.on('play', audio => {
      console.log('audio',audio);
      if (!audio.overlap) {

        // load player
        this._ui.showPlayingAudio(this._mainContainer, audio.id);
        // show main tab
        this._ui.showMainTab();
      }
    });

    // audio ended
    this._geoXp.event.on('end', audio => {
      if (!this._geoXp.hasAudioPlaying(true)) {
        this._ui.hidePlayingAudio(this._mainContainer, audio.id);
        this._ui.resetCodeInput(this._helpContainer);
  
        // show main tab
        this._ui.showMainTab();
      }
    });
  }

  start() {
    if (!this._started) {
      // // lock screen
      // this._ui.lockScreen();
      // // set automatic lock
      // this._ui.setAutomaticLock();
      // // visibility change
      // this._ui.setVisibilityChangeHandler(e => {
        
      //   // page is hidden (app closed, phone locked...)
      //   this._geoXp.unlock();

      // }, e => {
      //   // page is shown (app reopened, phone unlocked...), nothing to do
      // });

      // show lock button
      const lockBtn = this._ui.createLockButton();
      this._mainContainer.appendChild(lockBtn);

      // unlock help tab
      this._ui.unlockHelpTab();

      // set started  to true to avoid double init
      this._started = true;

      // load and play silent sound to unlock audio on iphones
      this._geoXp.unlock();

      // show map
      this._ui.showMap(this._mainContainer);
      // show help tab
      this._ui.showHelpTab();
    }
  }

  renderHelp() {
    // render help section
    this._ui.renderHelp(this._helpContainer, this._onCodeConfirm);
    const testSound = document.getElementById('test-sound-button');
    testSound.addEventListener('click', e => {
      //e.currentTarget.classList.add('disabled', 'animation-pulse');

      this._geoXp.audio.test();

      //sound.on('end', () => testSound.classList.remove('disabled', 'animation-pulse'));
    });
  }

  _onCodeConfirm(e) {

    const spot = this._geoXp.getSpot(e.code);

    if(!spot) {

      // spot not found
      this._ui.flashMessage({
        type : 'Warning',
        msg  : 'invalidAudioCode'
      });
      this._ui.resetCodeInput(this._helpContainer);

      return;
    }

    // if (this._geoXp.hasActiveSpots()) {

    //   // other spots are already active
    //   this._ui.flashMessage({
    //     type : 'Info',
    //     msg  : 'alreadyPayingAudio'
    //   });
    //   this._ui.resetCodeInput(this._helpContainer);

    //   return;
    // }

    // if spot exists and no other spots are playing, force play
    document.getElementById('confirm-button').classList.add('disabled');
    this._geoXp.forceSpot(spot._id);
    this._ui.resetCodeInput(this._helpContainer);
  }

  createStartButton(onclick) {
    return this._ui.createStartButton(onclick);
  }

  createLockButton() {
    return this._ui.createLockButton();
  }

  _log(id, msg, append) {
    // if (append) {
    //   document.getElementById(id).insertAdjacentHTML('beforeend', msg);
    // } else {
    //   document.getElementById(id).innerHTML = msg;
    // }
  }

  simulate(posId, out = false) {
    const position = config.geo.positions.find(e => e._id === posId);
    if(position) {
      if(!out) {

        // incoming
        this._geoXp.geo._geoSuccess({
          coords: {
          accuracy: 5,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: position.lat,
          longitude: position.lon,
          }
          });
      } else {

          // outgoing
          console.log('new position outgoing', posId);

          this._geoXp.geo._geoSuccess({
            coords: {
            accuracy: 5,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: position.lat + 0.1,
            longitude: position.lon + 0.1,
            }
            });
      }

    }
  }
}

export class Intro {
  constructor() {
    this._geoXp = new GeoXp(config);
    this._ui = new UI(this._geoXp);
    this._ui.getLanguageFromURL();

    this.language = this.language.bind(this);
    this.headphones = this.headphones.bind(this);
    this.audio = this.audio.bind(this);
    this.unlock = this.unlock.bind(this);
    this.experience = this.experience.bind(this);
    this.assistance = this.assistance.bind(this);
  }

  start() {
    this._ui.showFloatingOverlay(this.language);
  }

  language() {
    this._ui.showLanguageSelector(navigator.onLine, VERSION, this.headphones);
  }

  headphones() {

    const currentLang = this._ui.getLanguage();

    // set language for the rest of introduction
    const langSelect = document.getElementById('lang-select');

    if (!langSelect) {
      // show headphones instructions and return (we're coming back from step 3)
      this._ui.showHeadphonesInstructions(this.audio, this.language);
      return;
    }

    this._ui.setLanguage(langSelect.value);

    const newLang = langSelect.value;

    if (newLang !== currentLang) {
      // disable button and show loader
      this._ui.showBlockLoader({
        type    : 'Pulse',
        element : '#confirm-language',
        msg     : 'loadingLanguage'
      });

      // update audio content in cache
      const toRemove = langContentArrays[currentLang];
      const toAdd = langContentArrays[newLang || 'it'];

      // open current cache
      caches.open(PRECACHE).then(cache => {
        const promises = toRemove.map(resource => cache.delete(resource));
        // remove previous language from cache
        Promise.all(promises).then(values => {
          // add new language to cache
          cache.addAll(toAdd).then(res => {
            // show headphones instructions (next step)
            this._ui.showHeadphonesInstructions(this.audio, this.language);
          });
        });
      });
    } else {
      // show headphones instructions
      this._ui.showHeadphonesInstructions(this.audio, this.language);
    }
  }

  audio() {
    this._geoXp.audio.test();
    this._ui.showTestAudio(this.unlock, this.headphones, this.assistance);
  }

  unlock() {
    //this._geoXp.unlock();

    // show unlock gif ancd instructions
    this._ui.showUnlockInstructions(this.experience, this.audio);
  }

  experience() {
    // fade out last screen
    this._ui.fadeOutLastScreen(() => {
      // get selected laguage
      const lang = this._ui.getLanguage();
      // start experience from here
      window.location.href = `/experience.html?lang=${lang}`;
    });
  }

  assistance() {
    // mostra modale - chiedi al desk o chiama il numero
    this._ui.modalMessage({
      type : 'Warning',
      msg  : 'helpAudioMessage'
    });
  }
}
