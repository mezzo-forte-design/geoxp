/**
 * @hidden
 * @module
 * */

import { sanitiseNumber } from '@geoxp/utils';
import {
  DEFAULT_COOKIE_EXPIRATION,
  DEFAULT_COOKIE_PREFIX,
  DEFAULT_DELETE_ON_COMPLETION,
  DEFAULT_DELETE_ON_LAST_SPOT,
} from './constants';
import { GeoXpWebStorageConfig, SanitisedConfig } from './types/config';

export const sanitiseConfig = (config?: GeoXpWebStorageConfig): SanitisedConfig => {
  const clonedConfig = JSON.parse(JSON.stringify(config)) as GeoXpWebStorageConfig;
  return {
    cookiePrefix: clonedConfig?.cookiePrefix ?? DEFAULT_COOKIE_PREFIX,
    expiration: sanitiseNumber({
      inputLabel: 'cookie expiration (minutes)',
      inputValue: clonedConfig?.expiration,
      defaultValue: DEFAULT_COOKIE_EXPIRATION,
    }),
    deleteOnLastSpot:
      clonedConfig?.deleteOnLastSpot !== undefined
        ? clonedConfig.deleteOnLastSpot
        : DEFAULT_DELETE_ON_LAST_SPOT,
    deleteOnCompletion:
      clonedConfig?.deleteOnCompletion !== undefined
        ? clonedConfig.deleteOnCompletion
        : DEFAULT_DELETE_ON_COMPLETION,
  };
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

export const getAllCookies = (prefix: string): string[] =>
  document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie.startsWith(prefix))
    .map((cookie) => cookie.substring(0, cookie.indexOf('=')));

export const deleteCookie = (name: string) => {
  try {
    document.cookie = `${name}= ; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  } catch (e) {
    console.error('[GepXpWebStorage.helpers.deleteCookie] error deleting cookie', e);
  }
};
