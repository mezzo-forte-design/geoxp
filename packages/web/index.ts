/**
 * GeoXpWeb provides a plug-and-play GeoXp for the web, with audio playback and geolocation managed through Web APIs
 * @module WebClass
 * */

import GeoXpCore from '@geoxp/core';
import type { GeoXpSpot, GeoXpCoreEvent } from '@geoxp/core';
import GeoXpWebAudio from '@geoxp/web-audio';
import type { GeoXpWebAudioEvent, GeoXpWebAudioSound } from '@geoxp/web-audio';
import GeoXpWebGeolocation from '@geoxp/web-geolocation';
import type { GeoXpWebGeolocationEvent, GeoXpGeolocation } from '@geoxp/web-geolocation';
import GeoXpWebStorage from '@geoxp/web-storage';
import type { GeoXpWebConfig } from './src/types/config';
import type { GeoXpWebEvent, EngineType } from './src/types/module';
import type { Key, Listener } from '@geoxp/utils';

export default class GeoXpWeb {
  /**
   * Core instance
   */
  public readonly core: GeoXpCore;

  /**
   * Web Audio instance
   */
  public readonly audio: GeoXpWebAudio;

  /**
   * Web Geolocation instance
   */
  public readonly geolocation: GeoXpWebGeolocation;

  /**
   * Web Storage instance
   */
  public readonly storage?: GeoXpWebStorage;

  /**
   * Wheter to throw errors or just log
   * @hidden
   */
  private readonly throwErrors: boolean;

  /**
   * Constructor for GeoXpWeb Class
   * @param config GeoXpWeb configuration
   * @param options Options for GeoXpWeb
   * @param options.throwErrors Whether errors should be throw or not. Throw is default behavior
   * @returns GeoXpWeb singleton instance
   */
  constructor(
    config: GeoXpWebConfig,
    options?: {
      throwErrors?: boolean;
    }
  ) {
    // wheter errors are thrown or not
    this.throwErrors = options?.throwErrors ?? true;
    this.core = new GeoXpCore(config.core, options);
    this.audio = new GeoXpWebAudio(this.core, config.audio);
    this.geolocation = new GeoXpWebGeolocation(this.core, config.geolocation);

    if (config.storage === true) {
      // if storage is just a boolean, use default config
      this.storage = new GeoXpWebStorage(this.core);
    } else if (config.storage !== undefined) {
      // if valid config, use pass it to package
      this.storage = new GeoXpWebStorage(this.core, config.storage);
    }
    // otherwise exclude storage package
  }

  /**
   * Loads a new config
   * @param config GeoXpWebConfig configuration
   */
  public reload(config: GeoXpWebConfig) {
    this.core.reload(config.core);
    this.audio.reload(config.audio);
    this.geolocation.reload(config.geolocation);

    if (config.storage === true) {
      this.storage?.reload();
    } else if (config.storage !== undefined) {
      this.storage?.reload(config.storage);
    }
  }

  /**
   * Unlocks web audio and web geolocation
   */
  public unlock() {
    this.audio.unlock();
    this.geolocation.unlock();
  }

  /**
   * Handles errors
   * @hidden
   */
  private error(msg: string, ...args: unknown[]) {
    if (this.throwErrors) {
      throw new Error(msg);
    } else {
      console.error(msg, args);
    }
  }

  /**
   * Checks event type
   * @hidden
   */
  private checkEventEngineType<K>(eventName: Key<K, GeoXpWebEvent>): EngineType {
    if (
      eventName === 'incoming' ||
      eventName === 'active' ||
      eventName === 'inactive' ||
      eventName === 'visited' ||
      eventName === 'last' ||
      eventName === 'complete'
    ) {
      return 'core';
    }

    if (eventName === 'playing' || eventName === 'stopped' || eventName === 'ended') {
      return 'audio';
    }

    if (eventName === 'location') {
      return 'geolocation';
    }

    return 'core';
  }

