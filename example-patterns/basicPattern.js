/*
Here's an example configuration for a basic pattern.
Three audio contents have to be played at three different locations, without any order rule applied.
*/

import GeoXp from 'mezzoforte-geoXp';

// step 1: geo configuration
// maps all the relevant locations, provides info for geoFencing
const geo = {
  positions: [
    {
      id: "pos1",
      label: "Torino - Piazza Castello",
      lat: 45.0711383,
      lon: 7.685391,
      radius: 60, // meters
      deadband: 40 // meters
    },
    {
      id: 'pos2',
      label: 'Torino - Piazza Vittorio Veneto',
      lat: 45.0651445,
      lon: 7.6929964
      // if no geoFencing parameters are set, this position will use default values
    },
    {
      id: 'pos3',
      label: 'Torino - Gran Madre',
      lat: 45.062657,
      lon: 7.6972366,
      radius: 50, // meters
      fetch: 1.5 // starts loading content 1.5 * radius distance
    }
  ],

  // internal geoXp default values could be overridden appending "default" object to configuration
  default: {
    fetchDistance: 1, // same as radius, no prefetch
    minAccuracy: 10, // meters
    playDistance: 30, // meters
    posDeadband: 5 // meters
  }
};


// step 2: audio configuration
// maps all experience audio content
const audio = {
  sounds: [
    {
      id: "aud1",
      label: "Duck",
      url: "./audio/duck.mp3"
    },
    {
      id: "aud2",
      label: "Shouting",
      url: "./audio/people_shouting.mp3"
    },
    {
      id: "aud3",
      label: "Talking",
      url: "./audio/people_talking.mp3"
    }
  ],

  // internal geoXp default values could be overridden appending "default" object to configuration
  default: {
    test: './audio/system/test.mp3', // url for test sound
    silence: './audio/system/silence.mp3', // url for silence sound
    visited: './audio/system/visited.mp3' // url for spot already visited sound
  }
};


// step 3: experience pattern configuration
// putting things together
const experience = {
  patterns: [
    // just one pattern is needed
    {
      id: "exp1",
      label: "Basic, unordered pattern",
      spots: [
        // first spot is in Piazza Castello (pos1), play duck (aud1)
        {
          id: "sp1",
          position: "pos1",
          audio: "aud1"
        },
        // second spot is in Piazza Vittorio (pos2), play shouting (aud2)
        {
          id: "sp2",
          position: "pos2",
          audio: "aud2"
        },
        // third spot is at Gran Madre (pos3), play talking (aud3)
        {
          id: "sp3",
          position: "pos3",
          audio: "aud3"
        },
      ]
    }
  ]
};

// compose configuration object and create geoXp instance on configuration
const geoXp = new GeoXp({ geo, audio, experience });