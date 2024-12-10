/**
 * GeoXpWebStorage provides cookies storage for GeoXpCore when used on web browsers
 * @module WebStorageClass
 * */

import type GeoXpCore from '@geoxp/core';
import { deleteCookie, getAllCookies, getCookie, sanitiseConfig, setCookie } from './src/utils';
import type { GeoXpWebStorageConfig, SanitisedConfig } from './src/types/config';

/**
 * GeoXpWebStorage provides cookies storage for GeoXpCore when used on web browsers
 */
export default class GeoXpWebStorage {
  /**
   * GeoXpCore reference
   * @hidden
   */
  private readonly geoXpCore: GeoXpCore;

  /**
   * Event emitter
   * @hidden
   */
  private config: SanitisedConfig;

  /**
   * Constructor for GeoXpWebStorageConfig Class
   * @param geoXpCore GeoXpCore instance reference
   * @param config GeoXpWebStorageConfig configuration
   * @returns GeoXpWebStorageConfig singleton instance
   */
  constructor(geoXpCore: GeoXpCore, config?: GeoXpWebStorageConfig) {
    // sanitise config
    this.config = sanitiseConfig(config);

    // connects core
    this.geoXpCore = geoXpCore;

    // sets core methods for storage management
    this.geoXpCore.getStoredVisitedSpots = (patternId: string) => this.getCookie(patternId);
    this.geoXpCore.setStoredVisitedSpots = (patternId: string, visited: string[]) =>
      this.setCookie(patternId, visited);

    // subscribes core events
    this.geoXpCore.on('last', (patternId) => !!this.config.deleteOnLastSpot && this.deleteCookie(patternId));
    this.geoXpCore.on(
      'complete',
      (patternId) => !!this.config.deleteOnCompletion && this.deleteCookie(patternId)
    );

    console.info('[GeoXpWebStorage] instance created', this);
  }

  /**
   * Loads a new configuration
   * @param config GeoXpWebStorageConfig configuration
   */
  public reload(config?: GeoXpWebStorageConfig) {
    this.config = sanitiseConfig(config);
    console.info('[GeoXpWebStorage.reload] config reloaded', config);
  }

  /**
   * Clears all cookies
   */
  public clearAll() {
    const cookies = getAllCookies(this.config.cookiePrefix);
    cookies.forEach((name) => deleteCookie(name));
  }

  /**
   * Gets cookie
   * @param key reference key
   * @returns cookie value
   */
  public getCookie(key: string): string[] | undefined {
    return getCookie(this.config.cookiePrefix + key);
  }

  /**
   * Sets cookie
   * @param key reference key
   * @param value value to store
   */
  public setCookie(key: string, value: unknown, expiration?: number) {
    setCookie(this.config.cookiePrefix + key, value, expiration ?? this.config.expiration);
  }

  /**
   * Deletes cookie
   * @param key reference key
   */
  public deleteCookie(key: string) {
    deleteCookie(this.config.cookiePrefix + key);
  }
}

export type { GeoXpWebStorageConfig };
