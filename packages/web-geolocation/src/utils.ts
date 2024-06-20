/**
 * @hidden
 * @module
 * */

import { DEFAULT_HIGH_ACCURACY, DEFAULT_MAX_AGE, DEFAULT_TIMEOUT } from './constants';
import { GeoXpWebGeolocationConfig } from './types/config';

export const sanitiseConfig = (config: GeoXpWebGeolocationConfig) => {
  if (!config) {
    config = {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timemout: 27000
    };
  } else {
    config.enableHighAccuracy =
      config.enableHighAccuracy !== undefined ? config.enableHighAccuracy : DEFAULT_HIGH_ACCURACY;

    config.maximumAge = isPositiveNumber(config.maximumAge) ? config.maximumAge : DEFAULT_MAX_AGE;

    config.timemout = isPositiveNumber(config.timemout) ? config.timemout : DEFAULT_TIMEOUT;
  }

  return config;
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
