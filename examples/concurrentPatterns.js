/*
Here's an example configuration for two concurrent patterns.
The first carries the actual content, while the second is used to play background ambient sounds at spots location.
*/

import GeoXp from 'mezzoforte-geoXp';

const cfg = {
  // step 1: geo configuration
  // maps all the relevant locations, provides info for geoFencing
  geo: {
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
  },

  // step 2: audio configuration
  // maps all experience audio content
  audio: {
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
      },
      {
        _id: 'bg1',
        label: 'Kids playing',
        url: './audio/kids.mp3'
      },
      {
        _id: 'bg2',
        label: 'Factory',
        url: './audio/factory.mp3'
      }
    ]
  },

  // step 3: experience pattern configuration
  // putting things together
  experience: {
    patterns: [
      // pattern 1 is used for actual content
      {
        _id: 'experience',
        label: 'Actual content pattern',
        spots: [
          // first spot is in Piazza Castello (pos1), play duck (aud1)
          {
            _id: "sp1",
            position: "pos1",
            audio : "aud1"
          },
          // second spot is in Piazza Vittorio (pos2), play shouting (aud2)
          {
            _id: "sp2",
            position: "pos2",
            audio: "aud2"
          },
          // third spot is at Gran Madre (pos3), play talking (aud3)
          {
            _id: "sp3",
            position: "pos3",
            audio: "aud3"
          },
        ]
      },

      // pattern 2 is used for background sounds
      {
        _id: 'background',
        label: 'Background sounds',
        // being ambient sounds
        overlap: true, // they can overlap if needed
        replay: true, // they must be replayed whenever user is inside the spot
        spots: [
          // first spot is in Piazza Castello (pos1), play kids (bg1)
          {
            _id: 'sp1_bg',
            position: 'pos1',
            audio : 'bg1'
          },
          // second spot is in Piazza Vittorio (pos2), play kids (bg1)
          {
            _id: 'sp2_bg',
            position: 'pos2',
            audio: 'bg1'
          },
          // third spot is at Gran Madre (pos3), play factory (bg2)
          {
            _id: 'sp3_bg',
            position: 'pos3',
            audio: 'bg2'
          }
        ]
      }
    ]
  }

}

// create geoXp instance on configuration
this.geoXp = new GeoXp(cfg);

// disables background music
this.geoXp.enablePattern('background', false);

// enables background music
this.geoXp.enablePattern('background', true);