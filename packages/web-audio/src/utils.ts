/**
 * @hidden
 * @module
 * */

import { GeoXpWebAudioConfig } from './types/config';
import { DEFAULT_FADE_IN_TIME, DEFAULT_FADE_OUT_TIME } from './constants';
import defaultSilenceSound from './audio/silence.mp3';
import defaultTestSound from './audio/test.mp3';

export const sanitiseConfig = (config: GeoXpWebAudioConfig) => {
  if (!config.options) {
    config.options = {
      test: defaultTestSound,
      silence: defaultSilenceSound,
      fadeInTime: DEFAULT_FADE_IN_TIME,
      fadeOutTime: DEFAULT_FADE_OUT_TIME
    };
  } else {
    config.options.test = config.options.test ? config.options.test : defaultTestSound;

    config.options.silence = config.options.silence ? config.options.silence : defaultSilenceSound;

    config.options.fadeInTime = isPositiveNumber(config.options.fadeInTime)
      ? config.options.fadeInTime
      : DEFAULT_FADE_IN_TIME;

    config.options.fadeOutTime = isPositiveNumber(config.options.fadeOutTime)
      ? config.options.fadeOutTime
      : DEFAULT_FADE_OUT_TIME;
  }

  return config;
};

export const isIOS = () => {
  const iosQuirkPresent = () => {
    const audio = new Audio();
    audio.volume = 0.5;
    return audio.volume === 1; // volume cannot be changed from "1" on iOS 12 and below
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAppleDevice = navigator.userAgent.includes('Macintosh');
  const isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)

  return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
};

export const hasWebAudio = () => {
  return Boolean(
    window.AudioContext ||
      // @ts-expect-error defined only in older browsers
      window.webkitAudioContext ||
      // @ts-expect-error defined only in older browsers
      window.mozAudioContext ||
      // @ts-expect-error defined only in older browsers
      window.oAudioContext ||
      // @ts-expect-error defined only in older browsers
      window.msAudioContext
  );
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
