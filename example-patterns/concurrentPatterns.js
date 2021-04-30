/*
Here's an example configuration for two concurrent patterns.
The first carries the actual content, while the second is used to play background ambient sounds at spots location.
*/

import GeoXp from '@mezzo-forte/geoxp';

// step 1: geo configuration
// maps all the relevant locations, provides info for geoFencing
const geo = {
  positions: [
    {
      id: 'pos1',
      label: 'Torino - Piazza Castello',
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
  ]
};

// step 2: audio configuration
// maps all experience audio content
const audio = {
  sounds: [
    {
      id: "aud1",
      url: "./audio/duck.mp3"
    },
    {
      id: "aud2",
      url: "./audio/people_shouting.mp3"
    },
    {
      id: "aud3",
      url: "./audio/people_talking.mp3"
    },
    {
      id: 'bg1',
      url: './audio/kids.mp3'
    },
    {
      id: 'bg2',
      url: './audio/factory.mp3'
    }
  ]
};

// step 3: experience pattern configuration
// putting things together
const experience = {
  patterns: [
    // pattern 1 is used for actual content
    {
      id: 'experience',
      label: 'Actual content pattern',
      spots: [
        // first spot is in Piazza Castello (pos1), play duck (aud1)
        {
          id: "sp1",
          position: "pos1",
          audio: "aud1",
          label: "Hello Spot 1"
        },
        // second spot is in Piazza Vittorio (pos2), play shouting (aud2)
        {
          id: "sp2",
          position: "pos2",
          audio: "aud2",
          label: "Hello Spot 2"
        },
        // third spot is at Gran Madre (pos3), play talking (aud3)
        {
          id: "sp3",
          position: "pos3",
          audio: "aud3",
          label: "Hello Spot 3"
        },
      ]
    },

    // pattern 2 is used for background sounds
    {
      id: 'background',
      label: 'Background sounds',
      // being ambient sounds
      overlap: true, // they can overlap if needed
      replay: true, // they must be replayed whenever user is inside the spot
      spots: [
        // first spot is in Piazza Castello (pos1), play kids (bg1)
        {
          id: 'sp1_bg',
          position: 'pos1',
          audio: 'bg1',
          label: "Hello Background Spot 1"
        },
        // second spot is in Piazza Vittorio (pos2), play kids (bg1)
        {
          id: 'sp2_bg',
          position: 'pos2',
          audio: 'bg1',
          label: "Hello Background Spot 2"
        },
        // third spot is at Gran Madre (pos3), play factory (bg2)
        {
          id: 'sp3_bg',
          position: 'pos3',
          audio: 'bg2',
          label: "Hello Background Spot 3"
        }
      ]
    }
  ]
};

// compose configuration object and create geoXp instance on configuration
const geoXp = new GeoXp({ geo, audio, experience });

// disables background music
geoXp.disablePattern('background');

// enables background music
geoXp.enablePattern('background');