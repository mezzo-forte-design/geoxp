import { Subject } from 'rxjs';

/**
 * Creates ItineraryManager class.
 * ItineraryManager manages the itinerary spots
 * @param config - Config options for init
 * @returns { Object } - ItineraryManager instance
 * @constructor
 */
export default class ItineraryManager {
  constructor(config) {
    /**
   config: [{
      label
      enable
      overlap: 
      spot: [{
          position
          audio
          after
      }]
    }]
    */

    // creates subjects for notification
    this.audioLoad$ = new Subject();
    this.audioPlay$ = new Subject();
    this.audioStop$ = new Subject();
    this.geoRefresh$ = new Subject();

    // creates itineraries
    this._itineraries = new Map();

    // inits the instance based on config
    this._init(config);
  }

  /**
  * Inits ItineraryManager on provided options
  * @param config - config parameters
  */
  _init(config) {
    this._config = config;
    this._loadItineraries();
  }

  /**
  * Builds all enabled itineraries
  */
  _loadItineraries() {

    // clears all
    if(this._itineraries) {
      this._itineraries.clear();
    }

    // builds all enabled itineraries
    this._config.forEach(cfg => {
      if (cfg.enabled) {
        const itin = {
          cfg,
          visited: [],
          active: []
        };

        this._itineraries.set(cfg._id, itin);
      }
    });
  }

  /**
  * Loads a new config
  * @param config - config parameters
  */
  reload(config) {
    this._init(config);
  }

  /**
  * Unloads all object memories and subscriptions
  */
  unload() {
    // Nothing to do
  }

  /**
  * Enables/disables specific itinerary
  * @param id - itinerary id to toggle
  * @param enb - flag for enable/disable
  */
  enableItinerary(id, enb) { 
    const itinerary = this._itineraries.get(id);
    if (itinerary) {
      itinerary.cfg.enabled = enb;
    }

    // reloads itineraries
    this._loadItineraries();
  }

  /**
  * New incoming position, prefetch audio
  * @param position - incoming position
  */
  incoming(position) {

    // for each enabled itinerary
    this._itineraries.forEach( itinerary => {

      // checks if position is on itinerary, then load if needed
      const spots = itinerary.cfg.spot.filter((e) => e.position === position);
      spots.forEach((spot) => {
  
        // preload spot audio
        this.audioLoad$.next(spot.audio);
      });
    });
  }

  /**
  * New inside position, play audio if needed
  * @param position - inside positon
  */
  inside(position) {

    // for each enabled itinerary
    this._itineraries.forEach( itinerary => {

      // checks if position is on itinerary, then play if needed
      const spots = itinerary.cfg.spot.filter((e) => e.position === position);
      spots.forEach((spot) => {

        // for each spot linked to position
        if (!itinerary.visited.includes(spot._id)) {

          // first time
          if (!spot.after || itinerary.visited.includes(spot.after)) {

            // spot order ok
            if (itinerary.cfg.overlap || itinerary.active.length == 0) {

              // overlap ok
              if (!itinerary.active.includes(spot._id)) {
                itinerary.active.push(spot._id);
              }

              // play audio
              this.audioPlay$.next(spot.audio);
            }
          }
        } else {

          // times after first
          console.log("already visited!");
        }
      });
    });
  }

  /**
  * New outgoing position, stops audio
  * @param position - outgoing position
  */
  outgoing(position) {

    // for each enabled itinerary
    this._itineraries.forEach( itinerary => {

      // spot outgoing, stops audio
      const spots = itinerary.cfg.spot.filter((e) => e.position === position);
      spots.forEach((spot) => {

        if (itinerary.active.includes(spot._id)) {

          // if spot is active, stop audio and remove
          itinerary.active = itinerary.active.filter((e) => e !== spot._id);

          this.audioStop$.next(spot.audio);
        }
      });
    });
  }

  /**
  * Spot is playing, make it visited
  * @param id - audio playing
  */
  playing(id) {

    if (!id) {
      console.error('[ItineraryManager.playing] - id missing');
    }

    // mark visisted for all spots linked to the audio
    this._itineraries.forEach(itinerary => {
      
      const spots = itinerary.cfg.spot.filter((e) => e.audio === id);
      spots.forEach(spot => {

        // mark spot visited
        if (!itinerary.visited.includes(spot._id)) {
          itinerary.visited.push(spot._id)
        }
      });
    });
  }
   
  /**
  * Spot ended (either stopped or finished), remove from active, refresh all inside positions
  * @param id - audio ended
  */
  end(id) {

    if (!id) {
      console.error('[ItineraryManager.end] - id missing');
    }

    // removes from active all spots linked to the audio
    this._itineraries.forEach(itinerary => {
      
      const spots = itinerary.cfg.spot.filter((e) => e.audio === id);
      spots.forEach(spot => {

        // remove from active
        itinerary.active = itinerary.active.filter((e) => e !== spot._id);
      });
    });

    // request for positions refresh
    // this is meant for spots concurrency order management
    this.geoRefresh$.next();
  }
}
