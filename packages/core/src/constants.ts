/**
 * Default values used to fill missing configuration options
 * @module GeoXpCoreConstants
 * */

/** Time before a visited is notified [milliseconds] */
export const DEFAULT_VISITED_FILTER_TIME = 5000;

/** Minimum accuracy to consider a location update as valid [meters] */
export const DEFAULT_ACCURACY = 25;

/** Minimum accuracy (in meters) to allow manual mode (force spot) [meters]  */
export const FORCE_ACCURACY = 100;

/** Default spot position deadband past radius [meters] */
export const DEFAULT_DEADBAND = 10;

/** Default spot position radius [meters] */
export const DEFAULT_RADIUS = 20;

/** Default spot position prefetch radius [factor of radius]  */
export const DEFAULT_FETCH = 1;
