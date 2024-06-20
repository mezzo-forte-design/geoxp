/**
 * GeoXpWebStorage provides cookies storage for GeoXpCore when used on web browsers
 * @module GeoXpWebStorage
 * */

import GeoXpCore from 'core';
import {
  deleteCookie, getAllCookies, getCookie, sanitiseConfig, setCookie
} from './src/utils';
import { GeoXpWebStorageConfig } from './src/types/config';

/**
 * GeoXpWebStorage provides cookies storage for GeoXpCore when used on web browsers
 */
export default class GeoXpWebStorage {
  /**
   * GeoXpCore reference
   * @hidden
   */
  private geoXpCore: GeoXpCore;

  /**
   * Event emitter
   * @hidden
   */
  private config: GeoXpWebStorageConfig;

  /**
   * Constructor for GeoXpWebStorageConfig Class
   * @param geoXpCore GeoXpCore instance reference
   * @param config GeoXpWebStorageConfig configuration
   * @returns GeoXpWebStorageConfig singleton instance
   */
  constructor (geoXpCore: GeoXpCore, config: GeoXpWebStorageConfig) {
    // sanitise config
    this.config = sanitiseConfig(config);

    // inits the instance based on config
    this.init(config);

    // connects core
    this.geoXpCore = geoXpCore;

    // sets core methods for storage management
    this.geoXpCore.getStoredVisitedSpots = (patternId) => this.getCookie(patternId);
    this.geoXpCore.setStoredVisitedSpots = (patternId, visited) => this.setCookie(patternId, visited);

    // subscribes core events
    this.geoXpCore.on('last', (patternId) => !!this.config?.deleteOnLastSpot && this.deleteCookie(patternId));
    this.geoXpCore.on('complete', (patternId) => !!this.config?.deleteOnCompletion && this.deleteCookie(patternId));

    console.info('[GeoXpWebStorage] instance created', this);
  }

  /**
   * Inits GeoXpWebStorageConfig on provided options
   * @param config GeoXpWebStorageConfig configuration
   * @hidden
   */
  private init (config: GeoXpWebStorageConfig) {
    this.config = sanitiseConfig(config);
  }

  /**
   * Loads a new configuration
   * @param config GeoXpWebStorageConfig configuration
   */
  public reload (config: GeoXpWebStorageConfig) {
    this.init(config);
    console.info('[GeoXpWebStorage.reload] config reloaded', config);
  }

  /**
   * Clears all cookies
   */
  public clearAll () {
    const cookies = getAllCookies(this.config!.cookiePrefix!);
    cookies.forEach((name) => deleteCookie(name));
  }

  /**
   * Gets cookie
   * @param key reference key
   * @returns cookie value
   */
  public getCookie (key: string) {
    return getCookie(this.config!.cookiePrefix! + key);
  }

  /**
   * Sets cookie
   * @param key reference key
   * @param value value to store
   */
  public setCookie (key: string, value: unknown, expiration?: number) {
    setCookie(this.config!.cookiePrefix! + key, value, expiration ?? this.config!.expiration!);
  }

  /**
   * Deletes cookie
   * @param key reference key
   */
  public deleteCookie (key: string) {
    deleteCookie(this.config!.cookiePrefix! + key);
  }
}
