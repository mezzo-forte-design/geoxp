
import GeoManager from './GeoManager';
import AudioManager from './AudioManager';

export default class GeoXp {
  constructor(config) {
    console.log('hello geoXp');
    /**
    config: {
      positions: [{
        _id;
        label;
        lat;
        lon;
        radius;    [m]
        deadband;  [m]
      }];
      audio: [{
        _id;
        label;
        url;
        pan;  -1 L .. 0 .. 1 R
        volume; 0 .. 1
      }]
      itinerary: {
        label;
        enable;
        spot: [{
          position;
          audio [];
          after;
        }];
      };
      default: {
        minAccuracy;
        playDistance;
        posDeadband;
      };
    }
    */

    this._config = config;
    this.geo = new GeoManager(_config);
    this.audio = new AudioManager(_config);

    this._visited = [];

    this.subGeoInside = this.geo.inside$
      .subscribe( inside => {
        
        inside.forEach( posId => {
          // checks if position is on itinerary
          const spots = this.config.itinerary.spot.filter( e => e.position === posId);
          spots.forEach( spot => {
            if (!this._visited.includes(spot._id)) {
              // first time
             if (!spot.after || this._visited.includes(spot.after)) {
                // spot order ok
                this.audio.play(spot.audio);
             }
           }
          });
        });

      });
  }


}