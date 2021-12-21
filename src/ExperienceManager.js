/** @module ExperienceManager */

import { Subject } from 'rxjs';

import { isNumber, setCookie, getCookie, deleteCookie } from './utils/helpers';

import {
  DEFAULT_VISITED_FILTER_TIME,
  DEFAULT_PATTERN_COOKIE_PREFIX,
  DEFAULT_PATTERN_COOKIE_EXPIRATION
} from './constants';

/**
 * Creates ExperienceManager class.
 * ExperienceManager provides rules for geolocalized audio playback
 * @param { Object } config - Experience config options
 * @returns { Object } ExperienceManager instance
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
            id
            position
            audio
            after
            notAfter
        }]
      }],
      options: {
        visitedFilter [ms]
        cookies: {
          deleteOnLastSpot
          deleteOnCompletion
          expiration [min]
        }
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
  * @param { Object } config - Experience config options
  */
  _init(config) {
    // check options
    if (!config.options) {
      config.options = {
        visitedFilter: DEFAULT_VISITED_FILTER_TIME,
        cookies: null
      };
    } else {

      config.options.visitedFilter = isNumber(config.options.visitedFilter) ?
        config.options.visitedFilter :
        DEFAULT_VISITED_FILTER_TIME;

      // check cookies
      if (config.options.cookies
      && !config.options.cookies.deleteOnLastSpot
      && !config.options.cookies.deleteOnCompletion) {

        // defaults to deleteOnCompletion
        config.options.cookies = {
          deleteOnCompletion: true
        };
      }
    }

    // inits force spot
    this.forced = null;

    // sets config
    this._config = config;

    // reloads patterns
    this._loadPatterns(true);
  }

  /**
  * Builds all enabled patterns
  * @param { boolean } [restart = false] - inits pattern spot memories
  */
  _loadPatterns(restart = false) {

    // clears all
    if (this._patterns && restart) {
      this._patterns.clear();
    }

    // builds all enabled patterns
    this._config.patterns.forEach(cfg => {

      const pattern = this._patterns.get(cfg.id);

      if (pattern) {

        // pattern alredy exists, change cfg info
        pattern.cfg = cfg;

      } else {

        // checks for cookies
        let visited = [];
        const cName = `${DEFAULT_PATTERN_COOKIE_PREFIX}-${cfg.id}`;

        if (this._config.options.cookies) {

          // cookies enabled, reload visited spots
          const cookie = getCookie(cName);
          if (cookie) visited = JSON.parse(cookie);
        } else {

          // cookies disabled, delete cookies if present
          deleteCookie(cName);
        }

        // new pattern, add to map
        const toAdd = {
          cfg,
          visited,
          inside: [],
          active: []
        };

        this._patterns.set(cfg.id, toAdd);
      }
    });
  }

  /**
  * Loads a new config
  * @param { Object } config - Experience config options
  */
  reload(config) {
    this._init(config);
    console.log('config', config);
  }

  /**
  * Unloads all object memories and subscriptions
  */
  unload() {
    this.clearCookies();
  }

  /**
  * Clears pattern cookies, if no pattern specified, clears all
  * @param { string } id - id of pattern to clear
  */
  clearCookies(id) {

    if (id) {

      const pattern = this._config.patterns.find(e => e.id === id);
      if (pattern) {

        // delete cookies if present
        const cName = `${DEFAULT_PATTERN_COOKIE_PREFIX}-${pattern.id}`;
        deleteCookie(cName);
      }
    } else {
      this._config.patterns.forEach(cfg => {

        // delete cookies if present
        const cName = `${DEFAULT_PATTERN_COOKIE_PREFIX}-${cfg.id}`;
        deleteCookie(cName);
      });
    }
  }

  /**
  * Enables specific pattern
  * @param { string } id - pattern id to enable
  */
  enablePattern(id) {

    // finds pattern in map
    const pattern = this._patterns.get(id);
    if (pattern) {

      // pattern enabled
      pattern.cfg.disabled = false;

      // calls for geo refresh
      this.geoRefresh$.next();

    } else {
      console.error('[GeoManager.enablePattern] - Pattern id not found, cannot enable');
      return;
    }
  }

  /**
  * Disables specific pattern
  * @param { string } id - pattern id to disable
  */
  disablePattern(id) {

    // finds pattern in map
    const pattern = this._patterns.get(id);
    if (pattern) {

      // pattern disabled
      pattern.cfg.disabled = true;
    } else {
      console.error('[GeoManager.disablePattern] - Pattern id not found, cannot disable');
      return;
    }

    // reloads patterns
    this._loadPatterns();
  }

  /**
  * New incoming position, prefetch audio
  * @param { string } position - incoming position id
  */
  incoming(position) {

    // for each pattern
    this._patterns.forEach(pattern => {

      // checks if pattern enabled
      if (!pattern.cfg.disabled) {

        // checks if position is on pattern, then load if needed
        const spots = pattern.cfg.spots.filter((e) => e.position === position);
        spots.forEach((spot) => {

          // preload spot
          this.spotIncoming$.next(spot);
        });
      }
    });
  }

  /**
  * New inside position, play audio if needed
  * @param { string } position - inside positon id
  */
  inside(position) {

    // for each pattern
    this._patterns.forEach(pattern => {

      // checks if pattern enabled
      if (!pattern.cfg.disabled) {

        // checks if position is on pattern, then play if needed
        const spots = pattern.cfg.spots.filter((e) => e.position === position);

        // evaluates each spot to check if something's to play
        spots.forEach((spot) => {

          // for each spot linked to position
          // first time
          if (pattern.cfg.replay || !pattern.visited.includes(spot.id)) {

            // spot order ok
            if ((!spot.after || pattern.visited.includes(spot.after))
              && (!spot.notAfter || !pattern.visited.includes(spot.notAfter))) {

              // overlap ok
              if (pattern.cfg.overlap || pattern.active.length === 0) {

                if (!pattern.active.includes(spot.id)) {
                  pattern.active.push(spot.id);
                }

                const info = {
                  spot,
                  overlap: pattern.cfg.overlap
                };

                // play audio
                this.spotActive$.next(info);
              }
            }
          }
        });

        // reevaluates each spot to check if visited
        spots.forEach((spot) => {
          if (!pattern.cfg.replay && pattern.visited.includes(spot.id)) {

            // just when spot is first inside
            if (!pattern.inside.includes(spot.id)) {

              // waits to see if somthing goes active
              setTimeout(() => {

                // still inside and nothing active
                if (pattern.inside.includes(spot.id) && pattern.active.length === 0) {
                  this.spotVisited$.next(spot);
                }
              }, this._config.options.visitedFilter);
            }
          }
        });

        // reevaluates each spot to check when first inside
        spots.forEach((spot) => {
          // inside spot
          if (!pattern.inside.includes(spot.id)) {
            pattern.inside.push(spot.id);
          }
        });
      }
    });
  }

  /**
  * New outgoing position, stops audio
  * @param { string } position - outgoing position
  */
  outgoing(position) {

    // for each enabled pattern
    this._patterns.forEach(pattern => {

      // spot outgoing, stops audio
      const spots = pattern.cfg.spots.filter((e) => e.position === position);
      spots.forEach((spot) => {

        if (pattern.inside.includes(spot.id)) {

          // if spot is inside, remove
          pattern.inside = pattern.inside.filter((e) => e !== spot.id);
        }

        if (pattern.active.includes(spot.id)) {

          // if spot is active, stop audio and remove
          pattern.active = pattern.active.filter((e) => e !== spot.id);

          this.spotOutgoing$.next(spot);
        }
      });
    });
  }

  /**
  * Spot is playing, make it visited
  * @param { Object } spot - spot playing
  */
  playing(spot) {

    if (!spot) {
      console.error('[ExperienceManager.playing] - spot missing');
    }

    // marks spot visited
    this._patterns.forEach(pattern => {

      const _spot = pattern.cfg.spots.find(e => e.id === spot.id);
      if (_spot) {

        // mark spot active (if isn't already)
        if (!pattern.active.includes(_spot.id)) {
          pattern.active.push(_spot.id);
        }

        // mark spot visited
        if (!pattern.visited.includes(_spot.id)) {
          pattern.visited.push(_spot.id);
        }

        // cookies management
        if (this._config.options.cookies) {

          const cName = `${DEFAULT_PATTERN_COOKIE_PREFIX}-${pattern.cfg.id}`;

          // updates pattern visited spots cookie
          setCookie(cName, JSON.stringify(pattern.visited), this._config.options.cookies.expiration || DEFAULT_PATTERN_COOKIE_EXPIRATION);

          // eventual cookies deletion
          if (!this._config.options.cookies.deleteOnCompletion) {

            // deletes cookies on last spot
            if (this._config.options.cookies.deleteOnLastSpot && _spot.last) deleteCookie(cName);
          } else {

            // deletes cookies on pattern completion
            if (pattern.cfg.spots.filter(e => !pattern.visited.includes(e.id)).length <= 0) deleteCookie(cName);
          }
        }
      }

    });
  }

  /**
  * Spot ended (either stopped or finished), remove from active, refresh all inside positions
  * @param { Object } - spot ended
  */
  end(spot) {

    if (!spot) {
      console.error('[ExperienceManager.end] - spot missing');
    }

    let removeForce = false;

    // removes from active all spots linked to the audio
    this._patterns.forEach(pattern => {

      const _spot = pattern.cfg.spots.find(e => e.id === spot.id);
      if (_spot) {

        // remove from active
        pattern.active = pattern.active.filter((e) => e !== _spot.id);

        // if matches forced spot, remove force
        if (_spot.id === this.forced) {
          this.forced = null;
          removeForce = true;
        }
      }
    });

    // request for positions refresh
    // this is meant for spots concurrency order management
    if (!removeForce) {
      this.geoRefresh$.next();
    }

    // returns removeForce
    return removeForce;
  }

  /**
  * Checks to see if there's any active spots
  * @returns { boolean } Some spots are active
  */
  hasActiveSpots() {
    let someActive = false;
    this._patterns.forEach(pattern => {
      if (pattern.active.length > 0) {
        someActive = true;
      }
    });
    return someActive;
  }

  /**
  * Gets visited spots for a given pattern
  * @param { string } id - pattern id
  * @returns { string[]|null } array of visited spots
  */
  getVisitedSpots(id) {
    const pattern =  this._patterns.get(id);
    if (!pattern) {
      console.error('[GeoXp.ExperienceManager.getVisitedSpots] - Pattern not found!');
      return;
    }

    return pattern.visited;
  }

  /**
  * Gets spot by id
  * @param { string } id - id of spot to find
  * @returns { object|null } spot found or null
  */
  getSpot(id) {
    let spot = null;
    this._patterns.forEach(pattern => {
      const found = pattern.cfg.spots.find(e => e.id.toUpperCase() === id.toUpperCase());
      if (found) {
        spot = found;
      }
    });
    return spot;
  }

  /**
  * Marks spots as unvisited.
  * If no spot id provided, marks all inside spots as unvisited
  * @param { string } [id = null] - id of spot to unvisit
  */
  replaySpot(id = null) {
    this._patterns.forEach(pattern => {
      if (id) {

        // mark specific spot as unvisited
        if (pattern.visited.includes(id)) {
          pattern.visited = pattern.visited.filter((e) => e !== id);
        }
      } else {

        // remove all inside if not active from visited
        pattern.visited = pattern.visited.filter(e => !pattern.inside.includes(e) || pattern.active.includes(e));
      }
    });

    // request for positions refresh
    this.geoRefresh$.next();
  }

  /**
  * Forces spot activation
  * Forces other spots deactivation unless overlapping
  * @param { string } id - id of spot to force
  * */
  forceSpot(id) {

    if (!id) {
      console.error('[ExperienceManager.forceSpot] - spot id not provided, cannot activate');
      return;
    }

    this._patterns.forEach(pattern => {

      // checks if spot actually exist in pattern
      const spot = pattern.cfg.spots.find(e => e.id === id);
      if (spot) {

        // checks if pattern enabled
        if (pattern.cfg.disabled) {
          console.error('[ExperienceManager.forceSpot] - pattern is disabled, cannot force');
          return;
        }

        // if there are spots active
        if (pattern.active.length > 0) {

          // for each active spot
          pattern.active.forEach(active => {

            const toDeactivate = pattern.cfg.spots.find(e => e.id === active);

            // removes from active spots
            pattern.active = pattern.active.filter(e => e.id !== toDeactivate.id);

            // deactivates spot by outgoing it
            this.spotOutgoing$.next(toDeactivate);
          });
        }

        // adds to active spots
        if (!pattern.active.includes(spot.id)) {
          pattern.active.push(spot.id);
        }

        // activates required spot
        const info = {
          spot,
          overlap: pattern.overlap
        };
        this.spotActive$.next(info);

        // sets spot forced
        this.forced = spot.id;
      }
    });
  }
}
