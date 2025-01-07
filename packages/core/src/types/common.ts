/**
 * Definitions for basic GeoXp concepts
 * @module GeoXpBasicTypes
 */

/** GeoXpGeolocation */
export interface GeoXpGeolocation {
  /** Location timestamp [milliseconds unix epoch] */
  timestamp: number;

  /** * Location latitude [degrees north] */
  lat: number;

  /** * Location longitude [degrees east] */
  lon: number;

  /** * Location accuracy [meters] */
  accuracy: number;
}

/**  GeoXpSpotPosition */
export interface GeoXpSpotPosition {
  /** Position latitude [degrees north] */
  lat: number;

  /** Position longitude [degrees east] */
  lon: number;

  /**  Position inner radius [meters] */
  radius?: number;

  /** Position deadband extent past inner radius [meters] */
  deadband?: number;

  /** Radius for content prefetching [rate of radius] */
  fetch?: number;
}

/** GeoXpSpot */
export interface GeoXpSpot {
  /**  Spot id */
  id: string;

  /** Spot label */
  label?: string;

  /** Spot position */
  position?: GeoXpSpotPosition;

  /** Spot can activacte only after this spot id has been visited */
  after?: string;

  /**  Spot cannot activate after this spot id has been visited */
  notAfter?: string;

  /** Marks last spot in pattern */
  last?: boolean;
}

export type GetVisitedSpotsCallback = (patternId: string) => string[] | Promise<string[]> | undefined;
