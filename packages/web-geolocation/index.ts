/**
 * GeoXpWebGeolocation provides use location informations based on navigator.geolocation api
 * @module GeoXpWebGeolocation
 * */

import GeoXpCore from 'core';
import { EventEmitter } from 'events';
import { GeoXpWebGeolocationConfig } from './src/types/config';
import { GeoXpGeolocation } from 'core/src/types/common';
import { sanitiseConfig } from './src/utils';
import { GeoXpWebGeolocationEvent } from './src/types/module';
import { Key, Listener } from 'core/src/utils';

/**
 * GeoXpWebGeolocation provides use location informations based on navigator.geolocation api
 */
export default class GeoXpWebGeolocation {
  /**
   * GeoXpCore reference
   * @hidden
   */
  private geoXpCore: GeoXpCore;

  /**
   * Event emitter
   * @hidden
   */
  private event = new EventEmitter<GeoXpWebGeolocationEvent>();

  /**
   * Module configuration
   * @hidden
   */
  private config: GeoXpWebGeolocationConfig;

  /**
   * Geolocation subscriptions
   * @hidden
   */
  private locationSubs: number[] = [];

  /**
   * Last location
   * @hidden
   */
  private lastLocation?: GeoXpGeolocation;

  /**
   * Location updates enabled
   * @hidden
   */
  private updatesEnabled = true;

  /**
   * Constructor for GeoXpWebGeolocation Class
   * @param geoXpCore GeoXpCore instance reference
   * @param config GeoXpWebGeolocation configuration
   * @returns GeoXpWebGeolocation singleton instance
   */
  constructor (geoXpCore: GeoXpCore, config: GeoXpWebGeolocationConfig) {
    // bind listeners
    this.geoSuccess = this.geoSuccess.bind(this);
    this.geoError = this.geoError.bind(this);

    // sanitise config
    this.config = sanitiseConfig(config);

    // inits the instance based on config
    this.init(config);

    // connects core
    this.geoXpCore = geoXpCore;

    console.info('[GeoXpWebGeolocation] instance created', this);
  }

  /**
   * Clears all geoposition watches
   * @hidden
   */
  private unsubAll () {
    this.locationSubs.forEach((subId) => {
      navigator.geolocation.clearWatch(subId);
    });
    this.locationSubs = [];
  }

  /**
   * Inits GeoXpWebGeolocation on provided options
   * @param config GeoXpWebGeolocation configuration
   * @hidden
   */
  private init (config: GeoXpWebGeolocationConfig) {
    this.config = sanitiseConfig(config);

    // clear prev GPS position watchers
    this.unsubAll();

    if (this.updatesEnabled) {
      // unlocks geolocation api
      this.unlock();

      // Listens for geolocation updates
      const subId = navigator.geolocation.watchPosition(this.geoSuccess, this.geoError, this.config);
      this.locationSubs.push(subId);
    }
  }

  /**
   * Loads a new configuration
   * @param config Config options
   */
  public reload (config: GeoXpWebGeolocationConfig) {
    this.init(config);
    console.info('[GeoXpWebGeolocation.reload] config reloaded', config);
  }

  /**
   * Unloads all subscriptions
   */
  public unload () {
    this.unsubAll();
  }

  /**
   * Unlocks geolocation API
   */
  public unlock () {
    navigator.geolocation.getCurrentPosition(() => {});
  }

  /**
   * Get current (last) location
   * @returns current (last) location
   */
  public getLocation () {
    return this.lastLocation;
  }

  /**
   * Enables / disables geolocation updates
   * @param enabled enabled or disabled
   */
  public toggleUpdates (enabled: boolean) {
    if (enabled) {
      const subId = navigator.geolocation.watchPosition(this.geoSuccess, this.geoError, this.config);

      this.locationSubs.push(subId);

      this.updatesEnabled = true;
    } else {
      this.unsubAll();

      this.updatesEnabled = false;
    }
  }

  /**
   * Checks the status of the spots in relation to current position
   * @param location current location as provided by geolocation API
   * @hidden
   */
  private geoSuccess (position: GeolocationPosition) {
    if (!position) {
      console.error('[GeoXpWebGeolocation.geoSuccess] position missing or incorrect format');
      return;
    }
    const location = {
      timestamp: position.timestamp,
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      accuracy: position.coords.accuracy
    };

    // Sets last registered location
    this.lastLocation = location;

    // Send location to core
    this.geoXpCore.geolocationUpdate(location);

    // Emit new location
    this.event.emit('location', location);
  }

  /**
   * Geolocation API reports an error retrieving current position
   * @param error - error as sent from geolocation API
   * @hidden
   */
  private geoError (error: GeolocationPositionError) {
    console.error('[GeoXpWebGeolocation.geoError] geolocation error', error);
  }

  /**
   * Event wrapper on
   * @param eventName - 'location'
   * @param listener - event listener
   */
  public on<K> (eventName: Key<K, GeoXpWebGeolocationEvent>, listener: Listener<K, GeoXpWebGeolocationEvent>) {
    if (typeof listener !== 'function') {
      console.error('[GeoXpWebGeolocation.on] listener must be a function');
      return;
    }

    this.event.on(eventName, listener);
  }

  /**
   * Event wrapper once
   * @param eventName - 'location'
   * @param listener - event listener
   */
  public once<K> (eventName: Key<K, GeoXpWebGeolocationEvent>, listener: Listener<K, GeoXpWebGeolocationEvent>) {
    if (typeof listener !== 'function') {
      console.error('[GeoXpWebGeolocation.once] listener must be a function');
      return;
    }

    this.event.once(eventName, listener);
  }

  /**
   * Event wrapper off
   * @param eventName - 'location'
   * @param listener - event listener
   */
  public off<K> (eventName: Key<K, GeoXpWebGeolocationEvent>, listener: Listener<K, GeoXpWebGeolocationEvent>) {
    if (typeof listener !== 'function') {
      console.error('[GeoXpWebGeolocation.off] listener must be a function');
      return;
    }

    this.event.off(eventName, listener);
  }
}
