
import GeoManager from './GeoManager';
import AudioManager from './AudioManager';

import { store } from './store';

store.subscribe(() => {
  // const state = store.getState();
});



export default class GeoXp {
  constructor(configs = {}) {
    console.log('hello geoXp');
  }
}