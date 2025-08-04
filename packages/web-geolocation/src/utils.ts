/**
 * @hidden
 * @module
 * */

import { sanitiseNumber } from '@geoxp/utils';
import { DEFAULT_HIGH_ACCURACY, DEFAULT_MAX_AGE, DEFAULT_TIMEOUT } from './constants';
import { GeoXpWebGeolocationConfig, SanitisedConfig } from './types/config';

export const sanitiseConfig = (config?: GeoXpWebGeolocationConfig): SanitisedConfig => {
  const clonedConfig = config && (JSON.parse(JSON.stringify(config)) as GeoXpWebGeolocationConfig);
  const santised = {
    enableHighAccuracy: clonedConfig?.enableHighAccuracy ?? DEFAULT_HIGH_ACCURACY,
    maximumAge: sanitiseNumber({
      inputLabel: 'maximumAge',
      inputValue: clonedConfig?.maximumAge,
      defaultValue: DEFAULT_MAX_AGE,
    }),
    timeout: sanitiseNumber({
      inputLabel: 'timeout',
      inputValue: clonedConfig?.timeout,
      defaultValue: DEFAULT_TIMEOUT,
    }),
  };
  return santised;
};
