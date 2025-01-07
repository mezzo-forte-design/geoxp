/**
 * @hidden
 * @module
 * */

import { sanitiseNumber } from '@geoxp/utils';
import { GeoXpCorePattern } from './types/module';
import { GeoXpCoreConfig, GeoXpCoreConfigOptions, SanitisedConfig } from './types/config';
import {
  DEFAULT_VISITED_FILTER_TIME,
  DEFAULT_RADIUS,
  DEFAULT_DEADBAND,
  DEFAULT_FETCH,
  DEFAULT_ACCURACY,
} from './constants';
import { GeoXpGeolocation, GeoXpSpot, GeoXpSpotPosition } from './types/common';

export const sanitiseConfig = (config: GeoXpCoreConfig): SanitisedConfig => ({
  ...config,
  options: {
    defaultRadius: sanitiseNumber({
      inputLabel: 'defaultRadius',
      inputValue: config.options?.defaultRadius,
      defaultValue: DEFAULT_RADIUS,
      excludeZero: true,
    }),
    defaultDeadband: sanitiseNumber({
      inputLabel: 'defaultDeadband',
      inputValue: config.options?.defaultDeadband,
      defaultValue: DEFAULT_DEADBAND,
      excludeZero: true,
    }),
    defaultFetch: sanitiseNumber({
      inputLabel: 'defaultFetch',
      inputValue: config.options?.defaultFetch,
      defaultValue: DEFAULT_FETCH,
      excludeZero: true,
    }),
    accuracy: sanitiseNumber({
      inputLabel: 'accuracy',
      inputValue: config.options?.accuracy,
      defaultValue: DEFAULT_ACCURACY,
      excludeZero: true,
    }),
    visitedFilter: sanitiseNumber({
      inputLabel: 'visitedFilter time',
      inputValue: config.options?.visitedFilter,
      defaultValue: DEFAULT_VISITED_FILTER_TIME,
    }),
  },
});

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

export const toRad = (number: number) => (number * Math.PI) / 180;

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

export const getSpotDistances = (
  location: GeoXpGeolocation,
  position: GeoXpSpotPosition,
  options: GeoXpCoreConfigOptions
) => {
  // calc distance
  const distance = calcGeoDistance(location, position);

  // calc rardiuses
  const inside = position.radius ?? options.defaultRadius!;
  const outside =
    (position.radius ?? options.defaultRadius!) + (position.deadband ?? options.defaultDeadband!);
  const fetch = (position.fetch ?? options.defaultFetch!) * inside;

  return {
    distance,
    inside,
    outside,
    fetch,
  };
};
