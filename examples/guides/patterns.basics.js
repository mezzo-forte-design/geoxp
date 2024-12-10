/*
Here's an example configuration for a basic pattern.
Three audio contents have to be played at three different locations, without any order rule applied.
*/

import GeoXpCore from '@geoxp/core';
import GeoXpWebAudio from '@geoxp/web-audio';
import GeoXpWebGeolocation from '@geoxp/web-geolocation';

// step 1: core pattern configuration
// define relevant locations and experience parameters
const core = {
  patterns: [
    // just one pattern is needed
    {
      id: "pattern1",
      label: "Basic, unordered pattern",
      spots: [
        {
          id: "spot1",
          label: "Torino - Piazza Castello",
          position: {
            lat: 45.0711383,
            lon: 7.685391,
            radius: 60, // meters
            deadband: 40, // meters
          }
        },
        {
          id: 'spot2',
          label: 'Torino - Piazza Vittorio Veneto',
          position: {
            lat: 45.0651445,
            lon: 7.6929964,
            // if no geoFencing parameters are set, this position will use default values
          }
        },
        {
          id: 'spot3',
          label: 'Torino - Gran Madre',
          position: {
            lat: 45.062657,
            lon: 7.6972366,
            radius: 50, // meters
            fetch: 1.5, // starts loading content 1.5 * radius distance
          }
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
      overlap: true, // this audio content can be played while overlapping others, usually the case for background/ambient sounds
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

  // internal geoXp default values could be overridden appending "options" object to configuration
  options: {
    test: './audio/system/test.mp3', // url for test sound
    silence: './audio/system/silence.mp3', // url for silence sound
    fadeInTime: 0, // fade in time [ms]
    fadeOutTime: 1000, // fade out time [ms]
  }
};

const config = { core, audio };

// geoXp modules creation
const geoXpCore = new GeoXpCore(config.core);
const geoXpWebGeolocation = new GeoXpWebGeolocation(geoXpCore);
const geoXpWebAudio = new GeoXpWebAudio(geoXpCore, config.audio);

// geoXp modules can work on their own now.
// subscribe geoXp events or interact with them for customisation