/**
 * @hidden
 * @module
 * */

import { GeoXpCorePattern } from './types/module';
import { GeoXpCoreConfig, GeoXpCoreConfigOptions } from './types/config';
import {
  DEFAULT_VISITED_FILTER_TIME,
  DEFAULT_RADIUS,
  DEFAULT_DEADBAND,
  DEFAULT_FETCH,
  DEFAULT_ACCURACY
} from './constants';
import { GeoXpGeolocation, GeoXpSpot } from './types/common';

export const sanitiseConfig = (config: GeoXpCoreConfig) => {
  if (!config.options) {
    config.options = {
      defaultRadius: DEFAULT_RADIUS,
      defaultDeadband: DEFAULT_DEADBAND,
      defaultFetch: DEFAULT_FETCH,
      accuracy: DEFAULT_ACCURACY,
      visitedFilter: DEFAULT_VISITED_FILTER_TIME
    };
  } else {
    config.options.defaultRadius = isNumber(config.options.defaultRadius)
      ? config.options.defaultRadius
      : DEFAULT_RADIUS;

    config.options.defaultDeadband = isNumber(config.options.defaultDeadband)
      ? config.options.defaultDeadband
      : DEFAULT_DEADBAND;

    config.options.defaultFetch = isNumber(config.options.defaultFetch) ? config.options.defaultFetch : DEFAULT_FETCH;

    config.options.accuracy = isNumber(config.options.accuracy) ? config.options.accuracy : DEFAULT_ACCURACY;

    config.options.visitedFilter = isNumber(config.options.visitedFilter)
      ? config.options.visitedFilter
      : DEFAULT_VISITED_FILTER_TIME;
  }

  return config;
};

export const getSpotFromRef = (
  patterns: Map<string, GeoXpCorePattern>,
  _spot?: GeoXpSpot | string
): {
  spot: GeoXpSpot | undefined;
  pattern: GeoXpCorePattern | undefined;
} => {
  if (!_spot) return { spot: undefined, pattern: undefined };
  let spot: GeoXpSpot | undefined;
  let pattern: GeoXpCorePattern | undefined;

  if (typeof _spot === 'string') {
    patterns.forEach((_pattern) => {
      spot = _pattern.cfg.spots.find((e) => e.id === _spot);
      if (spot) pattern = _pattern;
    });
  } else {
    patterns.forEach((_pattern) => {
      spot = _pattern.cfg.spots.find((e) => e.id === _spot.id);
      if (spot) pattern = _pattern;
    });
  }
  return { spot, pattern };
};

export const forEachSpotInPatterns = (
  patterns: Map<string, GeoXpCorePattern>,
  callback: (pattern: GeoXpCorePattern, spot: GeoXpSpot) => void
) => {
  patterns.forEach((pattern) => {
    if (!pattern.cfg.disabled) {
      pattern.cfg.spots.forEach((spot) => callback(pattern, spot));
    }
  });
};

export const getSpotDistances = (location: GeoXpGeolocation, spot: GeoXpSpot, options: GeoXpCoreConfigOptions) => {
  const position = spot.position;

  // calc distance
  const distance = calcGeoDistance(location, position);

  // calc rardiuses
  const inside = position.radius ?? options.defaultRadius;
  const outside = (position.radius ?? options.defaultRadius) + (position.deadband ?? options.defaultDeadband);
  const fetch = (position.fetch ?? options.defaultFetch!) * inside;

  return {
    distance,
    inside,
    outside,
    fetch
  };
};

export const calcGeoDistance = (
  coord1: {
    lon: number;
    lat: number;
  },
  coord2: {
    lon: number;
    lat: number;
  }
) => {
  // Radius of the earth in km
  const EARTH_R = 6371;

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lon - coord1.lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in m
  return EARTH_R * b * 1000;
};

export const isObjectLike = (value: unknown) => {
  return value !== null && typeof value === 'object' && !(typeof value === 'function') && !Array.isArray(value);
};

export const isNumber = (value: unknown) => typeof value === 'number';

export const isPositiveNumber = (value: unknown) => typeof value === 'number' && value >= 0;

export const toRad = (number: number) => (number * Math.PI) / 180;

export type Key<K, T> = T extends [never] ? string | symbol : K | keyof T;

type ListenerFunction<K, T, F> = T extends [never]
  ? F
  : K extends keyof T
    ? T[K] extends unknown[]
      ? (...args: T[K]) => void
      : never
    : never;
export type Listener<K, T> = ListenerFunction<K, T, (...args: unknown[]) => void>;
