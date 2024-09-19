/**
 * GeoXpWebAudio is a plugin for GeoXpCore to manage audio content on web browsers
 * @module GeoXpWebAudio
 * */

import GeoXpCore from 'core';
import { Howl, Howler } from 'howler';
import { EventEmitter } from 'events';
import {
  isIOS, hasWebAudio, sanitiseConfig, Key, Listener
} from './src/utils';
import { GeoXpWebAudioConfig } from './src/types/config';
import { GeoXpWebAudioEvent, GeoXpWebAudioSound } from './src/types/module';

// use webAudio instead of html5 audio only on iOS capable devices
const USE_WEBAUDIO = isIOS() && hasWebAudio();

// howler configuration
Howler.usingWebAudio = USE_WEBAUDIO;
Howler.autoUnlock = true;

/**
 GeoXpWebAudio is a plugin for GeoXpCore to manage audio content on web browsers
 */
export default class GeoXpWebAudio {
  /**
   * GeoXpCore reference
   * @hidden
   */
  private geoXpCore: GeoXpCore;

  /**
   * Event emitter
   * @hidden
   */
  private event = new EventEmitter<GeoXpWebAudioEvent>();

  /**
   * Module configuration
   * @hidden
   */
  private config: GeoXpWebAudioConfig;

  /**
   * Buffer for loaded audio
   * @hidden
   */
  private buffer = new Map<string, GeoXpWebAudioSound>();

  /**
   * System sound is being played
   * @hidden
   */
  private isPlayingSystemSound = false;

  /**
   * Constructor for GeoXpWebAudio Class
   * @param geoXpCore GeoXpCore instance reference
   * @param config GeoXpWebAudio configuration
   * @returns GeoXpWebAudio singleton instance
   */
  constructor (geoXpCore: GeoXpCore, config: GeoXpWebAudioConfig) {
    // sanitise config
    this.config = sanitiseConfig(config);

    // inits the instance based on config
    this.init(config);

    // connects core
    this.geoXpCore = geoXpCore;

    // subscribes core events
    this.geoXpCore.on('incoming', (spot) => this.load(spot.id));
    this.geoXpCore.on('active', (spot) => this.play(spot.id));
    this.geoXpCore.on('inactive', (spot) => this.stop(spot.id));

    console.info('[GeoXpWebAudio] instance created', this);
  }

  /**
   * Inits configuration
   * @param { Object } config GeoXpWebAudio configuration
   * @hidden
   */
  private init (config: GeoXpWebAudioConfig) {
    // init config object
    this.config = sanitiseConfig(config);

    // reload buffer
    this.buffer.clear();
  }

  /**
   * Resets GeoXpWebAudio to provided options
   * @param config GeoXpWebAudio configuration
   */
  public reload (config: GeoXpWebAudioConfig) {
    this.unload();
    this.init(config);

    console.info('[GeoXpWebAudio.reload] config reloaded', this);
  }

  /**
   * Clears instance sounds and buffer
   */
  public unload () {
    Howler.stop();
    Howler.unload();
    this.buffer.clear();
  }

  /**
   * Plays test sound
   */
  public test () {
    this.playSystemSound(this.config.options.test, true);
  }

  /**
   * Plays silence
   */
  public silence () {
    this.playSystemSound(this.config.options.silence);
  }

  /**
   * Unlocks web audio
   */
  public unlock () {
    this.playSystemSound(this.config.options.silence, true);
  }

  /**
   * Sets the volume for all audios
   * @param volume Set volume 0 to 1
   */
  public setVolume (volume: number) {
    Howler.volume(volume);
  }

  /**
   * Stops all sounds imediately
   */
  public stopAll () {
    Howler.stop();
  }

  /**
   * Mutes all sounds
   * @param muted Mute or unmute
   */
  public setMute (muted: boolean) {
    Howler.mute(muted);
  }

  /**
   * Destroys specific sound
   * @param id - id of sound to destroy
   * @hidden
   */
  private destroy (id: string) {
    const sound = this.buffer.get(id);
    if (sound) {
      sound.audio.unload();
      this.buffer.delete(id);
    }
  }

