import { expect, test } from 'vitest';
import GeoXpCore from '../index';
import { config, TEST_PATTERN_NAME, wrongConfig } from './utils';
import { DEFAULT_ACCURACY, DEFAULT_FETCH, DEFAULT_RADIUS } from '../src/constants';

// shared GeoXp core instance - you might want create new instances in test scope to check specific behaviors
const geoXp = new GeoXpCore(config);

test('sanitise config', () => {
  // create a new instance with wrong config
  const geoXp = new GeoXpCore(wrongConfig);
  const sanitisedConfig = geoXp['config'];

  // invalid or missing config options must have been overwritten
  expect(sanitisedConfig.options.accuracy).toBeTypeOf("number");
  expect(sanitisedConfig.options.accuracy).toBe(DEFAULT_ACCURACY);
  expect(sanitisedConfig.options.defaultRadius).toBeTypeOf("number");
  expect(sanitisedConfig.options.defaultRadius).toBe(DEFAULT_RADIUS);
  expect(sanitisedConfig.options.defaultFetch).toBeTypeOf("number");
  expect(sanitisedConfig.options.defaultFetch).toBe(DEFAULT_FETCH);

  // correct config entries we must have been kept
  expect(sanitisedConfig.options.defaultDeadband).toBe(wrongConfig.options.defaultDeadband);
});

test('retrieve spot', () => {
  const spot = geoXp.getSpot('s01');
  expect(spot).toBeTypeOf("object");
  expect(spot).not.toBe(undefined);
});

test('check patterns', () => {
  const sanitisedConfig = geoXp['config'];
  expect(sanitisedConfig.patterns).toBeTypeOf("object");
  expect(sanitisedConfig.patterns.length).toBe(1);
  expect(sanitisedConfig.patterns[0].spots.length).toBe(3);
  const patterns = geoXp['patterns'];
  const pattern = patterns.get(TEST_PATTERN_NAME);
  expect(pattern).not.toBe(undefined);
  expect(pattern?.cfg.id).toBe(TEST_PATTERN_NAME);
  expect(Array.isArray(pattern?.cfg.spots)).toBe(true);
  expect(pattern?.cfg.spots.length).toBe(3);
  expect(Array.isArray(pattern?.active)).toBe(true);
  expect(pattern?.active.length).toBe(0);
  expect(Array.isArray(pattern?.inside)).toBe(true);
  expect(pattern?.inside.length).toBe(0);
  expect(Array.isArray(pattern?.visited)).toBe(true);
  expect(pattern?.visited.length).toBe(0);
});

