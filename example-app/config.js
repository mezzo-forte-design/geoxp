// geographic configuration
const geo = {
  "positions": [
    {
      "id": "pos1",
      "label": "pos1",
      "lat": 45.116177,
      "lon": 7.742615,
    },
    {
      "id": "pos2",
      "label": "pos2",
      "lat": 45.116177,
      "lon": 6.742615,
    }
  ],
  "options": {
    "enableHighAccuracy": true,
    "accuracy": 100,
    "defaultDeadband": 10,
    "defaultRadius": 20,
    "defaultFetch": 1
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
  "options": {
    "test": "./audio/system/test.mp3",
    "silence": "./audio/system/silence.mp3",
    "visited": "./audio/system/visited.mp3",
    "fadeInTime": 5000,
    "fadeOutTime": 1000
  }
};

// experience configuration
const experience = {
  "patterns": [
    {
      "id": "pattern1",
      "label": "pattern1",
      "overlap": false,
      "replay": true,
      "spots": [
        {
          "id": "spot1",
          "position": "pos1",
          "audio": "aud1",
          "label": "Spot 1!!"
        }
      ]
    },
    {
      "id": "pattern2",
      "label": "pattern2",
      "disabled": true,
      "overlap": false,
      "replay": true,
      "spots": [
        {
          "id": "spot2",
          "position": "pos2",
          "audio": "aud2",
          "label": "Spot 2!!"
        }
      ]
    }
  ]
};

export const config = { geo, audio, experience };