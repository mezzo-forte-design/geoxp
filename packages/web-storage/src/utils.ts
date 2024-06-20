/**
 * @hidden
 * @module
 * */

import {
  DEFAULT_COOKIE_EXPIRATION,
  DEFAULT_COOKIE_PREFIX,
  DEFAULT_DELETE_ON_COMPLETION,
  DEFAULT_DELETE_ON_LAST_SPOT
} from './constants';
import { GeoXpWebStorageConfig } from './types/config';

export const sanitiseConfig = (config: GeoXpWebStorageConfig) => {
  if (!config) {
    config = {
      cookiePrefix: DEFAULT_COOKIE_PREFIX,
      deleteOnLastSpot: DEFAULT_DELETE_ON_LAST_SPOT,
      deleteOnCompletion: DEFAULT_DELETE_ON_COMPLETION,
      expiration: DEFAULT_COOKIE_EXPIRATION
    };
  } else {
    config.deleteOnLastSpot =
      config.deleteOnLastSpot !== undefined ? config.deleteOnLastSpot : DEFAULT_DELETE_ON_LAST_SPOT;

    config.deleteOnCompletion =
      config.deleteOnCompletion !== undefined ? config.deleteOnLastSpot : DEFAULT_DELETE_ON_COMPLETION;

    config.cookiePrefix = config.cookiePrefix ? config.cookiePrefix : DEFAULT_COOKIE_PREFIX;

    config.expiration = isPositiveNumber(config.expiration) ? config.expiration : DEFAULT_COOKIE_EXPIRATION;
  }

  return config;
};

export const setCookie = (name: string, value: unknown, expiration: number) => {
  try {
    const exp = new Date();
    const now = new Date();
    exp.setTime(now.getTime() + expiration * 60000);
    document.cookie = name + '=' + JSON.stringify(value) + '; expires=' + exp.toUTCString() + '; path=/';
  } catch (e) {
    console.error('[GepXpWebStorage.helpers.setCookie] error saving cookie', e);
  }
};

export const getCookie = (name: string) => {
  if (document.cookie.length > 0) {
    try {
      let start = document.cookie.indexOf(name + '=');
      if (start !== -1) {
        start = start + name.length + 1;
        let end = document.cookie.indexOf(';', start);
        if (end === -1) {
          end = document.cookie.length;
        }
        return JSON.parse(document.cookie.substring(start, end));
      }
    } catch (e) {
      console.error('[GepXpWebStorage.helpers.getCookie] error getting cookie', e);
    }
  }
};

export const getAllCookies = (prefix: string) => {
  const res = document.cookie
    .split(';')
    .filter((cookie) => {
      return cookie.trim().indexOf(prefix) === 0;
    })
    .map((cookie) => {
      return cookie.substring(0, cookie.indexOf('='));
    });
  return res;
};

export const deleteCookie = (name: string) => {
  try {
    document.cookie = `${name}= ; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  } catch (e) {
    console.error('[GepXpWebStorage.helpers.deleteCookie] error deleting cookie', e);
  }
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
