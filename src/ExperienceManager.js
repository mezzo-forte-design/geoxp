import { Subject } from 'rxjs';

/**
 * Creates ExperienceyManager class.
 * ExperienceManager manages the Experience spots
 * @param config - Config options for init
 * @returns { Object } - ExperienceManager instance
 * @constructor
 */
export default class ExperienceManager {
  constructor(config) {
    /**
    config: {
      patterns: [{
        label
        disabled
        replay
        overlap
        spots: [{
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

    // creates patterns
    this._patterns = new Map();

    // inits the instance based on config
    this._init(config);
  }

  /**
  * Inits ExperienceManager on provided options
  * @param config - config parameters
  */
  _init(config) {
    if (!config.default) {
      config.default = {
        visitedFilter: 5000
      }
    }

    this._config = config;
    this._loadPatterns();
  }

  /**
  * Builds all enabled patterns
  */
   _loadPatterns() {

    // clears all
    if(this._patterns) {
      this._patterns.clear();
    }

    // builds all enabled patterns
    this._config.patterns.forEach(cfg => {
      if (!cfg.disabled) {
        const pattern = {
          cfg,
          visited: [],
          inside: [],
          active: []
        };

        this._patterns.set(cfg._id, pattern);
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
  * Enables/disables specific pattern
  * @param id - pattern id to toggle
  * @param enb - flag for enable/disable
  */
  enablePattern(id, enb) { 
    const pattern = this._patterns.get(id);
    if (pattern) {
      pattern.cfg.disabled = !enb;
    } else {
      console.error('[GeoManager.enablePattern] - Pattern id not found, cannot enable');
      return;
    }

    // reloads patterns
    this._loadPatterns();
  }

  /**
  * New incoming position, prefetch audio
  * @param position - incoming position
  */
  incoming(position) {

    // for each enabled pattern
    this._patterns.forEach( pattern => {
      // checks if position is on pattern, then load if needed
      const spots = pattern.cfg.spots.filter((e) => e.position === position);
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

    // for each enabled pattern
    this._patterns.forEach( pattern => {

      // checks if position is on pattern, then play if needed
      const spots = pattern.cfg.spots.filter((e) => e.position === position);

      // evaluates each spot to check if something's to play
      spots.forEach((spot) => {

        // for each spot linked to position
        if (pattern.cfg.replay || !pattern.visited.includes(spot._id)) {
          
          // first time
          if (!spot.after || pattern.visited.includes(spot.after)) {

            // spot order ok
            if (pattern.cfg.overlap || pattern.active.length == 0) {

              // overlap ok
              if (!pattern.active.includes(spot._id)) {
                pattern.active.push(spot._id);
              }

              // play audio
              this.spotActive$.next(spot);
            }
          }
        }
      });

      // reevaluates each spot to check if visited
      spots.forEach((spot) => {
        if (!pattern.cfg.replay && pattern.visited.includes(spot._id)) {
          setTimeout(() => {
            // waits to see if somthing goes active
            if (pattern.inside.includes(spot._id) && pattern.active.length == 0) {
              this.spotVisited$.next(spot);
            }
          }, this._config.default.visitedFilter);
        }
      });

      // reevaluates each spot to check when first inside
      spots.forEach((spot) => {
        // inside spot
        if (!pattern.inside.includes(spot._id)) {
          pattern.inside.push(spot._id);
        }
      });
    });
  }

  /**
  * New outgoing position, stops audio
  * @param position - outgoing position
  */
  outgoing(position) {

    // for each enabled pattern
    this._patterns.forEach( pattern => {

      // spot outgoing, stops audio
      const spots = pattern.cfg.spots.filter((e) => e.position === position);
      spots.forEach((spot) => {

        if (pattern.inside.includes(spot._id)) {

          // if spot is inside, remove
          pattern.inside = pattern.inside.filter((e) => e !== spot._id);
        }

        if (pattern.active.includes(spot._id)) {

          // if spot is active, stop audio and remove
          pattern.active = pattern.active.filter((e) => e !== spot._id);

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
      console.error('[ExperienceManager.playing] - audio id missing');
    }

    // mark visisted for all spots linked to the audio
    this._patterns.forEach(pattern => {
      
      const spots = pattern.cfg.spots.filter((e) => e.audio === id);
      spots.forEach(spot => {

        // mark spot active (if isn't already)
        if (!pattern.active.includes(spot._id)) {
          pattern.active.push(spot._id)
        }

        // mark spot visited
        if (!pattern.visited.includes(spot._id)) {
          pattern.visited.push(spot._id)
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
      console.error('[ExperienceManager.end] - audio id missing');
    }

    // removes from active all spots linked to the audio
    this._patterns.forEach(pattern => {
      
      const spots = pattern.cfg.spots.filter((e) => e.audio === id);
      spots.forEach(spot => {

        // remove from active
        pattern.active = pattern.active.filter((e) => e !== spot._id);
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
    this._patterns.forEach(pattern => {
      if(pattern.active.length > 0){
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
    this._patterns.forEach(pattern => {
      const found = pattern.cfg.spots.find(e => e._id.toUpperCase() === spotId.toUpperCase());
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
    this._patterns.forEach(pattern => {
      if (id) {

        // mark specific spot as unvisited
        if (pattern.visited.includes(id)) {
          pattern.visited = pattern.visited.filter((e) => e !== spot._id);
        }
      } else {

        // remove all inside if not active from visited
        pattern.visited = pattern.visited.filter((e) => {!pattern.inside.includes(e) || pattern.active.includes(e)});
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
      console.error('[ExperienceManager.forceSpot] - spot id not provided, cannot activate');
      return;
    }

    this._patterns.forEach(pattern => {

      // checks if spot actually exist in pattern
      const spot = pattern.cfg.spots.find(e => e._id === id);
      if(spot) {

        // if there are spots active on non overlapping pattern
        if (pattern.active.length > 0 && !pattern.cfg.overlap) {

          // for each active spot
          pattern.active.forEach(active => {

            const toDeactivate = pattern.cfg.spots.find(e => e._id === active);

            // removes from active spots
            pattern.active = pattern.active.filter(e => e._id !== toDeactivate._id);

            // deactivates spot by outgoing it
            this.spotOutgoing$.next(toDeactivate);
          });
        }

        // adds to active spots
        if(!pattern.active.includes(spot._id)) {
          pattern.active.push(spot._id);
        }

        // activates required spot
        this.spotActive$.next(spot);
      }
    });
  }


}
