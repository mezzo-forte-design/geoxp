// geographic configuration
const geo = {
  "positions": [
    {
      "id": "p01",
      "label": "pos1",
      "lat": 45.116177,
      "lon": 7.742615,
    },
    {
      "id": "p02",
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
      "id": "a01",
      "url": "./audio/01.mp3"
    },
    {
      "id": "a02",
      "url": "./audio/02.mp3"
    },
    {
      "id": "a03",
      "url": "./audio/03.mp3"
    },
    {
      "id": "a04",
      "url": "./audio/04.mp3"
    },
    {
      "id": "k",
      "url": "./audio/kitchen.mp3"
    },
    {
      "id": "b",
      "url": "./audio/bedroom.mp3"
    },
    {
      "id": "c",
      "url": "./audio/corridor.mp3"
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
      "replay": false,
      "spots": [
        {
          "id": "s01",
          "position": "p01",
          "audio": "a01",
          "label": "Spot 1!!"
        },
        {
          "id": "s02",
          "position": "p02",
          "audio": "a02",
          "label": "Spot 2!!"
        },
        {
          "id": "s03",
          "audio": "a03",
          "label": "Spot 3!!"
        },
        {
          "id": "s04",
          "audio": "a04",
          "label": "Spot 4!!"
        }
      ]
    }
  ],
  "options": {
    "cookies": false
  }
};

export const config = { geo, audio, experience };