/*
Here's an example configuration for a basic pattern.
Three audio contents have to be played at three different locations, without any order rule applied.
*/

import GeoXp from 'mezzoforte-geoXp';

const cfg = {
  // step 1: geo configuration
  // maps all the relevant locations, provides info for geoFencing
  geo: {
    positions: [
      {
        _id: "pos1",
        label: "Torino - Piazza Castello",
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
    ],
    
    // internal geoXp default values could be overridden appending "default" object to configuration
    default: {
      playDistance: 30, // meters. Sets default position radius (when none specified)
      posDeadband: 5 // meters. Sets default position deadband (when none specified)
    }
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
      }
    ]
  },

  // step 3: experience pattern configuration
  // putting things together
  experience: {
    patterns: [
      // just one pattern is needed
      {
        _id: "exp1",
        label: "Basic, unordered pattern",
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
      }
    ]
  }

}

// create geoXp instance on configuration
this.geoXp = new GeoXp(cfg);