/**
 * Configuration object structure
 * @module Config
 */

/** GeoXpWebStorageConfig */
export type GeoXpWebStorageConfig =
  | {
      /** prefix to append to pattern cookie name */
      cookiePrefix?: string;

      /** self delete when last spot is visited */
      deleteOnLastSpot?: boolean;

      /** self delete when all spots are visited */
      deleteOnCompletion?: boolean;

      /** cookies expiration [minutes] */
      expiration?: number;
    }
  | undefined;
