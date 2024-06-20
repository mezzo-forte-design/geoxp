/**
 * Configuration object structure
 * @module Config
 */

import { GeoXpSpot } from './common';

/** GeoXpCoreConfigPattern */
export interface GeoXpCoreConfigPattern {
  /** Pattern id */
  id: string;

  /**  Pattern name/desc  */
  label?: string;

  /**  Pattern is disabled */
  disabled?: boolean;

  /** Pattern spots are replayed by default */
  replay?: boolean;

  /** Pattern spots array */
  spots: GeoXpSpot[];
}

/** GeoXpCoreConfigOptions */
export interface GeoXpCoreConfigOptions {
  /** Default spot position radius [meters] */
  defaultRadius?: number;

  /** Default spot position deadband [meters] */
  defaultDeadband?: number;

  /** Default spot position radius for preferch [factor of radius] */
  defaultFetch?: number;

  /** Minimum acceptable accuracy [meters] */
  accuracy?: number;

  /**  Time before visisted spot is notified for filtering [milliseconds] */
  visitedFilter?: number;
}

/** GeoXpCoreConfig */
export interface GeoXpCoreConfig {
  /** Core patterns array */
  patterns: GeoXpCoreConfigPattern[];

  /** Core options */
  options?: GeoXpCoreConfigOptions;
}
