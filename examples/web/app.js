import GeoXpCore from '@geoxp/core';
import GeoXpWebAudio from '@geoxp/web-audio';
import GeoXpWebGeolocation from '@geoxp/web-geolocation';
import GeoXpWebStorage from '@geoxp/web-storage';
import Logger from './logger';
import { config } from './config';

console.log(`
   
  👋 Friendly reminder: Live reload is not enabled. Please refresh the browser manually after making changes!
  
`);

const logger = new Logger('logs-container');

let geoXpCore;
let geoXpWebAudio;
let geoXpWebGeolocation;
let geoXpWebStorage;

let geolocationUpdates = true;

const forceSpot = (spotId) => geoXpCore.forceSpot(spotId);
window.forceSpot = forceSpot;

const removeForce = () => geoXpCore.stopForcedSpot();
window.removeForce = removeForce;

const simulateSpot = (spotId) => {
  const spot = config.core.patterns[0].spots.find((el) => el.id === spotId);
  if (!spot) {
    console.warn('spot not found', spotId);
    logger.warn(`Spot with id "${spotId}" not found`);
    return;
  }
  if (!spot.position) {
    console.warn('spot has no position', spot);
    logger.warn('Spot has no position', spot);
    return;
  }

  console.log('simulating spot', spot.id, 'with position', spot.position);
  logger.message('Simulating spot', spot.id, 'with position', spot.position);

  geoXpCore.geolocationUpdate({
    lat: spot.position.lat,
    lon: spot.position.lon,
    accuracy: 10
  });
};
window.simulateSpot = simulateSpot;

window.onload = () => {
  geoXpCore = new GeoXpCore(config.core, { throwErrors: false });
  window.geoXpCore = geoXpCore;

  geoXpWebAudio = new GeoXpWebAudio(geoXpCore, config.audio);
  window.geoXpWebAudio = geoXpWebAudio;

  geoXpWebGeolocation = new GeoXpWebGeolocation(geoXpCore);
  window.geoXpWebGeolocation = geoXpWebGeolocation;

  geoXpWebStorage = new GeoXpWebStorage(geoXpCore);
  window.geoXpWebStorage = geoXpWebStorage;

  // core event listeners
  geoXpCore.on('active', spot => {
    console.log('[EVENT] - Spot active', spot);
    logger.message('[EVENT] - Spot active', spot);
    window.lastSpot = spot;
  });

  geoXpCore.on('inactive', spot => {
    console.log('[EVENT] - Spot inactive', spot);
    logger.message('[EVENT] - Spot inactive', spot);
  });

  geoXpCore.on('incoming', spot => {
    console.log('[EVENT] - Spot incoming', spot);
    logger.message('[EVENT] - Spot incoming', spot);
  });

  geoXpCore.on('visited', spot => {
    console.log('[EVENT] - Spot visited', spot);
    logger.message('[EVENT] - Spot visited', spot);
  });

  geoXpCore.on('complete', patternId => {
    console.log('[EVENT] - Pattern complete', patternId);
    logger.message('[EVENT] - Pattern complete', patternId);
  });

  geoXpCore.on('last', patternId => {
    console.log('[EVENT] - Last spot in pattern', patternId);
    logger.message('[EVENT] - Last spot in pattern', patternId);
  });

  // web audio event listeners
  geoXpWebAudio.on('playing', sound => {
    console.log('[EVENT] - Sound playing', sound);
    logger.message('[EVENT] - Sound playing', sound);
    window.lastSound = sound;
  });

  geoXpWebAudio.on('stopped', sound => {
    console.log('[EVENT] - Sound stopped', sound);
    logger.message('[EVENT] - Sound stopped', sound);
  });

  geoXpWebAudio.on('ended', sound => {
    console.log('[EVENT] - Sound ended', sound);
    logger.message('[EVENT] - Sound ended', sound);
  });

  geoXpWebAudio.on('ready', sound => {
    console.log('[EVENT] - Sound ready', sound);
    logger.message('[EVENT] - Sound ready', sound);
    if (!sound.autoplaySpots) {
      console.log('autoplaySpots is disabled in the config, skipping automatic playback');
    }
  });

  // web geolocation event listeners
  geoXpWebGeolocation.on('location', location => {
    console.log('[EVENT] - Location update', location);
    logger.message('[EVENT] - Location update', location);
    window.lastLocation = location;
  });
};

document.getElementById('test-button').addEventListener('click', () => {
  geoXpWebAudio.test();
});

document.getElementById('reset-button').addEventListener('click', () => {
  geoXpWebStorage.clearAll();
  geoXpWebGeolocation.reload();
  geoXpWebAudio.reload(config.audio);
  geoXpCore.reload(config.core);
  geoXpCore.geolocationUpdate({ lat: 0, lon: 0, accuracy: 10 });
});

document.getElementById('unlock-button').addEventListener('click', () => {
  geoXpWebGeolocation.unlock();
  geoXpWebAudio.unlock();
});

document.getElementById('internal-geolocation-button').addEventListener('click', e => {
  geolocationUpdates = !geolocationUpdates;

  geoXpWebGeolocation.toggleUpdates(geolocationUpdates);
  console.log('Geolocation updates', geolocationUpdates);
  logger.message(`Geolocation updates ${geolocationUpdates}`);
  if (geolocationUpdates) {
    e.target.classList.add('active');
  } else {
    e.target.classList.remove('active');
  }
});

document.getElementById('clear-log').addEventListener('click', () => {
  logger.clear();
});

document.getElementById('simulate-spot').addEventListener('click', () => {
  const input = document.getElementById('spot-id-input');
  const spotId = input.value;
  if (!spotId) {
    logger.error('Insert a Spot ID to simulate a spot');
    return;
  }

  const success = simulateSpot(spotId);
  if (success) {
    input.value = '';
  }
});

document.getElementById('force-spot').addEventListener('click', () => {
  const input = document.getElementById('spot-id-input');
  const spotId = input.value;
  if (!spotId) {
    logger.error('Insert a Spot ID to force a spot');
    return;
  }

  const success = forceSpot(spotId);
  if (success) {
    input.value = '';
  }
});

document.getElementById('unforce-spot').addEventListener('click', () => {
  removeForce();
});

document.getElementById('simulate-position').addEventListener('click', () => {
  const latIn = document.getElementById('position-lat-input');
  const lonIn = document.getElementById('position-lon-input');
  const accuracyIn = document.getElementById('position-acc-input');

  if (!latIn.value || !lonIn.value) {
    logger.error('Insert both latitude and longitude to simulate a position');
    return;
  }

  const latitude = +latIn.value;
  const longitude = +lonIn.value;

  if (!accuracyIn.value) {
    logger.warn('Accuracy set to default value of 10 meters');
  }

  const accuracy = +accuracyIn.value || 10;

  const location = {
    lat: latitude,
    lon: longitude,
    accuracy
  };

  logger.message('Simulating location', location);

  geoXpCore.geolocationUpdate(location);

  latIn.value = '';
  lonIn.value = '';
  accuracyIn.value = '';
});
