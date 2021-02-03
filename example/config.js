export const config = {
  "geo" : {
    "position" : [
      {
        "_id"           : "pos1",
        "label"         : "pos1",
        "lat"           : 45.116177,
        "lon"           : 7.742615,
        "radius"        : 10000,
        "deadband"      : 20
      }
    ],
    "default" : {
      "minAccuracy"     : 100,
      "posDeadband"     : 10,
      "playDistance"    : 20,
      "fetchDistance"   : 1
    }
  },

  "audio" : {
    "sound" : [
      {
        "_id"           : "aud1",
        "label"         : "aud1",
        "url"           : "./audio/music1.mp3"
      },
      {
        "_id"           : "aud2",
        "label"         : "aud2",
        "url"           : "./audio/music2.mp3"
      }
    ],
    "default" : {
      "test"            : "./audio/system/test.mp3",
      "silence"         : "./audio/system/silence.mp3",
      "unclock"         : "./audio/system/unlock.mp3",
      "visited"         : "./audio/system/visited.mp3"
    }
  },

  "itinerary" : [
    {
      "label"           : "iti1",
      "enabled"         : true,
      "overlap"         : false,
      "spot" : [
        {
          "_id"         : "spot1",
          "position"    : "pos1",
          "audio"       : "aud1"
        },
        {
          "_id"         : "spot2",
          "position"    : "pos1",
          "audio"       : "aud2",
          "after"       : "spot1"
        }
      ]
    }
  ]
}