import { Subject } from 'rxjs';
import Device from './utils/Device';

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

/**
 * Creates GeoManager class.
 * GeoManager is responsible for geoLocalization.
 * @param config - Config options for init
 * @returns { Object } - GeoManager instance
 * @constructor
 */
export default class GeoManager {
  constructor(config) {
    /**
    config: {
      position: [{
        _id,
        label,
        lat,
        lon,
        radius,    [m]
        deadband,  [m]
        fetch     1 : n ratio of radius for prefetching
      }],
      default: {
        minAccuracy,
        playDistance,
        posDeadband,
        fetchDistance
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

    // inits the instance based on config
    this._init(config);
  }

  /**
  * Inits AudioManager on provided options
  * @param config - config parameters
  */
  _init(config) {

    // sets default is nothing provided 
    if (!config.default) {
      config.default = {
        minAccuracy: 100,
        posDeadband: 10,
        playDistance: 20,
        fetchDistance: 1
      }
    }
  
    // sets config
    this._config = config;

    // init variables
    this.inside = [];
    this.position;

    // Listens for GPS position
    if(this._GEO_WATCH) {
      navigator.geolocation.clearWatch(this._GEO_WATCH);
    }
    this._GEO_WATCH = navigator.geolocation.watchPosition(this._geoSuccess, this._geoError, Device.geolocationOpts);
  }

  /**
  * Loads a new configuration
  * @param config - config parameters
  */ 
  reload(config) {
    this._init(config);
  }

  /**
  * Unloads all object subscriptions
  */ 
  unload() {

    this.inside = [];
    if (this._GEO_WATCH) {
      navigator.geolocation.clearWatch(this._GEO_WATCH);
    }
  }

  /**
  * Unlocks geolocation API
  */
  unlock() {
    // request for position
    navigator.geolocation.getCurrentPosition(() => {});
  }

  /**
  * Send new notification for inside positions
  */ 
  refresh() {
    this.inside.forEach( position => {
      this.inside$.next(position);
    });
  }
  
  /**
  * Checks the status of the spots in relation to current position
  * @param pos - current position as provided by geolocation API
  */ 
  _geoSuccess(pos) {

    if (!pos) {
      console.error('[GeoManager._geoSuccess] - position missing or incorrect format');
      return;
    }

    // Notify new position
    this.position = pos;
    this.position$.next(pos);

    // exec only if position.coords.accuracy is < a given threshold (to define)
    if (pos.coords.accuracy > this._config.default.minAccuracy) {
      return;
    }

    this._config.position.forEach((position) => {
      // calc distance [m]
      const dist = this._calcGeoDistance(pos.coords.longitude, pos.coords.latitude, position.lon, position.lat);

      // calc rardiuses
      const inside = (position.radius || this._config.default.playDistance) - (position.deadband || this._config.default.posDeadband);
      const outside = (position.radius || this._config.default.playDistance) + (position.deadband || this._config.default.posDeadband);
      const fetch = (position.fetch || this._config.default.fetchDistance) * inside;

      // check distances
      if (dist <= inside) {

        // inside play area
        if (!this.inside.includes(position._id)) {
          this.inside.push(position._id);
          this.inside$.next(position._id);
        }

      } else if (dist <= fetch) {

        // inside prefetch area
        this.incoming$.next(position);

      } else if (dist > outside) {

        // outside play area
        if (this.inside.includes(position._id)) {
          this.inside = this.inside.filter(e => e !== position._id);
          this.outgoing$.next(position._id);
        }
      }
    });
  }

  /**
  * Geolocation API reports an error retrieving current position
  * @param error - error as sent from geolocation API
  */ 
  _geoError(error) {
    console.error('[GeoManager._geoError] - Geolocation error - Nessuna posizione disponibile');
  }

  /**
  * Computes the distance between two coordinates
  * @param lon1 - longitude of first point
  * @param lat1 - latitude of first point
  * @param lon2 - longitude of second point
  * @param lat2 - latitude of second point
  */ 
  _calcGeoDistance(lon1, lat1, lon2, lat2) {
    // Radius of the earth in km
    const EARTH_R = 6371;

    // Javascript functions in radians
    const dLat = (lat2 - lat1).toRad();
    const dLon = (lon2 - lon1).toRad();

    //
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    //
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in m
    const dist = EARTH_R * c * 1000;
    return dist;
  }
}