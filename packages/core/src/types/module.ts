/**
 * @hidden
 * @module
 */

import type { GeoXpSpot } from './common';
import type { GeoXpCoreConfigPattern } from './config';

export interface GeoXpCorePattern {
  cfg: GeoXpCoreConfigPattern;
  visited: string[];
  inside: string[];
  active: string[];
}

export type GeoXpCoreEvent =
  | { incoming: [GeoXpSpot] }
  | { active: [GeoXpSpot] }
  | { inactive: [GeoXpSpot] }
  | { visited: [GeoXpSpot] }
  | { last: [string] }
  | { complete: [string] };
