export const config = {
  geo: {
    positions: [
      {
        lat: 45.0650933,
        lon: 7.6757719,
        label: "1 Introduzione - Liceo",
        _id: "pos1"
      },
      {
        lat: 45.0653663,
        lon: 7.6754178,
        label: '2 Centrale - Quintino - Re Umberto',
        _id: 'pos2'
      },
      {
        lat: 45.0650721,
        lon: 7.6757804,
        label: '3 Chiorba - T-Art',
        _id: 'pos3',
      },
      {
        lat: 45.0655841,
        lon: 7.6764021,
        label: '4 Lagone - Parini Carige',
        _id: 'pos4'
      },
      {
        lat: 45.0655831,
        lon: 7.6764011,
        label: '5 Soffione - Gioia Matteotti',
        _id: 'pos5'
      },
      {
        lat: 45.0652261,
        lon: 7.6786931,
        label: '6 Acqua Forte - Matteotti XX Sett',
        _id: 'pos6'
      },
      {
        lat: 45.0654303,
        lon: 7.6792205,
        label: '7 Biancana - XX sett Bagel',
        _id: 'pos7'
      },
      {
        lat: 45.0659163,
        lon: 7.6805334,
        label: '8 Anfiteatro (50m) - Miagola',
        _id: 'pos8',
      },
      {
        lat: 45.0653235,
        lon: 7.6814026,
        label: '9 Flora - Buozzi - Gobetti',
        _id: 'pos9'
      },
      {
        lat: 45.0666286,
        lon: 7.6831431,
        label: '10 Panchina - Lagrange Giolitti',
        _id: 'pos10'
      },
      {
        lat: 45.0670136,
        lon: 7.682433,
        label: '11 Geologi - S.Carlo',
        _id: 'pos11'
      },
      {
        lat: 45.066753,
        lon: 7.6811947,
        label: '12 Belvedere - Amendola Frola',
        _id: 'pos12',
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
        _id: "aud1",
        label: "aud1",
        url: "./audio/spot_1.mp3"
      },
      {
        _id: "aud2",
        label: "aud2",
        url: "./audio/spot_2.mp3"
      },
      {
        _id: "aud3",
        label: "aud3",
        url: "./audio/spot_3.mp3"
      },
      {
        _id: "aud4",
        label: "aud4",
        url: "./audio/spot_4.mp3"
      },
      {
        _id: "aud5",
        label: "aud5",
        url: "./audio/spot_5.mp3"
      },
      {
        _id: "aud6",
        label: "aud6",
        url: "./audio/spot_6.mp3"
      },
      {
        _id: "aud7",
        label: "aud7",
        url: "./audio/spot_7mp3"
      },
      {
        _id: "aud8",
        label: "aud8",
        url: "./audio/spot_8.mp3"
      },
      {
        _id: "aud9",
        label: "aud9",
        url: "./audio/spot_9.mp3"
      },      
      {
        _id: "aud10",
        label: "aud10",
        url: "./audio/spot_10.mp3"
      },
      {
        _id: "aud11",
        label: "aud11",
        url: "./audio/spot_11.mp3"
      },
      {
        _id: "aud12",
        label: "aud12",
        url: "./audio/spot_12.mp3"
      },
      {
        _id: "bg1",
        label: "background",
        url: "./audio/people_shouting.mp3"
      },
      {
        _id: "bg2",
        label: "background",
        url: "./audio/kids.mp3"
      }
    ],
    default: {
      test: "./audio/test.mp3",
      silence: "./audio/silence.mp3",
      unlock: "./audio/unlock.mp3",
      visited: "./audio/visited.mp3"
    }
  },

  experience: {
    patterns: [
    {
      _id: "iti1",
      label: "iti1",
      overlap: false,
      spots: [
        {
          _id: "sp1",
          position: "pos1",
          audio : "aud1"
        },
        {
          _id: "sp2",
          position: "pos1",
          audio: "aud2",
          after: "sp1"
        },
        {
          _id: "sp3",
          position: "pos3",
          audio: "aud3"
        },
        {
          _id: "sp4",
          position: "pos4",
          audio: "aud4"
        },
        {
          _id: "sp5",
          position: "pos5",
          audio: "aud5"
        },
        {
          _id: "sp6",
          position: "pos6",
          audio: "aud6"
        },
        {
          _id: "sp7",
          position: "pos7",
          audio: "aud7"
        },
        {
          _id: "sp8",
          position: "pos8",
          audio: "aud8"
        },
        {
          _id: "sp9",
          position: "pos9",
          audio: "aud9"
        },
        {
          _id: "sp10",
          position: "pos10",
          audio: "aud10"
        },
        {
          _id: "sp11",
          position: "pos11",
          audio: "aud11"
        },
        {
          _id: "sp12",
          position: "pos12",
          audio: "aud12"
        }
      ]
    },
    {
      _id: "bg",
      label: "background",
      overlap: true,
      spots: [
        {
          _id: "bg1",
          position: "pos1",
          audio : "bg1"
        },
        {
          _id: "bg2",
          position: "pos1",
          audio : "bg2"
        }
      ]
    }
    ]
  }
}