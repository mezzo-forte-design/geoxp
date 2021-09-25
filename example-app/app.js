import GeoXp from '../dist/geoxp';

//import { config } from './config';
import geo from "./config/geo";
import audio from "./config/audio";
import experience from "./config/experience";

const config = { geo, audio, experience };

let geoXp;

let internalGeolocation = false;

const simulateSpot = (spotId) => {
  const spot = experience.patterns[0].spots.find((el) => el.id === spotId);
  if (!spot) {
    console.warn("spot not found", spotId);
  }

  const posId = spot.position;

  const position = geo.positions.find((pos) => pos.id === posId);
  if (!position) {
    console.warn("position not found", posId);
  }

  console.log("simulating spot", spot, "with position", position);

  geoXp.updateGeolocation({
    coords: {
      latitude: position.lat,
      longitude: position.lon,
      accuracy: 10,
    },
  });
};

window.simulateSpot = simulateSpot;

window.onload = (ev) => {
  
  geoXp = new GeoXp(config);
  window.geoxp = geoXp;

  // example of event listeners
  geoXp.on('active', spotData => console.log('[EVENT] - Spot active', spotData));

  geoXp.on('outgoing', spotData => console.log('[EVENT] - Spot outgoing', spotData));

  geoXp.on('visited', spotData => console.log('[EVENT] - Spot visited', spotData));

  geoXp.on('play', audioData => console.log('[EVENT] - Play audio', audioData));

  geoXp.on('stop', audioData => console.log('[EVENT] - Stop audio', audioData));
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
  internalGeolocation = !internalGeolocation;
});


