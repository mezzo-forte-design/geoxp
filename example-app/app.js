import GeoXp from '../dist/geoxp';

import { config } from './config';

import Logger from './logger';

const logger = new Logger('logs-container');

let geoXp;

let internalGeolocation = false;

const simulateSpot = (spotId) => {
  const spot = config.experience.patterns[0].spots.find((el) => el.id === spotId);
  if (!spot) {
    console.warn("spot not found", spotId);
    logger.warn(`Spot with id "${spotId}" not found`);
    return false;
  }

  const posId = spot.position;

  const position = config.geo.positions.find((pos) => pos.id === posId);
  if (!position) {
    console.warn("position not found", posId);
    logger.warn(`Position with id "${posId}" not found`);
    return false;
  }

  console.log("simulating spot", spot, "with position", position);
  logger.message(`Simulating spot`, spot, position);

  geoXp.updateGeolocation({
    coords: {
      latitude: position.lat,
      longitude: position.lon,
      accuracy: 10,
    },
  });

  return true;
};

window.simulateSpot = simulateSpot;

window.onload = (ev) => {

  geoXp = new GeoXp(config);
  window.geoxp = geoXp;

  // example of event listeners
  geoXp.on('active', spotData => {
    console.log('[EVENT] - Spot active', spotData);
    logger.message('[EVENT] - Spot active', spotData);
  });

  geoXp.on('outgoing', spotData => {
    console.log('[EVENT] - Spot outgoing', spotData);
    logger.message('[EVENT] - Spot outgoing', spotData);
  });

  geoXp.on('visited', spotData => {
    console.log('[EVENT] - Spot visited', spotData);
    logger.message('[EVENT] - Spot visited', spotData);
  });

  geoXp.on('play', audioData => {
    console.log('[EVENT] - Play audio', audioData);
    logger.message('[EVENT] - Play audio', audioData);
  });

  geoXp.on('stop', audioData => {
    console.log('[EVENT] - Stop audio', audioData);
    logger.message('[EVENT] - Stop audio', audioData);
  });
}

// document.getElementById('pos1-in-button').addEventListener('click', e => {
//   const position = {
//     coords: {
//       latitude: 45.116177,
//       longitude: 7.742615,
//       accuracy: 1
//     }
//   };

//   geoXp.internalGeolocation(false);
//   geoXp.updateGeolocation(position);
// });

// document.getElementById('pos2-in-button').addEventListener('click', e => {
//   const position = {
//     coords: {
//       latitude: 45.116177,
//       longitude: 6.742615,
//       accuracy: 1
//     }
//   };

//   geoXp.internalGeolocation(false);
//   geoXp.updateGeolocation(position);
// });

// document.getElementById('pos-out-button').addEventListener('click', e => {
//   const position = {
//     coords: {
//       latitude: 40.116177,
//       longitude: 2.742615,
//       accuracy: 1
//     }
//   };

//   geoXp.internalGeolocation(false);
//   geoXp.updateGeolocation(position);
// });

// document.getElementById('enable-button').addEventListener('click', e => {
//   geoXp.enablePattern('pattern2');
// });

// document.getElementById('disable-button').addEventListener('click', e => {
//   geoXp.disablePattern('pattern2');
// });

document.getElementById('test-button').addEventListener('click', e => {
  geoXp.audio.test();
});

document.getElementById('reset-button').addEventListener('click', e => {
  geoXp.clearCookies();
  geoXp.reload(config);
});

document.getElementById('unlock-button').addEventListener('click', e => {
  geoXp.unlock();
});

document.getElementById('internal-geolocation-button').addEventListener('click', e => {
  geoXp.internalGeolocation(internalGeolocation);
  console.log('Internal geolocation', internalGeolocation);
  printLog(`Internal geolocation set to ${internalGeolocation}`);
  internalGeolocation = !internalGeolocation;
});

document.getElementById('clear-log').addEventListener('click', e => {
  logger.clear();
});

document.getElementById('simulate-spot').addEventListener('click', e => {
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

document.getElementById('simulate-position').addEventListener('click', e => {
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

  const coords = { latitude, longitude, accuracy };

  logger.message('Simulating, position with coords:', coords);

  geoXp.updateGeolocation({ coords });

  latIn.value = '';
  lonIn.value = '';
  accuracyIn.value = '';
});