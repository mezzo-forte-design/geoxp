
import GeoManager from './GeoManager';
import AudioManager from './AudioManager';

export default class GeoXp {
  constructor(config) {
    console.log('hello geoXp');
    /**
    config: {
      geo: {
        position: [{
          _id;
          label;
          lat;
          lon;
          radius;    [m]
          deadband;  [m]
          fetch;     (1) 1 : n, ratio of radius for preloading 
        }];
        default: {
          minAccuracy;
          posDeadband;
          playDistance;
          fetchDistance;
        };
      }
      audio: [{
        _id;
        label;
        url;
      }]
      itinerary: {
        label;
        enable;
        overlap: 
        spot: [{
          position;
          audio;
          after;
        }];
      };
    }
    */

    this._config = config;
    this.geo = new GeoManager(config.geo);
    this.audio = new AudioManager(config.audio);

    this.visited = [];
    this.active = [];

    // subscribes to geo position updates
    // incoming spots
    this.subGeoIncoming = this.geo.incoming$
      .subscribe( incoming => {
        console.log('uoooooo');
        // checks if position is on itinerary, then load if needed
        const spots = this._config.itinerary.spot.filter(e => e.position === inside);
        spots.forEach( spot => {
          
          // preload spot audio
          this.audio.load(spot.audio, spot._id);
        });
      });
    
    // inside spots
    this.subGeoInside = this.geo.inside$
      .subscribe( inside => { 

        // checks if position is on itinerary, then play if needed
        const spots = this._config.itinerary.spot.filter(e => e.position === inside);
        spots.forEach( spot => {
    
          // for each spot linked to position
          if (!this.visited.includes(spot._id)) {
    
            // first time
            if (!spot.after || this.visited.includes(spot.after)) {
    
              // spot order ok
              if (config.itinerary.overlap || this.active.length == 0) {
    
                // overlap ok
                if (!this.active.includes(spot._id)) {
                  this.active.push(spot._id);
                }

                // play audio
                this.audio.play(spot.audio, spot._id);
              }
            }
            // else {
            //   // preload audio for previous spot 
            //   this.audio.load(spot.audio);
            // }
          } else {
            // times after first
            console.log('already visited!')
          }
        });
      });


    // outgoing spot
    this.subGeoOutgoing = this.geo.outgoing$
      .subscribe( outgoing => {
        // spot outgoing, stops audio
        const spots = this._config.itinerary.spot.filter(e => e.position === outgoing);
        spots.forEach( spot => {

          if (this.active.includes(spot._id)) {

            // if spot is active, stop audio and remove
            this.audio.stop(spot.audio, 5000);
            this.active = this.active.filter(e => e !== spot._id);
          }
        });
      });

    // subscribes to audio player updates
    // sound playing
    this.subAudioPlay = this.audio.play$
      .subscribe( audio => {
        if (audio.spot) {
          const spot = this._config.itinerary.spot.find(e => e._id === audio.spot);
          if (!this.visited.includes(spot._id)) {
            this.visited.push(spot._id);
          }
        }
      });

    // sound finished
    this.subAudioDone = this.audio.done$
      .subscribe( audio => {

        if (audio.spot) {
          const spot = this._config.itinerary.spot.find(e => e._id === audio.spot);
          if (this.active.includes(spot._id)) {

            // if spot is active, remove
            this.active = this.active.filter(e => e !== spot._id);
          }
        }

        // resend active spots notification
        this.geo.refresh();
      });
  }

  reload(config) {
    this._config = config;
    this.geo.reload(config.geo);
    this.audio.reload(config.audio);

    this.visited = [];
    this.active = [];
  }

  destroy() {
    this.subAudioDone.unsubscribe();
    this.subAudioPlay.unsubscribe();
    this.subGeoInside.unsubscribe();
    this.subGeoOutgoing.unsubscribe();
    this.subGeoIncoming.unsubscribe();
    this.geo.unload();
    this.audio.unload();
  }
}