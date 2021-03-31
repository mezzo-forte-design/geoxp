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
    config: {
      route: [{
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
      }],
      default: {
        visitedFilter [s]
      }
    }
    */

    // creates subjects for notification
    this.spotIncoming$ = new Subject();
    this.spotActive$ = new Subject();
    this.spotVisited$ = new Subject();
    this.spotOutgoing$ = new Subject();
    this.geoRefresh$ = new Subject();

    // creates routes
    this._routes = new Map();

    // inits the instance based on config
    this._init(config);
  }

  /**
  * Inits ItineraryManager on provided options
  * @param config - config parameters
  */
  _init(config) {
    if (!config.default) {
      config.default = {
        visitedFilter: 3
      }
    }

    this._config = config;
    this._loadRoutes();
  }

  /**
  * Builds all enabled routes
  */
   _loadRoutes() {

    // clears all
    if(this._routes) {
      this._routes.clear();
    }

    // builds all enabled routes
    this._config.route.forEach(cfg => {
      if (!cfg.disabled) {
        const route = {
          cfg,
          visited: [],
          inside: [],
          active: []
        };

        this._routes.set(cfg._id, route);
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
  * Enables/disables specific route
  * @param id - itinerary id to toggle
  * @param enb - flag for enable/disable
  */
  enableRoute(id, enb) { 
    const route = this._routes.get(id);
    if (route) {
      route.cfg.disabled = !enb;
    } else {
      console.error('[GeoManager.enableRoute] - Route id not found, cannot enable');
      return;
    }

    // reloads routes
    this._loadRoutes();
  }

  /**
  * New incoming position, prefetch audio
  * @param position - incoming position
  */
  incoming(position) {

    // for each enabled itinerary
    this._routes.forEach( route => {
      // checks if position is on itinerary, then load if needed
      const spots = route.cfg.spot.filter((e) => e.position === position);
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
    this._routes.forEach( route => {

      // checks if position is on itinerary, then play if needed
      const spots = route.cfg.spot.filter((e) => e.position === position);

      // evaluates each spot to check if something's to play
      spots.forEach((spot) => {

        // for each spot linked to position
        if (route.cfg.replay || !route.visited.includes(spot._id)) {
          
          // first time
          if (!spot.after || route.visited.includes(spot.after)) {

            // spot order ok
            if (route.cfg.overlap || route.active.length == 0) {

              // overlap ok
              if (!route.active.includes(spot._id)) {
                route.active.push(spot._id);
              }

              // play audio
              this.spotActive$.next(spot);
            }
          }
        }
      });

      // reevaluates each spot to check if visited
      spots.forEach((spot) => {
        if (!route.cfg.replay && route.visited.includes(spot._id)) {
          setTimeout(() => {
            // waits to see if somthing goes active
            if (route.inside.includes(spot._id) && route.active.length == 0) {
              this.spotVisited$.next(spot);
            }
          }, this._config.default.visitedFilter);
        }
      });

      // reevaluates each spot to check when first inside
      spots.forEach((spot) => {
        // inside spot
        if (!route.inside.includes(spot._id)) {
          route.inside.push(spot._id);
        }
      });
    });
  }

  /**
  * New outgoing position, stops audio
  * @param position - outgoing position
  */
  outgoing(position) {

    // for each enabled route
    this._routes.forEach( route => {

      // spot outgoing, stops audio
      const spots = route.cfg.spot.filter((e) => e.position === position);
      spots.forEach((spot) => {

        if (route.inside.includes(spot._id)) {

          // if spot is inside, remove
          route.inside = route.inside.filter((e) => e !== spot._id);
        }

        if (route.active.includes(spot._id)) {

          // if spot is active, stop audio and remove
          route.active = route.active.filter((e) => e !== spot._id);

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
      console.error('[ItineraryManager.playing] - audio id missing');
    }

    // mark visisted for all spots linked to the audio
    this._routes.forEach(route => {
      
      const spots = route.cfg.spot.filter((e) => e.audio === id);
      spots.forEach(spot => {

        // mark spot active (if isn't already)
        if (!route.active.includes(spot._id)) {
          route.active.push(spot._id)
        }

        // mark spot visited
        if (!route.visited.includes(spot._id)) {
          route.visited.push(spot._id)
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
      console.error('[ItineraryManager.end] - audio id missing');
    }

    // removes from active all spots linked to the audio
    this._routes.forEach(route => {
      
      const spots = route.cfg.spot.filter((e) => e.audio === id);
      spots.forEach(spot => {

        // remove from active
        route.active = route.active.filter((e) => e !== spot._id);
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
    this._routes.forEach(route => {
      if(route.active.length > 0){
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
    this._routes.forEach(route => {
      const found = route.cfg.spot.find(e => e._id.toUpperCase() === spotId.toUpperCase());
      if (found) {
        spot = found;
      }
    });
    return spot;
  }

  /**
  * Marks spots as unvisited
  * If no spot id provided, marks all inside spots as unvisited
  * @param id - optional
  */
  replaySpot(id = null) {
    this._routes.forEach(route => {
      if (id) {

        // mark specific spot as unvisited
        if (route.visited.includes(id)) {
          route.visited = route.visited.filter((e) => e !== spot._id);
        }
      } else {

        // remove all inside if not active from visited
        route.visited = route.visited.filter((e) => {!route.inside.includes(e) || route.active.includes(e)});
      }
    });

    // request for positions refresh
    this.geoRefresh$.next();
  }

  /**
  * Forces spot activation
  * Forces other spots deactivation unless overlapping
  * @param id - spot id
  * */
  forceSpot(id) {

    if (!id) {
      console.error('[ItineraryManager.forceSpot] - spot id not provided, cannot activate');
      return;
    }

    this._routes.forEach(route => {

      // checks if spot actually exist in route
      const spot = route.cfg.spot.find(e => e._id === id);
      if(spot) {

        // if there are spots active on non overlapping route
        if (route.active.length > 0 && !route.cfg.overlap) {

          // for each active spot
          route.active.forEach(active => {

            const toDeactivate = route.cfg.spot.find(e => e._id === active);

            // removes from active spots
            route.active = route.active.filter(e => e._id !== toDeactivate._id);

            // deactivates spot by outgoing it
            this.spotOutgoing$.next(toDeactivate);
          });
        }

        // adds to active spots
        if(!route.active.includes(spot._id)) {
          route.active.push(spot._id);
        }

        // activates required spot
        this.spotActive$.next(spot);
      }
    });
  }


}
