import GeoXp from '@geoxp/web';
import type { GeoXpGeolocation, GeoXpSpot, GeoXpWebAudioSound } from '@geoxp/web';

import { config } from './config';

const geoXp = new GeoXp(config, { throwErrors: false });

geoXp.geolocation.toggleUpdates(false);

geoXp.on('active', (spot: GeoXpSpot) => {
  console.log('[GEOXP EVENT] - Spot active', spot);
});

geoXp.on('inactive', (spot: GeoXpSpot) => {
  console.log('[GEOXP EVENT] - Spot inactive', spot);
});

geoXp.on('incoming', (spot: GeoXpSpot) => {
  console.log('[GEOXP EVENT] - Spot incoming', spot);
});

geoXp.on('visited', (spot: GeoXpSpot) => {
  console.log('[GEOXP EVENT] - Spot visited', spot);
});

geoXp.on('complete', (patternId: string) => {
  console.log('[GEOXP EVENT] - Pattern complete', patternId);
});

geoXp.on('last', (patternId: string) => {
  console.log('[GEOXP EVENT] - Last spot in pattern', patternId);
});

// web audio event listeners
geoXp.on('playing', (sound: GeoXpWebAudioSound) => {
  console.log('[GEOXP EVENT] - Sound playing', sound);
});

geoXp.on('stopped', (sound: GeoXpWebAudioSound) => {
  console.log('[GEOXP EVENT] - Sound stopped', sound);
});

// web geolocation event listeners
geoXp.on('location', (location: GeoXpGeolocation) => {
  console.log('[GEOXP EVENT] - Location update', location);
});

const simulateSpot = (spotId: string) => {
  const spot = config.core.patterns[0].spots.find((el) => el.id === spotId);

  if (!spot) {
    console.warn('spot not found', spotId);
    return;
  }

  if (!spot.position) {
    console.warn('spot has no position', spot);
    return;
  }

  console.log('simulating spot', spot.id, 'with position', spot.position);

  geoXp.core.geolocationUpdate({
    lat: spot.position.lat,
    lon: spot.position.lon,
    accuracy: 10,
    timestamp: Date.now()
  });
};

window.geoXp = geoXp;

export { geoXp, simulateSpot }


