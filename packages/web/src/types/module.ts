/**
 * @hidden
 * @module
 */

import type { GeoXpCoreEvent } from '@geoxp/core';
import type { GeoXpWebAudioEvent } from '@geoxp/web-audio';
import type { GeoXpWebGeolocationEvent } from '@geoxp/web-geolocation';

export type EngineType = 'core' | 'audio' | 'geolocation';

export type GeoXpWebEvent = GeoXpCoreEvent | GeoXpWebAudioEvent | GeoXpWebGeolocationEvent;
