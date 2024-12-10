/**
 * Configuration object structure
 * @module WebStorageConfigTypes
 */

/** Config type for Web Storage module */
export type Config = {
  /** prefix to append to pattern cookie name */
  cookiePrefix?: string;

  /** self delete when last spot is visited */
  deleteOnLastSpot?: boolean;

  /** self delete when all spots are visited */
  deleteOnCompletion?: boolean;

  /** cookies expiration [minutes] */
  expiration?: number;
};

/** GeoXpWebStorageConfig can be undefined (see Config for properties) */
export type GeoXpWebStorageConfig = Config | undefined;

/** SanitisedConfig corresponds to Config, but all fields are required */
export type SanitisedConfig = Required<Config>;