  /**
   * Refresh buffer to play any sound queued due to overlap rules
   * @hidden
   */
  private refreshOverlap () {
    this.buffer.forEach(sound => {
      // resend play events on queued sounds
      if (sound.shouldPlay && !sound.shouldStop) {
        this.play(sound.cfg.spotId);
      }
    });
  }

  /**
   * Loads spot content
   * @param spotId reference spot id
   * @param autoplay [autoplay = false] play sound as soon as it loads
   * @param volume [volume = 1] playback volume from 0 to 1
   * @param fadeIn [fadeIn = null] fade in time [ms]
   */
  public load (spotId: string, autoPlay: boolean = false, volume: number = 1, fadeIn?: number) {
    const soundsCfg = this.config.sounds.filter((e) => e.spotId === spotId);
    if (!soundsCfg || soundsCfg.length === 0) {
      console.error('[GeoXpWebAudio.load] spot not found');
      return;
    }

    // for each sound related to spot
    soundsCfg.forEach(soundCfg => {
      // creates new sound
      const sound = {
        cfg: soundCfg,
        shouldPlay: autoPlay,
        shouldStop: false,
        isFadingOut: false,
        audio: new Howl({
          src: [soundCfg.url],
          html5: !USE_WEBAUDIO
        })
      };

      // sound id = spot id + cfg id
      const id = `${soundCfg.spotId}-${soundCfg.id}`;

      // save reference to buffer
      this.buffer.set(id, sound);

      sound.audio.once('load', () => {
        sound.audio.on('end', () => {
          // playback ended
          this.destroy(id);
          this.geoXpCore.spotDeactivated(sound.cfg.spotId);
          this.event.emit('ended', sound);

          // refresh buffer to play any sound queued due to overlap rules
          this.refreshOverlap();
        });

        sound.audio.on('stop', () => {
          // playback stopped
          this.destroy(id);
          this.geoXpCore.spotDeactivated(sound.cfg.spotId);
          this.event.emit('stopped', sound);

          // refresh buffer to play any sound queued due to overlap rules
          this.refreshOverlap();
        });

        sound.audio.on('play', () => {
          // fade in
          const fadeTime = fadeIn ?? this.config.options.fadeInTime;
          if (fadeTime > 0) sound.audio.fade(0, volume, fadeTime);
          else sound.audio.volume(volume);

          // playback started
          this.geoXpCore.spotActivated(sound.cfg.spotId);
          this.event.emit('playing', sound);
        });

        // start sound
        if (sound.shouldPlay) {
          this.play(spotId, volume, fadeIn);
        }
      });
    });
  }

  /**
   * Plays spot content if loaded, else load() then play().
   * @param spotId reference spot id
   * @param volume [volume = 1] playback volume from 0 to 1
   * @param fadeIn [fadeIn = null] fade in time [ms]
   */
  public play (spotId: string, volume: number = 1, fadeIn?: number) {
    const soundsCfg = this.config.sounds.filter((e) => e.spotId === spotId);
    if (!soundsCfg || soundsCfg.length === 0) {
      console.error('[GeoXpWebAudio.load] spot not found');
      return;
    }

    // for each sound related to spot
    soundsCfg.forEach(soundCfg => {
      // sound id = spot id + cfg id
      const id = `${soundCfg.spotId}-${soundCfg.id}`;

      // if audio isn't queued and loaded load()
      const sound = this.buffer.get(id);
      if (!sound) {
        // load audio and play when ready
        this.load(spotId, true, volume, fadeIn);
      } else {
        // if sounds are ready play(), else play when ready
        if (sound.audio.state() === 'loaded') {
          // check audio overlap rules
          if (!this.isPlaying(true) || sound.cfg.overlap) {
            // check if not already playing
            if (!sound.audio.playing()) {
              // play sound
              sound.audio.play();

              // reset any states
              sound.shouldStop = false;
              sound.isFadingOut = false;

              // fade in
              const fadeTime = fadeIn ?? this.config.options.fadeInTime;
              if (fadeTime > 0) sound.audio.volume(0);
              else sound.audio.volume(volume);
            }
          }
        } else sound.shouldPlay = true;
      }
    });
  }

