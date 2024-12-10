/**
 * @hidden
 * @module
 * */

import { sanitiseNumber } from '@geoxp/utils';
import { DEFAULT_HIGH_ACCURACY, DEFAULT_MAX_AGE, DEFAULT_TIMEOUT } from './constants';
import { GeoXpWebGeolocationConfig, SanitisedConfig } from './types/config';

export const sanitiseConfig = (config?: GeoXpWebGeolocationConfig): SanitisedConfig => {
  const santised = {
    enableHighAccuracy: config?.enableHighAccuracy ?? DEFAULT_HIGH_ACCURACY,
    maximumAge: sanitiseNumber({
      inputLabel: 'maximumAge',
      inputValue: config?.maximumAge,
      defaultValue: DEFAULT_MAX_AGE,
    }),
    timeout: sanitiseNumber({
      inputLabel: 'timeout',
      inputValue: config?.timeout,
      defaultValue: DEFAULT_TIMEOUT,
    }),
  };
  return santised;
};
