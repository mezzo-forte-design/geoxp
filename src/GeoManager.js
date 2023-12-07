/** @module GeoManager */

import { Subject } from 'rxjs';

import {
  DEFAULT_ACCURACY,
  DEFAULT_DEADBAND,
  DEFAULT_RADIUS,
  DEFAULT_FETCH,
  DEFAULT_FORCE_ACCURACY
} from './constants';

import { isNumber, toRad } from './utils/helpers';

/**
 * Creates GeoManager class.
 * GeoManager is responsible for geoLocalization
 * @param config - Geo config options
 * @returns { Object } GeoManager instance
 * @constructor
 */
export default class GeoManager {
  constructor(config) {
    /**
    config: {
      positions: [{
        id,
        label,
        lat,
        lon,
        radius,    [m]
        deadband,  [m]
        fetch     1 : n ratio of radius for prefetching
      }],
      options: {
        accuracy,
        defaultRadius,
        defaultDeadband,
        defaultFetch
      }
    }
    */

    // bind listeners
    this._geoSuccess = this._geoSuccess.bind(this);
    this._geoError = this._geoError.bind(this);

    // creates subjects for notification
    this.inside$ = new Subject();
    this.incoming$ = new Subject();
    this.outgoing$ = new Subject();
    this.position$ = new Subject();

    // watch position ids
    this._GEO_WATCH = [];

    // inits the instance based on config
    this._init(config);
  }

  /**
  * Clears all geoposition watches
  */
  clearPositionWatch() {
    this._GEO_WATCH.forEach(watchId => {
      navigator.geolocation.clearWatch(watchId);
    });
    this._GEO_WATCH = [];
  }

  /**
  * Inits AudioManager on provided options
  * @param config - Geo config options
  */
  _init(config) {
    this._geolocationApiConfig = {
      enableHighAccuracy: config.options.enableHighAccuracy !== undefined ? config.options.enableHighAccuracy : true,
      maximumAge: config.options.maximumAge !== undefined ? config.options.maximumAge : 30000,
      timeout: config.options.timeout !== undefined ? config.options.timeout : 27000
    };

    // sets default is nothing provided
    if (!config.options) {
      config.options = {
        accuracy: DEFAULT_ACCURACY,
        defaultDeadband: DEFAULT_DEADBAND,
        defaultRadius: DEFAULT_RADIUS,
        defaultFetch: DEFAULT_FETCH
      };
    } else {
      // check if some of the single options are missing
      config.options.accuracy = isNumber(config.options.accuracy) ?
        config.options.accuracy :
        DEFAULT_ACCURACY;

      config.options.defaultDeadband = isNumber(config.options.defaultDeadband) ?
        config.options.defaultDeadband :
        DEFAULT_DEADBAND;

      config.options.defaultRadius = isNumber(config.options.defaultRadius) ?
        config.options.defaultRadius :
        DEFAULT_RADIUS;

      config.options.defaultFetch = (isNumber(config.options.defaultFetch) && config.options.defaultFetch >= 1) ?
        config.options.defaultFetch :
        DEFAULT_FETCH;
    }

    // sets minimum manual mode precision
    this.FORCE_ACCURACY = DEFAULT_FORCE_ACCURACY;

    // sets config
    this._config = config;

    // init variables
    this.inside = [];

    // clear prev GPS position watchers
    this.clearPositionWatch();

    // Listens for GPS position
    const newWatchId = navigator.geolocation.watchPosition(this._geoSuccess, this._geoError, this._geolocationApiConfig);
    this._GEO_WATCH.push(newWatchId);
  }

  /**
  * Loads a new configuration
  * @param config - Geo config options
  */
  reload(config) {
    this._init(config);
  }

  /**
  * Unloads all object subscriptions
  */
  unload() {
    this.inside = [];
    this.clearPositionWatch();
  }

  /**
  * Unlocks geolocation API
  */
  unlock() {
    // request for position
    navigator.geolocation.getCurrentPosition(() => { });
  }

  /**
  * Sends new notification for each inside position
  */
  refresh() {
    this.inside.forEach(positionId => {
      const position = this._config.positions.find(e => e.id === positionId);
      this.inside$.next(position.id);
    });
  }

