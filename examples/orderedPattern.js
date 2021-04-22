/*
Here's an example configuration for an ordered pattern.
Three audios have to be played at three different locations, ordered from 1 to 3.
*/

import GeoXp from 'mezzoforte-geoXp';

// step 1: geo configuration
// maps all the relevant locations, provides info for geoFencing
const geo = {
  positions: [
    {
      _id: 'pos1',
      label: 'Torino - Piazza Castello',
      lat: 45.0711383,
      lon: 7.685391,
      radius: 60, // meters
      deadband: 40 // meters
    },
    {
      _id: 'pos2',
      label: 'Torino - Piazza Vittorio Veneto',
      lat: 45.0651445,
      lon: 7.6929964
      // if no geoFencing parameters are set, this position will use default values
    },
    {
      _id: 'pos3',
      label: 'Torino - Gran Madre',
      lat: 45.062657,
      lon: 7.6972366,
      radius: 50, // meters
      fetch: 1.5 // starts loading content 1.5 * radius distance
    }
  ]
};

// step 2: audio configuration
// maps all experience audio content
const audio = {
  sounds: [
    {
      _id: "aud1",
      label: "Duck",
      url: "./audio/duck.mp3"
    },
    {
      _id: "aud2",
      label: "Shouting",
      url: "./audio/people_shouting.mp3"
    },
    {
      _id: "aud3",
      label: "Talking",
      url: "./audio/people_talking.mp3"
    }
  ]
};

// step 3: experience pattern configuration
// putting things together
const experience = {
  patterns: [
    // just one pattern is needed
    {
      _id: 'exp1',
      label: 'Ordered pattern',
      spots: [
        // first spot is in Piazza Castello (pos1), play duck (aud1)
        {
          _id: 'sp1',
          position: 'pos1',
          audio: 'aud1'
        },
        // second spot is in Piazza Vittorio (pos2), play shouting (aud2)
        // its content have to be played only if spot 1 has already been visited
        {
          _id: 'sp2',
          position: 'pos2',
          audio: 'aud2',
          after: 'sp1' // play content only after "sp1" has been visited
        },
        // third spot is at Gran Madre (pos3), play talking (aud3)
        // its content have to be played only if spot 2 has already been visited
        {
          _id: 'sp3',
          position: 'pos3',
          audio: 'aud3',
          after: 'sp2' // play content only after "sp2" has been visited
        },
      ]
    }
  ]
};

// compose configuration object and create geoXp instance on configuration
const geoXp = new GeoXp({ geo, audio, experience });