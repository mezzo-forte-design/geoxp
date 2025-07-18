/**
 * GeoXpCore provides content playback coordination based on user location
 * @module GeoXpCoreClass
 * */

import { isNumber } from '@geoxp/utils';
import type { Listener, Key } from '@geoxp/utils';
import { EventEmitter } from 'events';
import type { GeoXpSpot, GeoXpGeolocation, GetVisitedSpotsCallback } from './src/types/common';
import type { GeoXpCoreConfig, SanitisedConfig } from './src/types/config';
import type { GeoXpCorePattern, GeoXpCoreEvent } from './src/types/module';
import { forEachSpotInPatterns, getSpotDistances, getSpotFromRef, sanitiseConfig } from './src/utils';
import { FORCE_ACCURACY } from './src/constants';

/**
 * GeoXpCore provides content playback coordination based on user location
 */
export default class GeoXpCore {
  /**
   * Function to get stored visited spots
   * @param callback A function that:
   *   - takes the ID of pattern for storage retrieval as argument
   *   - returns an array of stored visited spotIds for a specific pattern
   *   - it can also return a Promise if using an asyncronous storage method (e.g. Node fs)
   *   - it returns undefined is no entries correspond to the provided ID
   */
  public set getStoredVisitedSpots(callback: GetVisitedSpotsCallback) {
    this._getStoredVisitedSpots = callback;
    this.loadPatterns(false);

    console.info('[GeoXpCore.getStoredVisitedSpots] storage reloaded');
  }

  public get getStoredVisitedSpots(): GetVisitedSpotsCallback | undefined {
    return this._getStoredVisitedSpots;
  }

  /**
   * @hidden
   */
  private _getStoredVisitedSpots?: GetVisitedSpotsCallback;

  /**
   * Function to set stored visited spots
   * @param patternId Id of pattern for storage retrieval
   * @param visited array of visited spotIds to store for a specific pattern
   */
  public setStoredVisitedSpots?: (patternId: string, visited: string[]) => Promise<void> | void;

  /**
   * Event emitter
   * @hidden
   */
  private readonly event = new EventEmitter<GeoXpCoreEvent>();

  /**
   * Core configuration
   * @hidden
   */
  private config: SanitisedConfig;

  /**
   * Patterns map
   * @hidden
   */
  private readonly patterns = new Map<string, GeoXpCorePattern>();

  /**
   * Current forced spot id
   * @hidden
   */
  private forced?: string;

  /**
   * Last location update
   * @hidden
   */
  private lastLocation?: GeoXpGeolocation;

  /**
   * Wheter to throw errors or just log
   * @hidden
   */
  private readonly throwErrors: boolean;

  /**
   * Constructor for GeoXpCore Class
   * @param config GeoXpCore configuration
   * @param options Options for GeoXpCore
   * @param options.throwErrors Whether errors should be throw or not. Throw is default behavior
   * @returns GeoXpCore singleton instance
   */
  constructor(
    config: GeoXpCoreConfig,
    options?: {
      throwErrors?: boolean;
    }
  ) {
    // wheter errors are thrown or not
    this.throwErrors = options?.throwErrors ?? true;

    // inits config
    this.config = sanitiseConfig(config);

    // inits the instance based on config
    this.init();

    console.info('[GeoXpCore] instance created');
  }

  /**
   * Handles errors
   * @hidden
   */
  private error(msg: string, ...args: unknown[]) {
    if (this.throwErrors) {
      throw new Error(msg);
    } else {
      console.error(msg, args);
    }
  }

  /**
   * Inits ExperienceManager on provided options
   * @param config Experience config options
   * @hidden
   */
  private init() {
    // reloads patterns
    this.loadPatterns(true);
  }

