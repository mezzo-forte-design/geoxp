/**
 * Configuration object structure
 * @module WebConfigTypes
 */

import type { GeoXpCoreConfig } from '@geoxp/core';
import type { GeoXpWebAudioConfig } from '@geoxp/web-audio';
import type { GeoXpWebGeolocationConfig } from '@geoxp/web-geolocation';
import type { GeoXpWebStorageConfig } from '@geoxp/web-storage';

export type GeoXpWebConfig = {
  core: GeoXpCoreConfig;
  audio: GeoXpWebAudioConfig;
  geolocation?: GeoXpWebGeolocationConfig;
  storage?: GeoXpWebStorageConfig;
};
