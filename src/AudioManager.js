/** @module AudioManager */

import { Howl, Howler } from 'howler';

import { Subject } from 'rxjs';

import Device from './utils/Device.js';

import { isPositiveNumber } from './utils/helpers.js';

import {
  DEFAULT_FADE_IN_TIME,
  DEFAULT_FADE_OUT_TIME
} from './constants';

// default audio
import defaultSilenceSound from './audio/silence.mp3';
import defaultTestSound from './audio/test.mp3';
import defaultVisitedSound from './audio/visited.mp3';

// Howler configuration
const USE_WEBAUDIO = Device.isSafariiOS() && Device.webaudio();
Howler.usingWebAudio = USE_WEBAUDIO;
Howler.autoUnlock = true;

/**
 * Creates AudioManager class.
 * AudioManager is responsible for all audio media management
 * @param { Object } config - Audio config options
 * @returns { Object } Audio manager instance
 * @constructor
 */
export default class AudioManager {

  constructor(config) {
    /**
    config: {
      sounds: [{
        id,
        label,
        url,
      }],
      default: {
        test,
        silence,
        visited,
        fadeInTime,
        fadeOutTime
      }
    }
    */

    this.play$ = new Subject();
    this.done$ = new Subject();

    this._init(config);
  }

  /**
  * Inits AudioManager on provided options
  * @param { Object } config - Audio config options
  */
  _init(config) {

    // sets default if none provided
    if (!config.options) {
      console.info(
        '*** [AudioManager] *** System sounds URLs not provided -> Using default sounds. You can find example audio files in /src/audio folder ***'
      );
      config.options = {
        test: defaultTestSound,
        silence: defaultSilenceSound,
        visited: defaultVisitedSound,
        fadeInTime: DEFAULT_FADE_IN_TIME,
        fadeOutTime: DEFAULT_FADE_OUT_TIME
      }
    } else {

      if (!config.options.test) {
        console.info(
          '*** [AudioManager] *** Test sound URL not provided -> Using default sound ***'
        );
        config.options.test = defaultTestSound;
      }

      if (!config.options.visited) {
        console.info(
          '*** [AudioManager] *** Visited spot sound URL not provided -> Using default sound ***'
        );
        config.options.visited = defaultVisitedSound;
      }

      config.options.silence = config.options.silence || defaultSilenceSound;

      config.options.fadeInTime = isPositiveNumber(config.options.fadeInTime) ?
        config.options.fadeInTime :
        DEFAULT_FADE_IN_TIME;

      config.options.fadeOutTime = isPositiveNumber(config.options.fadeOutTime) ?
        config.options.fadeOutTime :
        DEFAULT_FADE_OUT_TIME;
    }

    // sets config
    this._config = config;

    // init variables
    this.playing = [];

    if (this._buffer) {
      this._buffer.clear();
    }
    this._buffer = new Map();
  }

  /**
  * Resets AudioManager to provided options
  * @param { Object } config - Audio config options
  */
  reload(config) {
    this.unload();
    this._init(config);
  }

  /**
  * Clears the sound buffer
  */
  unload() {
    this._buffer.clear();
    Howler.stop();
    Howler.unload();
  }

  /**
  * Plays test system sound
  */
  test() {
    this._playSystemSound(this._config.options.test);
  }

  /**
  * Plays silence
  */
  silence() {
    this._playSystemSound(this._config.options.silence);
  }

  /**
  * Unlocks web audio
  */
  unlock() {
    this._playSystemSound(this._config.options.silence);
  }

  /**
  * Plays already visited system sound
  */
  visited() {
    this._playSystemSound(this._config.options.visited);
  }

  /**
  * Loads Howler sounds in buffer
  * @param { Object } spot - spot to load
  * @param { boolean } overlap - can overlap other sounds
  * @param { number } [fade = null] - fade in time [ms]
  * @param { boolean } [playWhenReady = false] - play sound when loaded
  */
  load(spot, overlap = false, fade = null, playWhenReady = false) {

    if (!spot.audio) {
      console.error('[AudioManager.load] - audio info not provided. Cannot load');
      return;
    }

    const audio = this._config.sounds.find(e => e.id === spot.audio);
    if (!audio) {
      console.error('[AudioManager.load] - sound not found. Cannot load');
      return;
    }

    // sets id to spot id + audio id
    const id = `${spot.id}-${audio.id}`;

    // New
    const sound = {
      id,
      spot,
      overlap,
      playWhenReady,
      audio: new Howl({
        src: [audio.url],
        format: 'mp3',
        html5: !USE_WEBAUDIO
      })
    }

    // save reference to sound (url act as unique ID)
    this._buffer.set(id, sound);

    sound.audio.once('load', () => {

      //TODO end, stop, differences?
      sound.audio.on('end', () => {
        this.done$.next(sound);
      });

      sound.audio.on('stop', () => {
        // when stopped playback notify
        this.done$.next(sound);
      });

      sound.audio.on('play', () => {
        // When starting playback notify
        this.play$.next(sound);
      });

      // start sound
      if (sound.playWhenReady) {
        const fadeTime = fade ? fade : this._config.options.fadeInTime;
        this.play(spot, overlap, fadeTime);
      }
    });
  }

