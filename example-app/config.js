// geographic configuration
const geo = {
  "positions": [
    {
      "id": "pos1",
      "label": "pos1",
      "lat": 45.116177,
      "lon": 7.742615,
      "radius": 10000,
      "deadband": 20
    },
    {
      "id": "pos2",
      "label": "pos2",
      "lat": 45.116177,
      "lon": 6.742615,
      "radius": 10000,
      "deadband": 20
    }
  ],
  "default": {
    "minAccuracy": 100,
    "posDeadband": 10,
    "playDistance": 20,
    "fetchDistance": 1
  }
};

// audio configuration
const audio = {
  "sounds": [
    {
      "id": "aud1",
      "url": "./audio/music1.mp3"
    },
    {
      "id": "aud2",
      "url": "./audio/music2.mp3"
    }
  ],
  "default": {
    "test": "./audio/system/test.mp3",
    "silence": "./audio/system/silence.mp3",
    "visited": "./audio/system/visited.mp3",
    "fadeInTime": 10000,
    "fadeOutTime": 1000
  }
};

// experience configuration
const experience = {
  "patterns": [
    {
      "label": "pattern1",
      "enabled": true,
      "overlap": false,
      "spots": [
        {
          "id": "spot1",
          "position": "pos1",
          "audio": "aud1",
          "label": "Spot 1!!"
        },
        {
          "id": "spot2",
          "position": "pos2",
          "audio": "aud2",
          "notAfter": "spot1",
          "label": "Spot 2!!"
        }
      ]
    }
  ]
};

export const config = { geo, audio, experience };