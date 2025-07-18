/**
 * @hidden
 * @module
 * */

import { GeoXpWebAudioConfig, SanitisedConfig } from './types/config';
import { DEFAULT_FADE_IN_TIME, DEFAULT_FADE_OUT_TIME } from './constants';
import defaultSilenceSound from './audio/silence.mp3';
import defaultTestSound from './audio/test.mp3';
import { sanitiseNumber } from '@geoxp/utils';

export const sanitiseConfig = (config: GeoXpWebAudioConfig): SanitisedConfig => {
  const clonedConfig = JSON.parse(JSON.stringify(config)) as GeoXpWebAudioConfig;

  const defaultOptions = {
    test: defaultTestSound,
    silence: defaultSilenceSound,
    autoplaySounds: true,
  };

  const sanitisedOptions = {
    ...defaultOptions,
    ...clonedConfig.options,
    fadeInTime: sanitiseNumber({
      inputLabel: 'fadeInTime',
      inputValue: clonedConfig.options?.fadeInTime,
      defaultValue: DEFAULT_FADE_IN_TIME,
    }),
    fadeOutTime: sanitiseNumber({
      inputLabel: 'fadeOutTime',
      inputValue: clonedConfig.options?.fadeOutTime,
      defaultValue: DEFAULT_FADE_OUT_TIME,
    }),
  };

  return {
    ...clonedConfig,
    options: sanitisedOptions,
  };
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

export const hasWebAudio = () =>
  Boolean(
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
