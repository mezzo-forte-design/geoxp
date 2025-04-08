const core = {
  patterns: [
    {
      id: 'pattern1',
      label: 'pattern1',
      replay: false,
      spots: [
        {
          id: 's01',
          label: 'Spot 1!!',
          position: {
            lat: 45.116177,
            lon: 7.742615
          }
        },
        {
          id: 's02',
          label: 'Spot 2!!',
          position: {
            lat: 46.116177,
            lon: 7.742615
          }
        },
        {
          id: 's03',
          label: 'Spot 3!!',
          position: {
            lat: 46.216177,
            lon: 7.842615
          }
        },
        // manual spot test
        {
          id: 's04',
          label: 'Spot 4!!!',
        }
      ]
    }
  ],
  options: {
    accuracy: 100,
    defaultDeadband: 10,
    defaultRadius: 20,
    defaultFetch: 1
  }
};

// audio configuration
const audio = {
  sounds: [
    {
      id: 'a01',
      spotId: 's01',
      url: './audio/01.mp3'
    },
    {
      id: 'a02',
      spotId: 's02',
      url: './audio/02.mp3'
    },
    {
      id: 'a03',
      spotId: 's03',
      url: './audio/03.mp3'
    },
    {
      id: 'a04',
      spotId: 's04',
      url: './audio/04.mp3'
    }
  ],
  options: {
    fadeInTime: 10000,
    fadeOutTime: 2000,
  }
};

export const config = { core, audio };