  /**
   * Stops specific spot content
   * @param spotId reference spot id
   * @param fadeOut [fadeOut = null] fade out time [ms]
   */
  public stop (spotId: string, fadeOut?: number) {
    const soundsCfg = this.config.sounds.filter((e) => e.spotId === spotId);
    if (!soundsCfg || soundsCfg.length === 0) {
      console.error('[GeoXpWebAudio.load] spot not found');
      return;
    }

    // for each sound related to spot
    soundsCfg.forEach(soundCfg => {
      // sound id = spot id + cfg id
      const id = `${soundCfg.spotId}-${soundCfg.id}`;

      // finds audio in buffer
      const sound = this.buffer.get(id);
      if (sound) {
        if (sound.audio.playing()) {
          // fade out then stop
          const fadeTime = fadeOut || this.config.options.fadeOutTime;
          if (fadeTime > 0) {
            sound.isFadingOut = true;
            sound.audio.fade(sound.audio.volume(), 0, fadeTime);
            sound.audio.once('fade', () => {
              sound.audio.stop();
            });
          } else sound.audio.stop();
        } else {
          sound.audio.stop();
          this.destroy(id);
        }

        // marks sound for termination
        sound.shouldStop = true;

        // refresh buffer to play any sound queued due to overlap rules
        this.refreshOverlap();
      }
    });
  }

  /**
   * Checks if any sound is playing
   * @param overlap [overlap = false] if true, excludes overlapping audios
   * @returns Sound is playing
   * */
  public isPlaying (overlap = false) {
    let atLeastOne = false;
    this.buffer.forEach((sound) => {
      // if playing
      if (sound.audio.playing() && (!sound.cfg.overlap || !overlap) && !sound.isFadingOut) {
        atLeastOne = true;
      }
    });

    return atLeastOne;
  }

  /**
   * Plays system sound
   * @param url url of sound to play
   * @param forceHtml5 force use html5 audio
   */
  public playSystemSound (url: string, forceHtml5?: boolean) {
    if (!this.isPlayingSystemSound) {
      this.isPlayingSystemSound = true;

      this.buffer.forEach((e) => {
        if (e) e.audio.volume(0.2);
      });

      const sound = new Howl({
        src: [url],
        format: 'mp3',
        html5: forceHtml5 || !USE_WEBAUDIO,
        autoplay: true
      });

      sound.on('end', () => {
        this.isPlayingSystemSound = false;
        this.buffer.forEach((e) => {
          if (e) e.audio.volume(1);
        });
      });
    }
  }

  /**
   * Event wrapper on
   * @param eventName 'playing' | 'stopped' | 'ended'
   * @param listener event listener
   */
  public on<K> (eventName: Key<K, GeoXpWebAudioEvent>, listener: Listener<K, GeoXpWebAudioEvent>) {
    if (typeof listener !== 'function') {
      console.error('[GeoXpWebAudio.on] listener must be a function');
      return;
    }

    this.event.on(eventName, listener);
  }

  /**
   * Event wrapper once
   * @param eventName 'playing' | 'stopped' | 'ended'
   * @param listener event listener
   */
  public once<K> (eventName: Key<K, GeoXpWebAudioEvent>, listener: Listener<K, GeoXpWebAudioEvent>) {
    if (typeof listener !== 'function') {
      console.error('[GeoXpWebAudio.once] listener must be a function');
      return;
    }

    this.event.once(eventName, listener);
  }

  /**
   * Event wrapper off
   * @param eventName 'playing' | 'stopped' | 'ended'
   * @param listener event listener
   */
  public off<K> (eventName: Key<K, GeoXpWebAudioEvent>, listener: Listener<K, GeoXpWebAudioEvent>) {
    if (typeof listener !== 'function') {
      console.error('[GeoXpWebAudio.off] listener must be a function');
      return;
    }

    this.event.off(eventName, listener);
  }
}