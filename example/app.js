import GeoXp from '../src/index';

import { config } from './config';

const geoXp = new GeoXp(config);

document.getElementById('pos-in-button').addEventListener('click', e => {
  const position = {
    coords: {
      latitude: 45.116177,
      longitude: 7.742615,
      accuracy: 1
    }
  };

  geoXp.geo._geoSuccess(position);
});

document.getElementById('pos-out-button').addEventListener('click', e => {
  const position = {
    coords: {
      latitude: 43.116177,
      longitude: 5.742615,
      accuracy: 1
    }
  };

  geoXp.geo._geoSuccess(position);
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