  /**
   * Builds all enabled patterns
   * @param restart [restart = false] inits pattern spot memories
   * @hidden
   */
  private async loadPatterns(restart = false) {
    if (!this.config) return;

    // clears all
    if (this.patterns && restart) {
      this.patterns.clear();
    }

    // builds all enabled patterns
    this.config.patterns.forEach(async (cfg) => {
      const pattern = this.patterns.get(cfg.id);

      if (pattern) {
        // pattern alredy exists, change cfg info
        pattern.cfg = cfg;

        // reload visited spots from storage
        if (this._getStoredVisitedSpots) {
          pattern.visited = (await this._getStoredVisitedSpots(cfg.id)) ?? [];
        }
      } else {
        // checks for stored visited spots
        let visited: string[] = [];
        if (this._getStoredVisitedSpots) {
          visited = (await this._getStoredVisitedSpots(cfg.id)) ?? [];
        }

        // new pattern, add to map
        const toAdd = {
          cfg,
          visited,
          inside: [],
          active: [],
        };

        this.patterns.set(cfg.id, toAdd);
      }
    });
  }

  /**
   * Loads a new config
   * @param config GeoXpCore configuration
   */
  public reload(config: GeoXpCoreConfig) {
    this.config = sanitiseConfig(config);
    this.init();
    console.info('[GeoXpCore.reload] config reloaded', config);
  }

  /**
   * Enables specific pattern
   * @param patternId pattern id to enable
   */
  public enablePattern(patternId: string) {
    // finds pattern in map
    const pattern = this.patterns.get(patternId);
    if (pattern) {
      // pattern enabled
      pattern.cfg.disabled = false;

      // trigger location refresh
      if (this.lastLocation) {
        this.geolocationUpdate(this.lastLocation);
      }
    } else {
      this.error(`[GeoXpCore.enablePattern] pattern id [${patternId}] not found, cannot enable`);
    }
  }

  /**
   * Disables specific pattern
   * @param patternId pattern id to disable
   */
  public disablePattern(patternId: string) {
    // finds pattern in map
    const pattern = this.patterns.get(patternId);
    if (pattern) {
      // pattern disabled
      pattern.cfg.disabled = true;
    } else {
      this.error(`[GeoXpCore.disablePattern] pattern id [${patternId}] not found, cannot disable`);
      return;
    }

    // reloads patterns
    this.loadPatterns();
  }

  /**
   * Checks to see if there's any active spots
   * @returns at least one spot is active
   */
  public hasActiveSpots() {
    let someActive = false;
    this.patterns.forEach((pattern) => {
      if (pattern.active.length > 0) {
        someActive = true;
      }
    });
    return someActive;
  }

  /**
   * Gets visited spots for a given pattern
   * If not pattern is provided, gets visited spots for all patterns
   * @param patternId pattern id
   * @returns array of visited spots
   */
  public getVisitedSpots(patternId?: string) {
    if (patternId) {
      const pattern = this.patterns.get(patternId);
      if (!pattern) {
        this.error(`[GeoXpCore.getVisitedSpots] pattern id [${patternId}] not found`);
        return;
      }

      return pattern.visited;
    } else {
      const visited: string[] = [];
      this.patterns.forEach((pattern) => visited.concat(pattern.visited));
      return visited;
    }
  }

  /**
   * Gets spot by id
   * @param _spot spot to find
   * @returns spot
   */
  public getSpot(_spot: GeoXpSpot | string): GeoXpSpot | undefined {
    const { spot } = getSpotFromRef(this.patterns, _spot);
    return spot;
  }

  /**
   * Marks spots as unvisited.
   * If no spot id provided, marks all inside spots as unvisited
   * @param _spot spot to unvisit
   */
  public replaySpot(_spot?: GeoXpSpot | string) {
    const { spot, pattern } = getSpotFromRef(this.patterns, _spot);
    if (spot && pattern) {
      // mark specific spot as unvisited
      if (pattern.visited.includes(spot.id)) {
        pattern.visited = pattern.visited.filter((visited) => visited !== spot.id);
      }
    } else {
      this.patterns.forEach((pattern) => {
        // remove all inside if not active from visited
        pattern.visited = pattern.visited.filter(
          (e) => !pattern.inside.includes(e) || pattern.active.includes(e)
        );
      });
    }

    // trigger location refresh
    // so it can immediately activate unvisited spots
    if (this.lastLocation) {
      this.geolocationUpdate(this.lastLocation);
    }
  }