  /**
   * Event wrapper on
   * @param eventName 'incoming' | 'active' | 'inactive' | 'visited' | 'last' | 'complete' | 'playing' | 'stopped' | 'ended' | 'location'
   * @param listener event listener
   */
  public on<K>(eventName: Key<K, GeoXpWebEvent>, listener: Listener<K, GeoXpWebEvent>) {
    if (typeof listener !== 'function') {
      this.error('[GeoXpWeb.on] listener must be a function');
      return;
    }

    const engineType = this.checkEventEngineType(eventName);

    if (engineType === 'core') {
      const coreEventName = eventName as Key<K, GeoXpCoreEvent>;
      const coreListener = listener as Listener<K, GeoXpCoreEvent>;
      this.core.on(coreEventName, coreListener);
    }

    if (engineType === 'audio') {
      const audioEventName = eventName as Key<K, GeoXpWebAudioEvent>;
      const audioListener = listener as Listener<K, GeoXpWebAudioEvent>;
      this.audio.on(audioEventName, audioListener);
    }

    if (engineType === 'geolocation') {
      const geoEventName = eventName as Key<K, GeoXpWebGeolocationEvent>;
      const geoListener = listener as Listener<K, GeoXpWebGeolocationEvent>;
      this.geolocation.on(geoEventName, geoListener);
    }
  }

  /**
   * Event wrapper once
   * @param eventName 'incoming' | 'active' | 'inactive' | 'visited' | 'last' | 'complete' | 'playing' | 'stopped' | 'ended' | 'location'
   * @param listener event listener
   */
  public once<K>(eventName: Key<K, GeoXpWebEvent>, listener: Listener<K, GeoXpWebEvent>) {
    if (typeof listener !== 'function') {
      this.error('[GeoXpWeb.once] listener must be a function');
      return;
    }

    const engineType = this.checkEventEngineType(eventName);

    if (engineType === 'core') {
      const coreEventName = eventName as Key<K, GeoXpCoreEvent>;
      const coreListener = listener as Listener<K, GeoXpCoreEvent>;
      this.core.once(coreEventName, coreListener);
    }

    if (engineType === 'audio') {
      const audioEventName = eventName as Key<K, GeoXpWebAudioEvent>;
      const audioListener = listener as Listener<K, GeoXpWebAudioEvent>;
      this.audio.once(audioEventName, audioListener);
    }

    if (engineType === 'geolocation') {
      const geoEventName = eventName as Key<K, GeoXpWebGeolocationEvent>;
      const geoListener = listener as Listener<K, GeoXpWebGeolocationEvent>;
      this.geolocation.once(geoEventName, geoListener);
    }
  }

  /**
   * Event wrapper off
   * @param eventName 'incoming' | 'active' | 'inactive' | 'visited' | 'last' | 'complete' | 'playing' | 'stopped' | 'ended' | 'location'
   * @param listener event listener
   */
  public off<K>(eventName: Key<K, GeoXpWebEvent>, listener: Listener<K, GeoXpWebEvent>) {
    if (typeof listener !== 'function') {
      this.error('[GeoXpWeb.off] listener must be a function');
      return;
    }

    const engineType = this.checkEventEngineType(eventName);

    if (engineType === 'core') {
      const coreEventName = eventName as Key<K, GeoXpCoreEvent>;
      const coreListener = listener as Listener<K, GeoXpCoreEvent>;
      this.core.off(coreEventName, coreListener);
    }

    if (engineType === 'audio') {
      const audioEventName = eventName as Key<K, GeoXpWebAudioEvent>;
      const audioListener = listener as Listener<K, GeoXpWebAudioEvent>;
      this.audio.off(audioEventName, audioListener);
    }

    if (engineType === 'geolocation') {
      const geoEventName = eventName as Key<K, GeoXpWebGeolocationEvent>;
      const geoListener = listener as Listener<K, GeoXpWebGeolocationEvent>;
      this.geolocation.off(geoEventName, geoListener);
    }
  }
}

export { GeoXpWebConfig, GeoXpSpot, GeoXpWebAudioSound, GeoXpGeolocation };
