export const config = {
  geo: {
    positions: [
      {
        lat: 45.0650933,
        lon: 7.6757719,
        label: "1 Introduzione - Liceo",
        id: "pos1"
      },
      {
        lat: 45.0653663,
        lon: 7.6754178,
        label: '2 Centrale - Quintino - Re Umberto',
        id: 'pos2'
      },
      {
        lat: 45.0651841,
        lon: 7.6764021,
        label: '3 Lagone - Parini Carige',
        id: 'pos3'
      },
      {
        lat: 45.0655831,
        lon: 7.6764011,
        label: '4 Soffione - Gioia Matteotti',
        id: 'pos4'
      },
      {
        lat: 45.0652261,
        lon: 7.6786931,
        label: '5 Acqua Forte - Matteotti XX Sett',
        id: 'pos5'
      },
      {
        lat: 44.533592,
        lon: 7.711379,
        id: 'posx'
      }
    ],
    default: {
      minAccuracy: 100,
      posDeadband: 10,
      playDistance: 20,
      fetchDistance: 1
    }
  },

  audio: {
    sounds: [
      {
        id: "aud1",
        label: "aud1",
        url: "./audio/spot_1.mp3"
      },
      {
        id: "aud2",
        label: "aud2",
        url: "./audio/spot_2.mp3"
      },
      {
        id: "aud3",
        label: "aud3",
        url: "./audio/spot_3.mp3"
      },
      {
        id: "aud4",
        label: "aud4",
        url: "./audio/spot_4.mp3"
      },
      {
        id: "aud5",
        label: "aud5",
        url: "./audio/spot_5.mp3"
      },
      {
        id: "bg1",
        label: "bg1",
        url: "./audio/kids.mp3"
      },
      {
        id: "bg2",
        label: "bg2",
        url: "./audio/people_shouting.mp3"
      }
    ],
    default: {
      test: "./audio/test.mp3",
      silence: "./audio/silence.mp3",
      visited: "./audio/visited.mp3"
    }
  },

  experience: {
    patterns: [
    {
      id: "iti1",
      label: "iti1",
      overlap: false,
      spots: [
        {
          id: "sp1",
          label: "sp1 title",
          position: "pos1",
          audio : "aud1",
        },
        {
          id: "sp2",
          label: "sp2 title",
          position: "pos2",
          audio: "aud2",
          after: "sp1"
        },
        {
          id: "sp3",
          label: "sp3 title",
          position: "pos3",
          audio: "aud3"
        },
        {
          id: "sp4",
          label: "sp4 title",
          position: "pos4",
          audio: "aud4"
        },
        {
          id: "sp5",
          label: "sp5 title",
          position: "pos4",
          audio: "aud5"
        },
      ]
    },
    {
      id: "bg",
      label: "background",
      overlap: true,
      replay: true,
      spots: [
        {
          id: "bg1",
          position: "pos1",
          audio : "bg1"
        },
        {
          id: "bg2",
          position: "pos1",
          audio : "bg2"
        }
      ]
    }
    ]
  }
}