  /**
   * Checks if manual mode is available
   * Rules are
   * gps accuracy is really bad
   * not too far away
   * @param _spot spot to force
   * @returns error
   */
  public canForceSpot(_spot: GeoXpSpot | string): null | string {
    const { spot, pattern } = getSpotFromRef(this.patterns, _spot);

    if (!spot || !pattern) {
      this.error(`[GeoXpCore.canForceSpot] spot [${typeof _spot === 'string' ? _spot : _spot.id}] not found`);
      return 'spot not found';
    }

    // spots without position data can be forced at any time
    if (!spot.position) return null;

    // location never updated
    if (!this.lastLocation) {
      this.error('[GeoXpCore.canForceSpot] location never updated');
      return 'location update not received yet';
    }

    const { distance, inside } = getSpotDistances(this.lastLocation, spot.position, this.config.options);

    // checks for max allowed distance
    if (distance - this.lastLocation.accuracy > inside) {
      console.warn('[GeoXpCore.canForceSpot] cannot force spot, too far');
      return 'too far';
    }

    // check for accuracy
    if (this.lastLocation.accuracy <= FORCE_ACCURACY) {
      console.warn('[GeoXpCore.canForceSpot] Cannot force spot, last location update was too accurate');
      return 'current location is too accurate';
    }

    // check again for distance
    if (distance > inside) {
      console.warn('[GeoXpCore.canForceSpot] - Cannot force spot, too far');
      return 'too far';
    }

    return null;
  }

  /**
   * Forces spot activation
   * Forces other spots deactivation unless overlapping
   * @param _spot spot to force
   * @returns error
   */
  public forceSpot(_spot: GeoXpSpot | string): null | string {
    // check if spot can be forced
    const canForceSpotError = this.canForceSpot(_spot);
    if (canForceSpotError) {
      return canForceSpotError;
    }

    // gets spot info
    const { spot, pattern } = getSpotFromRef(this.patterns, _spot);

    if (!spot || !pattern) {
      this.error(
        `[GeoXpCore.forceSpot] spot [${typeof _spot === 'string' ? _spot : _spot.id}] not found, cannot activate`
      );
      return 'spot not found';
    }

    // checks if pattern enabled
    if (pattern.cfg.disabled) {
      this.error(
        `[GeoXpCore.forceSpot] pattern is disabled, cannot force spot [${typeof _spot === 'string' ? _spot : _spot.id}]`
      );
      return 'pattern is disabled';
    }

    // if there are spots active
    if (pattern.active.length > 0) {
      // for each active spot
      pattern.active.forEach((active) => {
        const toDeactivate = pattern.cfg.spots.find((e) => e.id === active);

        if (toDeactivate) {
          // removes from active spots
          pattern.active = pattern.active.filter((active) => active !== toDeactivate.id);

          // deactivates spot by outgoing it
          this.event.emit('inactive', toDeactivate);
        }
      });
    }

    // adds to active spots
    if (!pattern.active.includes(spot.id)) {
      pattern.active.push(spot.id);
    }

    // activates required spot
    this.event.emit('active', spot);

    // sets spot forced
    this.forced = spot.id;

    return null;
  }

  /**
   * Stops and removes any forced spot
   */
  public stopForcedSpot() {
    // check for force active
    if (!this.forced) return;

    this.patterns.forEach((pattern) => {
      if (this.forced) {
        // check if forced spot is active
        if (pattern.active.includes(this.forced)) {
          // finds spot info
          const toDeactivate = pattern.cfg.spots.find((e) => e.id === this.forced);
          if (toDeactivate) {
            // deactivates spot by outgoing it
            this.event.emit('inactive', toDeactivate);
          }
        }
      }
    });

    this.forced = undefined;
  }

