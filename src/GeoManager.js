import { Subject } from 'rxjs';
import { Device } from './utils';

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

export default class GeoManager {
  constructor(config) {

    // bind listeners
    this._geoSuccess = this._geoSuccess.bind(this);
    this._geoError = this._geoError.bind(this);


    this.inside$ = new Subject();
    this.incoming$ = new Subject();
    this.outgoing$ = new Subject();
    this.position$ = new Subject();
    this.error$ = new Subject();

    this._init(config);
  }

  reload(config) {
    this._init(config);
  }

  unload() {
    if (this._GEO_WATCH) {
      navigator.geolocation.clearWatch(this._GEO_WATCH);
    }
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
        fetch;     1 : n ratio of radius for prefetching
      }];
      default: {
        minAccuracy;
        playDistance;
        posDeadband;
        fetchDistance;
      };
    }
    */
   
    this._config = config;
    this.inside = [];
    this.position;

    // Listens for GPS position
    if(this._GEO_WATCH) {
      navigator.geolocation.clearWatch(this._GEO_WATCH);
    }
    this._GEO_WATCH = navigator.geolocation.watchPosition(this._geoSuccess, this._geoError, Device.geolocationOpts);
  }

  refresh() {
    this.inside.forEach( position => {
      this.inside$.next(position);
    });
  }

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

  _geoError(error) {
    console.error('[GeoManager._geoError] - Geolocation error - Nessuna posizione disponibile');
    this.error$.next(error.msg);
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