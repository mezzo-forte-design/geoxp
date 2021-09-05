import GeoXp from '../dist/geoxp';

import { config } from './config';

let geoXp;

window.onload = (ev) => {
  
  geoXp = new GeoXp(config);
  window.geoxp = geoXp;

  // example of event listeners
  geoXp.on('active', spotData => console.log('[EVENT] - Spot active', spotData));

  geoXp.on('outgoing', spotData => console.log('[EVENT] - Spot outgoing', spotData));

  geoXp.on('play', audioData => console.log('[EVENT] - Play audio', audioData));

  geoXp.on('stop', audioData => console.log('[EVENT] - Stop audio', audioData));
}

document.getElementById('pos1-in-button').addEventListener('click', e => {
  const position = {
    coords: {
      latitude: 45.116177,
      longitude: 7.742615,
      accuracy: 1
    }
  };

  geoXp.internalGeolocation(false);
  geoXp.updateGeolocation(position);
});

document.getElementById('pos2-in-button').addEventListener('click', e => {
  const position = {
    coords: {
      latitude: 45.116177,
      longitude: 6.742615,
      accuracy: 1
    }
  };

  geoXp.internalGeolocation(false);
  geoXp.updateGeolocation(position);
});

document.getElementById('pos-out-button').addEventListener('click', e => {
  const position = {
    coords: {
      latitude: 40.116177,
      longitude: 2.742615,
      accuracy: 1
    }
  };

  geoXp.internalGeolocation(false);
  geoXp.updateGeolocation(position);
});

document.getElementById('enable-button').addEventListener('click', e => {
  geoXp.enablePattern('pattern2');
});

document.getElementById('disable-button').addEventListener('click', e => {
  geoXp.disablePattern('pattern2');
});

document.getElementById('test-button').addEventListener('click', e => {
  geoXp.audio.test();
});

document.getElementById('reset-button').addEventListener('click', e => {
  geoXp.reload(config);
});

document.getElementById('unlock-button').addEventListener('click', e => {
  geoXp.unlock();
});