  /**
   * Geolocation update
   * This method triggers the spot analysis
   *
   * Phased analysys
   * 1. deactivate spots
   * 2. activate new spots, prefetch incoming spots
   * 3. activate spots to replay or visited
   * 4. set first time inside (to avoid event duplication)
   *
   * @param location geolocation update
   */
  public geolocationUpdate(location: GeoXpGeolocation) {
    if (!this.config) return;

    // if forced ignore location update
    if (this.forced) return;

    if (!location || !isNumber(location.lat) || !isNumber(location.lon) || !isNumber(location.accuracy)) {
      this.error('[GeoXpCore.geolocationUpdate] location missing or incorrect format');
      return;
    }

    // Sets last registered location
    this.lastLocation = location;

    // exec only if locaiont accuracy is < than accuracy threshold
    if (location.accuracy > this.config.options.accuracy) {
      console.info('[GeoXpCore.geolocationUpdate] location update refused, bad accuracy', {
        target: this.config.options.accuracy,
        current: location.accuracy,
      });
      return;
    }

    // phased analysys
    // 1. deactivate spots
    // 2. activate new spots, prefetch incoming spots
    // 3. activate spots to replay or visited
    // 4. set first time inside (to avoid event duplication)

    // deactivate spots
    forEachSpotInPatterns(this.patterns, (pattern, spot) => {
      if (!spot.position) return;
      const { distance, outside } = getSpotDistances(location, spot.position, this.config?.options);

      if (distance > outside) {
        // spot is outside
        pattern.inside = pattern.inside.filter((inside) => inside !== spot.id);

        if (pattern.active.includes(spot.id)) {
          // spot is active, deactivate
          pattern.active = pattern.active.filter((active) => active !== spot.id);
          this.event.emit('inactive', spot);
        }
      }
    });

    // activate new spots, prefetch incoming spots
    forEachSpotInPatterns(this.patterns, (pattern, spot) => {
      if (!spot.position) return;
      const { distance, inside, fetch } = getSpotDistances(location, spot.position, this.config?.options);

      if (distance <= inside) {
        // first time inside (if user stays in the same location, content is not repeated)
        if (!pattern.inside.includes(spot.id) || !pattern.visited.includes(spot.id)) {
          // check if not already visited, or auto-replay is active for pattern
          const notVisitedOrReplay = pattern.cfg.replay || !pattern.visited.includes(spot.id);

          // check if order of spot respects after/notAfter rules
          const spotOrderOk =
            (!spot.after || pattern.visited.includes(spot.after)) &&
            (!spot.notAfter || !pattern.visited.includes(spot.notAfter));

          if (notVisitedOrReplay && spotOrderOk) {
            // spot should activate
            if (!pattern.active.includes(spot.id)) {
              pattern.active.push(spot.id);
              this.event.emit('active', spot);
            }
          }
        }
      } else if (distance <= fetch) {
        // inside prefetch area
        this.event.emit('incoming', spot);
      }
    });

    // activate spots to replay or visited
    forEachSpotInPatterns(this.patterns, (pattern, spot) => {
      if (!spot.position) return;
      const { distance, inside } = getSpotDistances(location, spot.position, this.config?.options);

      if (distance <= inside) {
        // first time inside (if user stays in the same location, content is not repeated)
        if (!pattern.inside.includes(spot.id)) {
          if (pattern.visited.includes(spot.id)) {
            // waits to see if something goes active or stops
            setTimeout(() => {
              // still inside
              if (pattern.inside.includes(spot.id)) {
                // replay if allowed, else throw visited event
                if (pattern.cfg.replay) this.replaySpot();
                else this.event.emit('visited', spot);
              }
            }, this.config.options.visitedFilter);
          }
        }
      }
    });

    // sets spots first time inside (if user stays in the same location, content is not repeated)
    forEachSpotInPatterns(this.patterns, (pattern, spot) => {
      if (!spot.position) return;
      const { distance, inside } = getSpotDistances(location, spot.position, this.config?.options);

      if (distance <= inside) {
        // first time inside (if user stays in the same location, content is not repeated)
        if (!pattern.inside.includes(spot.id)) {
          pattern.inside.push(spot.id);
        }
      }
    });
  }

  /**
   * Confirm spot content activation
   * @param _spot activated spot
   */
  public spotActivated(_spot: GeoXpSpot | string) {
    const { spot, pattern } = getSpotFromRef(this.patterns, _spot);

    if (!spot || !pattern) {
      this.error(
        `[GeoXpCore.spotActivated] spot [${typeof _spot === 'string' ? _spot : _spot.id}] not found`
      );
      return;
    }

    // mark spot active (it should be active already)
    if (!pattern.active.includes(spot.id)) pattern.active.push(spot.id);

    // mark spot visited
    if (!pattern.visited.includes(spot.id)) pattern.visited.push(spot.id);

    // update stored visited spots
    if (this.setStoredVisitedSpots) {
      this.setStoredVisitedSpots(pattern.cfg.id, pattern.visited);
    }

    // spot flagged as last
    if (spot.last) {
      this.event.emit('last', pattern.cfg.id);
    }

    // pattern is complete
    if (pattern.cfg.spots.filter((e) => !pattern.visited.includes(e.id)).length === 0) {
      this.event.emit('complete', pattern.cfg.id);
    }
  }

