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
      disabled
      replay
      overlap
      spot: [{
          _id
          position
          audio
          after
      }]
    }]
    */

    // creates subjects for notification
    this.spotIncoming$ = new Subject();
    this.spotActive$ = new Subject();
    this.spotVisited$ = new Subject();
    this.spotOutgoing$ = new Subject();
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
      if (!cfg.disabled) {
        const itin = {
          cfg,
          visited: [],
          inside: [],
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
      itinerary.cfg.disabled = !enb;
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
  
        // preload spot
        this.spotIncoming$.next(spot);
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

      // evaluates each spot to check if something's to play
      spots.forEach((spot) => {

        // for each spot linked to position
        if (itinerary.cfg.replay || !itinerary.visited.includes(spot._id)) {
          
          // first time
          if (!spot.after || itinerary.visited.includes(spot.after)) {

            // spot order ok
            if (itinerary.cfg.overlap || itinerary.active.length == 0) {

              // overlap ok
              if (!itinerary.active.includes(spot._id)) {
                itinerary.active.push(spot._id);
              }

              // play audio
              this.spotActive$.next(spot);
            }
          }
        }
      });

      // reevaluates each spot to check if visited
      spots.forEach((spot) => {
        if (!itinerary.cfg.replay && itinerary.visited.includes(spot._id)) {
          setTimeout(() => {
            // waits to see if somthing goes active
            if (itinerary.active.length == 0) {
              this.spotVisited$.next(spot);
            }
          }, 5000);
        }
      });

      // reevaluates each spot to check when first inside
      spots.forEach((spot) => {
        // inside spot
        if (!itinerary.inside.includes(spot._id)) {
          itinerary.inside.push(spot._id);
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

        if (itinerary.inside.includes(spot._id)) {

          // if spot is inside, remove
          itinerary.inside = itinerary.inside.filter((e) => e !== spot._id);
        }

        if (itinerary.active.includes(spot._id)) {

          // if spot is active, stop audio and remove
          itinerary.active = itinerary.active.filter((e) => e !== spot._id);

          this.spotOutgoing$.next(spot);
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

        // mark spot active (if isn't already)
        if (!itinerary.active.includes(spot._id)) {
          itinerary.active.push(spot._id)
        }

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

  /**
  * Checks to see if there are active spots
  */
  hasActiveSpots() {
    let somePlaying = false;
    this._itineraries.forEach(itinerary => {
      if(itinerary.active.length > 0){
        somePlaying = true;
      }
    });
    return somePlaying;
  }

  /**
  * Returns spot by id
  * @param spotId - Id of spot to find
  * @returns { object } - spot found or null
  */
  getSpot(spotId) {
    let spot = null;
    this._itineraries.forEach(itinerary => {
      const found = itinerary.cfg.spot.find(e => e._id.toUpperCase() === spotId.toUpperCase());
      if (found) {
        spot = found;
      }
    });
    return spot;
  }
}