  /**
  * Enables / disables internal geolocation updates
  * @param { boolean } enabled - enable or disable
  */
  internalGeolocation(enabled) {
    if (enabled) {
      const newWatchId = navigator.geolocation.watchPosition(this._geoSuccess, this._geoError, this._geolocationApiConfig);
      this._GEO_WATCH.push(newWatchId);
    } else {
      this.clearPositionWatch();
    }
  }

  /**
  * Checks if manual mode is available
  * Rules are
  * Your gps accuracy is really bad
  * You are not too far away
  * @param { string } id - id for position of spot to force
  * @returns { string | undefined } Null if it can be played, else error cause
  * */
  canForceSpot(id) {
    const position = this._config.positions.find(e => e.id === id);

    // spots without position data can be forced at any time
    if (!position) return;

    const accuracy = this.lastPosition.coords.accuracy;
    const distance = this._calcGeoDistance(this.lastPosition.coords.longitude, this.lastPosition.coords.latitude, position.lon, position.lat);
    const spotArea = (position.radius || this._config.options.defaultRadius) + (position.deadband || this._config.options.defaultDeadband);

    // checks for max allowed distance
    if (distance - accuracy > spotArea) {
      console.warn('[GeoManager.canForceSpot] - Cannot force spot, too far');
      return "too far";
    }

    // check for accuracy
    if (accuracy <= this.FORCE_ACCURACY) {
      console.warn('[GeoManager.canForceSpot] - Cannot force spot, current position is too accurate');
      return "current location is too accurate";
    }

    // check again for distance
    if (distance > spotArea) {
      console.warn('[GeoManager.canForceSpot] - Cannot force spot, too far');
      return "too far";
    }
  }

  /**
  * Checks the status of the spots in relation to current position
  * @param { Object } pos - current position as provided by geolocation API
  */
  _geoSuccess(pos) {

    if (!pos) {
      console.error('[GeoManager._geoSuccess] - position missing or incorrect format');
      return;
    }

    // Notify new position
    this.position = pos;
    this.position$.next(pos);

    // Sets last registered position
    this.lastPosition = pos;

    // exec only if position.coords.accuracy is < than accuracy threshold
    if (pos.coords.accuracy > this._config.options.accuracy) {
      return;
    }

    this._config.positions.forEach((position) => {
      // calc distance [m]
      const dist = this._calcGeoDistance(pos.coords.longitude, pos.coords.latitude, position.lon, position.lat);

      // calc rardiuses
      const inside = position.radius || this._config.options.defaultRadius;
      const outside = (position.radius || this._config.options.defaultRadius) + (position.deadband || this._config.options.defaultDeadband);
      const fetch = (position.fetch || this._config.options.defaultFetch) * inside;

      if (this.inside.includes(position.id)) {

        // already inside
        if (dist > outside) {

          // outside radius + deadband
          this.inside = this.inside.filter(e => e !== position.id);
          this.outgoing$.next(position.id);
        }

      } else {

        // currently not inside
        if (dist <= inside) {

          // inside play area
          this.inside.push(position.id);
          this.inside$.next(position.id);
        }

        else if (dist <= fetch) {

          // inside prefetch area
          this.incoming$.next(position);
        }

      }
    });
  }

  /**
  * Geolocation API reports an error retrieving current position
  * @param { Object } error - error as sent from geolocation API
  */
  _geoError(error) {
    console.error('[GeoManager._geoError] - Geolocation error', error);
  }

  /**
  * Computes the distance between two coordinates
  * @param { number } lon1 - longitude of first coord
  * @param { number } lat1 - latitude of first coord
  * @param { number } lon2 - longitude of second coord
  * @param { number } lat2 - latitude of second coord
  * @returns { number } distance between coordinates
  */
  _calcGeoDistance(lon1, lat1, lon2, lat2) {
    // Radius of the earth in km
    const EARTH_R = 6371;

    // Javascript functions in radians
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    //
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    //
    const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in m
    const dist = EARTH_R * b * 1000;
    return dist;
  }
}