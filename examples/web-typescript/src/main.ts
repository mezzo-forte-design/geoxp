import type { GeoXpGeolocation } from '@geoxp/web';
import { geoXp, simulateSpot } from './geoxp';
import './style.css';

let geolocationUpdates = false;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2 href="https://geoxp.mezzoforte.design target="_blank">
      Simple GeoXp Web Typescript integration
    </h2>
    <h1>GeoXp + TypeScript</h1>
    <div class="card">
      <button id="track-position" type="button">
        Track position
      </button>
      <button id="unlock-geoxp" type="button">
        Unlock
      </button>
      <small>(unlocking may be needed on mobile devices)</small>
    </div>
    <div class="card">
      <button id="test-geoxp" type="button">
        Test Audio
      </button>
      <button id="simulate-geoxp-spot" type="button">
        Simulate spot 01 location
      </button>
      <button id="simulate-outside-spot" type="button">
        Simulate (0, 0) location
      </button>
    </div>
    <p class="read-the-docs">
      Check JS console for logs
    </p>
  </div>
`;

const trackPosButton = document.querySelector<HTMLButtonElement>('#track-position')!;
trackPosButton.addEventListener('click', () => {
  console.log('Geolocation updates', !geolocationUpdates);
  geoXp.geolocation.toggleUpdates(!geolocationUpdates);
  if (geolocationUpdates) {
    trackPosButton.classList.remove('active');
  } else {
    trackPosButton.classList.add('active');
  }
  geolocationUpdates = !geolocationUpdates;
});

const unlockButton = document.querySelector<HTMLButtonElement>('#unlock-geoxp')!;
unlockButton.addEventListener('click', () => {
  geoXp.unlock();
});

const testButton = document.querySelector<HTMLButtonElement>('#test-geoxp')!;
testButton.addEventListener('click', () => {
  geoXp.audio.test();
});

const spotButton = document.querySelector<HTMLButtonElement>('#simulate-geoxp-spot')!;
spotButton.addEventListener('click', () => {
  simulateSpot('s01');
});

const outsideButton = document.querySelector<HTMLButtonElement>('#simulate-outside-spot')!;
outsideButton.addEventListener('click', () => {
  const location: GeoXpGeolocation = {
    lat: 0,
    lon: 0,
    accuracy: 10,
    timestamp: Date.now(),
  };
  geoXp.core.geolocationUpdate(location);
});

