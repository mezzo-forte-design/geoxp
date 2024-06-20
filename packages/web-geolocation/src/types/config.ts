/**
 * Configuration object structure
 * @module Config
 */

/** GeoXpWebGeolocationConfig */
export type GeoXpWebGeolocationConfig =
  | {
      /** The application would like to receive the best possible results (can increase location fix time) */
      enableHighAccuracy?: boolean;

      /** Maximum age of a possible cached position that is acceptable to return [milliseconds] */
      maximumAge?: number;

      /** Maximum length of time the device is allowed to take in order to return a position [milliseconds] */
      timemout?: number;
    }
  | undefined;
