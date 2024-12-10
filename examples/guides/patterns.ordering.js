/*
Here's an example configuration for an ordered pattern.
Three audios have to be played at three different locations, ordered from 1 to 3 (eg: spot 2 cannot be played before spot 1)
*/

import GeoXpCore from '@geoxp/core';
import GeoXpWebAudio from '@geoxp/web-audio';
import GeoXpWebGeolocation from '@geoxp/web-geolocation';

// step 1: core pattern configuration
// define relevant locations and experience parameters
const core = {
  patterns: [
    {
      id: "pattern1",
      label: "Ordered pattern",
      spots: [
        {
          id: "spot1",
          label: "Torino - Piazza Castello",
          position: {
            lat: 45.0711383,
            lon: 7.685391,
          },
        },
        {
          id: 'spot2',
          label: 'Torino - Piazza Vittorio Veneto',
          position: {
            lat: 45.0651445,
            lon: 7.6929964,
          },
          after: "spot1", // spot1 must be played before spot2 can start
        },
        {
          id: 'spot3',
          label: 'Torino - Gran Madre',
          position: {
            lat: 45.062657,
            lon: 7.6972366,
          },
          after: "spot2", // spot2 must be played before spot3 can start
          last: true, // spot3 is the last in pattern. When playback is complete, geoXpCore will send an "last" event
        }
      ]
    }
  ]
};

// step 2: audio configuration
// define audio content
const audio = {
  sounds: [
    {
      id: "audio1",
      label: "Duck in Piazza Castello",
      spotId: "spot1",
      url: "./audio/duck.mp3",
    },
    {
      id: "audio2",
      label: "People shouting in Piazza Vittorio Veneto",
      spotId: "spot2",
      url: "./audio/people_shouting.mp3",
    },
    {
      id: "audio3",
      label: "People talking at Gran Madre",
      spotId: "spot3",
      url: "./audio/people_talking.mp3",
    }
  ],
};

const config = { core, audio };

// geoXp modules creation
const geoXpCore = new GeoXpCore(config.core);
const geoXpWebGeolocation = new GeoXpWebGeolocation(geoXpCore);
const geoXpWebAudio = new GeoXpWebAudio(geoXpCore, config.audio);

// geoXp modules can work on their own now.
// subscribe geoXp events or interact with them for customisation