import { Observable } from 'rxjs';
import { Device } from './utils';

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

export default class GeoManager {
  constructor(config) {

    this.inside$ = new Observable();
    this.position$ = new Observable();
    this.error$ = new Observable();

    this._init(config);
  }

  _init(config) {
    /**
    config: {
      position: [{
        _id;
        label;
        lat;
        lon;
        radius;    [m]
        deadband;  [m]
      }];
      default: {
        minAccuracy;
        playDistance;
        posDeadband;
      };
    }
    */
   
    this._config = config;
    this._inside = [];
    this.position;

    // Listens for GPS position
    this._GEO_WATCH = navigator.geolocation.watchPosition(this._geoSuccess, this._geoError, Device.geolocationOpts);
  }

  _geoSuccess(position) {

    // Notify new position
    this.position = position;
    this.position$.of(position);

    // exec only if position.coords.accuracy is < a given threshold (to define)
    if (position.coords.accuracy > options.default.minAccuracy) {
      return;
    }

    this.config.position.forEach((position, index) => {
      // calc distance [m]
      const dist = this._calcGeoDistance(position.coords.longitude, position.coords.latitude, position.lon, position.lat);

      // TODO // prefetch song
      // if (dist * 1000 <= targetsConfig.fetchDistance) {
      //   // TODO - this._insideFetchArea(spot);
      //   // console.log(`Close to ${spot.name}: ${(dist * 1000).toFixed(1)} m`)
      //   this._log('close', `<span>Close to ${spot.audio}: ${(dist * 1000).toFixed(1)} m</span>`, true);
      // }

      let changed = false;

      // play (check if spot has custom radius, otherwise use general play distance)
      if (dist <= (position.radius || options.default.playDistance) - (position.deadband || options.default.posDeadband)) {
        // inside play area
        if (!this._inside.includes(position._id)) {
          this._inside.push(position._id);
          changed = true;
        }

      } else if (dist > (position.radius || options.default.playDistance) + (position.deadband || options.default.posDeadband)) {
        // outside play area
        if (!this._inside.includes(position._id)) {
          this.inside = this.inside.filter(e => e !== position._id);
          changed = true;
        }
      }

      // if inside changed, notify
      if (changed) this.inside$.of(this._inside);
    });
  }

  _geoError(error) {
    console.error('[GeoManager._geoError] - Geolocation error - Nessuna posizione disponibile');
    this.error$.of(error.msg);
  }

  _calcGeoDistance(lon1, lat1, lon2, lat2) {
    // Radius of the earth in km
    var EARTH_R = 6371;

    // Javascript functions in radians
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();

    //
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    //
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in m
    const dist = EARTH_R * c * 1000;
    return dist;
  }
}