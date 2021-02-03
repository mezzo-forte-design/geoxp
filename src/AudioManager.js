import {Howl, Howler} from 'howler';
import Device from './utils/Device.js';
import { Subject } from 'rxjs';

// Howler configuration
const USE_WEBAUDIO = Device.isSafariiOS() && Device.webaudio();
Howler.usingWebAudio = USE_WEBAUDIO;
Howler.autoUnlock = true;

/**
 * Creates AudioManager class.
 * AudioManager is responsible for all audio media management.
 * @param config - Config options for init
 * @returns { Object } - AudioManager instance
 * @constructor
 */
export default class AudioManager {

  constructor(config) {
    /**
    config: {
      sound: [{
        _id,
        label,
        url,
      }],
      default: {
        test,
        silence,
        unlock,
        visited,
      }
    }
    */

    this.play$ = new Subject();
    this.done$ = new Subject();

    this._init(config);
  }

  /**
  * Inits AudioManager on provided options
  * @param config - sound id information
  */
  _init(config) {
    this._config = config;

    this.playing = [];

    if(this._buffer) {
      this._buffer.clear();
    }
    this._buffer = new Map();
  }

  /**
  * Unlocks web audio API
  */
  unlock() {
    // plays silence
    this._playSystemSound(`${SILENCE_SOUND_URL}`);
  }

  /**
  * Resets AudioManager to provided options
  * @param config - Config options for init
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
  * Plays test system sound.
  */
  test() {
    this._playSystemSound(this._config.default.test);
  }

  /**
  * Plays silence.
  */
  silence() {
    this._playSystemSound(this._config.default.silence);
  }

  /**
  * Plays unlock system sound.
  */
  unlock() {
    this._playSystemSound(this._config.default.unlock);
  }

  /**
  * Plays already visited system sound.
  */
  visited() {
    this._playSystemSound(this._config.default.visited);
  }

  /**
  * Loads Howler sounds in buffer.
  * @param id - audio to load
  * @param playWhenReady - (false) play sound when loaded
  */
  load(id, playWhenReady = false) {

    if (!id) {
      console.error('[AudioManager.load] - audio info not provided. Cannot load');
      return;
    }

    const audio = this._config.sound.find( e => e._id === id);
    if (!audio) {
      console.error('[AudioManager.load] - sound not found. Cannot load');
      return;
    }

    // New howler sound
    const sound = {
      playWhenReady,
      audio: new Howl({
        src    : [audio.url],
        format : 'mp3',
        html5  : !USE_WEBAUDIO
      })
    }

    // save reference to sound (url act as unique ID)
    this._buffer.set(id, sound);

    sound.audio.once('load', () => {

      //TODO end, stop, differences?
      sound.audio.once('end', () => {
        this.done$.next(id);
      });

      sound.audio.once('stop', () => {
        // when stopped playback notify
        this.done$.next(id);
      });

      sound.audio.once('play', () => {
        // When starting playback notify
        this.play$.next(id);
      });

      // start sound
      if (sound.playWhenReady) {
        this.play(id);
      }
    });
  }

  /**
  * Plays Howler sounds if loaded, else load() then play().
  * @param id - audio to play
  * @param fade - (0) fadeIn time
  * @param volume - (1) playback volume
  */
  play(id, fade = 0, volume = 1) {

    if (!id) {
      console.error('[AudioManager.play] - audio info non provided. Cannot play');
      return;
    }

    // if audio isn't queued and loaded load()
    const sound = this._buffer.get(id);
    if (!sound) {

      // load audio and play when ready
      this.load(id, true);

    } else {
      // if sounds are ready play(), else playWhenReady
      if (sound.audio.state() === 'loaded') {
        if (!sound.audio.playing()) {

          sound.audio.play();

          // fade
          if (fade > 0) sound.audio.fade(0, volume, fade);
          else sound.audio.volume(volume);
        }
      }
      else sound.playWhenReady = true;
    }
  }

  /**
  * Stops specific sound
  * @param id - audio to stop
  * @param fade - (0) fadeOut time
  */
  stop(id, fade = 0) {

    if (!id) {
      console.error('[AudioManager.stop] - audio info non provided. Cannot stop');
      return;
    }

    // finds audio in buffer
    const sound = this._buffer.get(id);
    if (sound) {
      if (sound.audio.playing()) {
        if (fade > 0) {
          // fade out
          sound.audio.fade(sound.audio.volume(), 0, fade);
          sound.audio.once('fade', () => {
            sound.audio.stop();
          });
        } else sound.audio.stop();
      } else this._destroy(id);
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
  * Destroys specific sound
  * @param id - sound id
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
  * @param url - url of sound to play
  */
  _playSystemSound(url) {
    this._buffer.forEach(e => {
      if(e) e.audio.volume(.2);
    })

    const sound = new Howl({
      src      : [url],
      format   : 'mp3',
      html5    : !USE_WEBAUDIO,
      autoplay : true
    });

    sound.on('end', () => { 
      this._buffer.forEach(e => {
        if(e) e.audio.volume(1);
      })
    });
  }
}