  /**
  * Plays Howler sounds if loaded, else load() then play().
  * @param { Object } spot - spot to load
  * @param { boolean } overlap - can overlap other sounds
  * @param { number } [fade = null] - fade in time [ms]
  * @param { number } [volume = 1] - playback volume from 0 to 1
  */
  play(spot, overlap = false, fade = null, volume = 1) {

    if (!spot.audio) {
      console.error('[AudioManager.play] - audio info non provided. Cannot play');
      return;
    }

    // sets id to spot audio
    const id = `${spot.id}-${spot.audio}`;

    // if audio isn't queued and loaded load()
    const sound = this._buffer.get(id);
    if (!sound) {

      // load audio and play when ready
      this.load(spot, overlap, fade, true);

    } else {
      // if sounds are ready play(), else playWhenReady
      if (sound.audio.state() === 'loaded') {
        if (!sound.audio.playing()) {

          // play sound
          sound.audio.play();

          // fade in
          const fadeTime = fade ? fade : this._config.options.fadeInTime;
          if (fadeTime > 0) sound.audio.fade(0, volume, fadeTime);
          else sound.audio.volume(volume);
        }
      }
      else sound.playWhenReady = true;
    }
  }

  /**
  * Stops specific spot sound
  * @param { Object } spot - spot to load
  * @param { number } [fade = null] - fade out time [ms]
  */
  stop(spot, fade = null) {

    if (!spot.audio) {
      console.error('[AudioManager.stop] - audio info non provided. Cannot stop');
      return;
    }

    // sets id to spot audio
    const id = `${spot.id}-${spot.audio}`;

    // finds audio in buffer
    const sound = this._buffer.get(id);
    if (sound) {
      if (sound.audio.playing()) {

        // fade out then stop
        const fadeTime = fade ? fade : this._config.options.fadeOutTime;
        if (fadeTime > 0) {
          sound.audio.fade(sound.audio.volume(), 0, fadeTime);
          sound.audio.once('fade', () => {
            sound.audio.stop();
          });

        } else sound.audio.stop();

      } else this._destroy(id);
    }
  }

  /**
  * Checks if any sound is playing
  * @param { boolean } [overlap = false] - if true, excludes overlapping audios
  * @returns { boolean } Sound is playing
  * */
  hasAudioPlaying(overlap = false) {
    let atLeastOne = false;
    this._buffer.forEach(sound => {

      // if playing
      if (sound.audio.playing() && (!sound.overlap || !overlap)) {
        atLeastOne = true;
      }
    });

    return atLeastOne;
  }

  /**
  * Sets the volume for all audios
  * @param { number } volume - Set volume 0 to 1
  */
  setVolume(volume) {
    Howler.volume = volume;
  }

  /**
  * Stops all sounds imediately
  */
  stopAll() {
    Howler.stop();
  }

  /**
  * Mutes all sounds
  * @param { boolean } muted - Mute or unmute
  */
  muteAll(muted) {
    Howler.mute(muted);
  }

  /**
  * Destroys specific sound
  * @param {string} id - id of sound to destroy
  */
  _destroy(id) {
    const sound = this._buffer.get(id);
    if (sound) {
      sound.audio.unload();
      this._buffer.delete(id);
    }
  }

  /**
  * Plays system sound
  * @param { string } url - url of sound to play
  */
  _playSystemSound(url) {
    if (!this._systemSoundPlaying) {
      this._systemSoundPlaying = true;

      this._buffer.forEach(e => {
        if (e) e.audio.volume(.2);
      })

      const sound = new Howl({
        src: [url],
        format: 'mp3',
        html5: !USE_WEBAUDIO,
        autoplay: true
      });

      sound.on('end', () => {
        this._systemSoundPlaying = false;
        this._buffer.forEach(e => {
          if (e) e.audio.volume(1);
        })
      });
    }
  }
}