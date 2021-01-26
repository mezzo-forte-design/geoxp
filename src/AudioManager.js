import {Howl, Howler} from 'howler';
import {Device} from './utils.js';

// Howler configuration
const USE_WEBAUDIO = Device.isSafariiOS() && Device.webaudio();
Howler.usingWebAudio = USE_WEBAUDIO;
Howler.autoUnlock = true;

// Default sounds
const AUDIO_TEST_URL = '/audio/test.mp3';
const SILENCE_SOUND_URL = '/audio/silence.mp3';
const UNLOCK_FILENAME = '/unlock.mp3';
const ALREADY_VISITED_FILENAME = '/visited.mp3';

// Languages
import {audioAssets, langContentArrays} from './config/audioAssets.config.js';

/**
 * Creates AudioManager class.
 * AudioManager is responsible for all audio media management.
 * @param options - Config options for init
 * @returns { Object } - AudioManager instance
 * @constructor
 */
export default class AudioManager {

  constructor(options) {
    /** options: { 
    * */
    this._init(options);
  }

  /**
  * Resets AudioManager to provided options
  * @param options - Config options for init
  */
  reset(options) {
    this.clear();
    this._init(options);
  }

  /**
  * Clears the sound buffer 
  */
  clear() {
    this._buffer.clear();
    Howler.stop();
    Howler.unload();
  }

  /**
  * Plays test system sound.
  */
  test() {
    this._playSystemSound(`${AUDIO_TEST_URL}`);
  }

  /**
  * Plays silence.
  */
  silence() {
    this._playSystemSound(`${SILENCE_SOUND_URL}`);
  }

  /**
  * Plays unlock system sound.
  */
  unlock() {
    this._playSystemSound(`${this._AUDIO_URL_PREFIX}${UNLOCK_FILENAME}`);
  }

  /**
  * Plays already visited system sound.
  */
  visited() {
    this._playSystemSound(`${this._AUDIO_URL_PREFIX}${ALREADY_VISITED_FILENAME}`);
}

  /**
  * Loads Howler sounds in buffer.
  * @param options - sound id information
  * @param playWhenReady - (false) play sound when loaded
  */
  load(options, playWhenReady = false) {
    /** options: { 
     *    url;          file url
     *    code;         sound code
     *    solo;         mute others
     * */

    // New howler sound
    const sound = {
      playWhenReady,
      audio: new Howl({
        src    : [`${this._AUDIO_URL_PREFIX}${options.url}`],
        format : 'mp3',
        html5  : !USE_WEBAUDIO
      })
    }

    // save reference to sound (url act as unique ID)
    this._buffer.set(options.code, sound);

    sound.audio.once('load', () => {

      sound.audio.once('end', () => {
        // when finished playback notify
        this._destroy(options.code, sound);
      });

      sound.audio.once('stop', () => {
        // when stopped playback notify
        this._destroy(options.code, sound);
      });

      sound.audio.once('play', () => {
        // When starting playback notify
      });

      // start sound
      if (sound.playWhenReady) {
        this.play(options);
      }
    });
  }

  /**
  * Plays Howler sounds if loaded, else load() then play().
  * @param options - sound id information
  * @param fade - (0) fadeIn time
  * @param volume - (1) playback volume
  */
  play(options, fade = 0, volume = 1) {
    /** options: { 
     *    url;          file url
     *    code;         sound code
     *    solo;         mute others
     * */

    if (!options.code || !options.url) {
      console.error('[AudioManager.play] - code non provided. Cannot play');
      return;
    }

    // if code isn't queued and loaded load()
    const sound = this._buffer.get(option.code);
    if (!sound) this.load(options, true);
    else {
      // if sound is ready play(), else playWhenReady
      if (sound.audio.state() === 'loaded') {
        if (!sound.audio.playing()) {

          sound.audio.play();

          // fade
          if (fade > 0) sound.audio.fade(0, volume, fade);
          else sound.volume(volume);
        }
      }
      else sound.playWhenReady = true;
    }

  }

  /**
  * Stops specific sound
  * @param options - sound id information
  * @param fade - (0) fadeOut time
  */
  stop(options, fade = 0) {

    // stops specific sound
    if (!options.code || !options.url) {
      console.error('[AudioManager.stop] - code non provided. Cannot stop');
      return;
    }

    const sound = this._buffer.get(options.code);
    if (sound) {
      if (sound.audio.playing()) {
        if (fade > 0) {
          // fade out
          sound.audio.fade(sound.audio.volume(), 0, fade);
          sound.audio.once('fade', () => {
            sound.audio.stop();
          });
        } else sound.audio.stop();
      } else this._destroy(options.code, sound);
    }
  }

  /**
  * Stops all sounds imediately
  */
  stopAll() {
    Howler.stop();
  }

  /**
  * Mutes all sounds
  * @param muted - Mute or unmute
  */
  muteAll(muted) {
    Howler.mute(muted);
  }



  /** 
   * Internal 
  */

  /**
  * Inits AudioManager on provided options
  * @param options - sound id information
  */
  _init(options) {
    this._buffer = new Map();
    this._AUDIO_URL_PREFIX = `/audio/${options.lang}`;
  }

  /**
  * Plays system sound
  * @param url - url of sound to play
  */
  _playSystemSound(url) {
    this._buffer.forEach((el) => {
      if(el) el.volume(.2);
    })

    const sound = new Howl({
      src      : [url],
      format   : 'mp3',
      html5    : !USE_WEBAUDIO,
      autoplay : true
    });

    sound.on('end', () => { 
      this._buffer.forEach((el) => {
        if(el) el.volume(1);
      })
    });
  }

  /**
  * Destroys specific sound
  * @param code - code in map
  * @param sound -  sound to destroy
  */
  _destroy(code, sound) {
    sound.audio.unload();
    this._buffer.delete(code);
  }

  // _audioUrlByCode(code) {
  //   const target = audioAssets.find(el => el.key === code);
  //   if (target) {
  //     return target.url;
  //   } else {
  //     console.warn(`URL not found in audioAssets.config for code: ${code}`);
  //     return false;
  //   }
  // }

  // _getAudioNameByCode(code) {
  //   const name = this._ui.getTexts().audioTitles[code];
  //   if (name) {
  //     return name;
  //   } else {
  //     console.warn(`Name not found for code: ${code}`);
  //     return false;
  //   }
  // }
}