  /**
   * Confirm spot deactivation (either stopped or finished)
   * @param _spot deactivated spot
   */
  public spotDeactivated(_spot: GeoXpSpot | string) {
    const { spot, pattern } = getSpotFromRef(this.patterns, _spot);

    if (!spot || !pattern) {
      this.error(
        `[GeoXpCore.spotDeactivated] spot [${typeof _spot === 'string' ? _spot : _spot.id}] not found`
      );
      return;
    }

    // remove from active
    pattern.active = pattern.active.filter((active) => active !== spot.id);

    // if matches forced spot, remove force
    let removeForce = false;
    if (spot.id === this.forced) {
      this.forced = undefined;
      removeForce = true;
    }

    // trigger location refresh
    // this is meant to manage spots concurrency/order
    if (!removeForce && this.lastLocation) {
      this.geolocationUpdate(this.lastLocation);
    }
  }

  /**
   * Enables all patterns that are not marked as disabled in the configuration.
   * Iterates through the list of patterns in the configuration and calls {@link enablePattern} on each enabled pattern.
   */
  public enablePatterns() {
    this.config.patterns.forEach((pattern) => {
      if (pattern.disabled) return;
      this.enablePattern(pattern.id);
    });
  }

  /**
   * Disables all patterns in the configuration.
   * Iterates through the list of patterns in the configuration and calls {@link disablePattern} on each one.
   */
  public disablePatterns() {
    this.config.patterns.forEach((pattern) => {
      this.disablePattern(pattern.id);
    });
  }

  /**
   * Event wrapper on
   * @param eventName 'incoming' | 'active' | 'inactive' | 'visited' | 'last' | 'complete'
   * @param listener event listener
   */
  public on<K>(eventName: Key<K, GeoXpCoreEvent>, listener: Listener<K, GeoXpCoreEvent>) {
    if (typeof listener !== 'function') {
      this.error('[GeoXpCore.on] listener must be a function');
      return;
    }

    this.event.on(eventName, listener);
  }

  /**
   * Event wrapper once
   * @param eventName 'incoming' | 'active' | 'inactive' | 'visited' | 'last' | 'complete'
   * @param listener event listener
   */
  public once<K>(eventName: Key<K, GeoXpCoreEvent>, listener: Listener<K, GeoXpCoreEvent>) {
    if (typeof listener !== 'function') {
      this.error('[GeoXpCore.once] listener must be a function');
      return;
    }

    this.event.once(eventName, listener);
  }

  /**
   * Event wrapper off
   * @param eventName 'incoming' | 'active' | 'inactive' | 'visited' | 'last' | 'complete'
   * @param listener event listener
   */
  public off<K>(eventName: Key<K, GeoXpCoreEvent>, listener: Listener<K, GeoXpCoreEvent>) {
    if (typeof listener !== 'function') {
      this.error('[GeoXpCore.off] listener must be a function');
      return;
    }

    this.event.off(eventName, listener);
  }

  /**
   * @hidden
   */
  public sum(a: number, b: number): number {
    console.info('You could have just used your calculator for this!');
    console.info(`
    _____________________
    |  _________________  |
    | | JO           0. | |
    | |_________________| |
    |  ___ ___ ___   ___  |
    | | 7 | 8 | 9 | | + | |
    | |___|___|___| |___| |
    | | 4 | 5 | 6 | | - | |
    | |___|___|___| |___| |
    | | 1 | 2 | 3 | | x | |
    | |___|___|___| |___| |
    | | . | 0 | = | | / | |
    | |___|___|___| |___| |
    |_____________________|
    `);
    return a + b;
  }
}

export type { GeoXpSpot, GeoXpGeolocation, GeoXpCoreConfig, GeoXpCorePattern, GeoXpCoreEvent };
