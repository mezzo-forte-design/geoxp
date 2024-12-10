/**
 * Configuration object structure
 * @module WebGeolocationConfigTypes
 */

/** Config type for Web Geolocation module */
export type Config = {
  /** The application would like to receive the best possible results (can increase location fix time) */
  enableHighAccuracy?: boolean;

  /** Maximum age of a possible cached position that is acceptable to return [milliseconds] */
  maximumAge?: number;

  /** Maximum length of time the device is allowed to take in order to return a position [milliseconds] */
  timeout?: number;
};

/** GeoXpWebGeolocationConfig can be undefined (see Config for properties) */
export type GeoXpWebGeolocationConfig = Config | undefined;

/** SanitisedConfig corresponds to Config, but all fields are required */
export type SanitisedConfig = Required<Config>;
