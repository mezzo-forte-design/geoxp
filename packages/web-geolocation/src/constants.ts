/**
 * Default values used to fill missing configuration options
 * @module WebGeolocationConstants
 * */

/** The application would like to receive the best possible results (can increase location fix time) */
export const DEFAULT_HIGH_ACCURACY = true;

/** Maximum age of a possible cached position that is acceptable to return [milliseconds] */
export const DEFAULT_MAX_AGE = 27000; // ms

/** Maximum length of time the device is allowed to take in order to return a position [milliseconds] */
export const DEFAULT_TIMEOUT = 30000; // ms
