import { Subject } from 'rxjs';

export default class ItineraryManager {
  constructor(config) {
    /**
   config: {
      label
      enable
      overlap: 
      spot: [{
          position
          audio
          after
      }]
    }
    */

    this.audioLoad$ = new Subject();
    this.audioPlay$ = new Subject();
    this.audioStop$ = new Subject();
    this.geoRefresh$ = new Subject();

    this._init();
  }

  _init() {
    this._config = config;

    this.visited = [];
    this.active = [];
  }

  reload() {
    this._init(config);
  }

  unload() {
    // Nothing to do
  }

  // incoming position
  incoming(position) {

    // checks if position is on itinerary, then load if needed
    const spots = this._config.spot.filter((e) => e.position === position);
    spots.forEach((spot) => {

      // preload spot audio
      this.audioLoad$.next(spot);
    });
  }

  // inside position
  inside(position) {

    // checks if position is on itinerary, then play if needed
    const spots = this._config.spot.filter((e) => e.position === position);
    spots.forEach((spot) => {
      // for each spot linked to position
      if (!this.visited.includes(spot._id)) {
        // first time
        if (!spot.after || this.visited.includes(spot.after)) {
          // spot order ok
          if (this._config.overlap || this.active.length == 0) {
            // overlap ok
            if (!this.active.includes(spot._id)) {
              this.active.push(spot._id);
            }

            // play audio
            this.audioPlay$.next(spot);
          }
        }
        // else {
        //   // preload audio for previous spot
        //   this.audio.load(spot.audio);
        // }
      } else {
        // times after first
        console.log("already visited!");
      }
    });
  }

  // outgoing spot
  outgoing(position) {

    // spot outgoing, stops audio
    const spots = this._config.spot.filter((e) => e.position === position);
    spots.forEach((spot) => {

      if (this.active.includes(spot._id)) {

        // if spot is active, stop audio and remove
        this.audioStop$.next(spot);
        this.active = this.active.filter((e) => e !== spot._id);
      }
    });
  }

  
  // sound playing
  playing(audio) {
    if (audio.spot) {

      // mark spot visited
      const spot = this._config.spot.find((e) => e._id === audio.spot);
      if (!this.visited.includes(spot._id)) {
        this.visited.push(spot._id);
      }
    }
  }
   
  // sound ended
  end(audio) {
    if (audio.spot) {

      // remove from active spots
      const spot = this._config.itinerary.spot.find((e) => e._id === audio.spot);
      if (this.active.includes(spot._id)) {
        this.active = this.active.filter((e) => e !== spot._id);
      }
    }

    // request for positions refresh
    this.geoRefresh$.next();
  }
}
