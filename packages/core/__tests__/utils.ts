export const TEST_PATTERN_NAME = 'core-test-pattern';

export const config = {
  patterns: [
    {
      id: TEST_PATTERN_NAME,
      label: TEST_PATTERN_NAME,
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

export const wrongConfig = {
  patterns: [
    {
      id: TEST_PATTERN_NAME,
      label: TEST_PATTERN_NAME,
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
        }
      ]
    }
  ],
  options: {
    accuracy: -100,
    defaultDeadband: 50,
    defaultRadius: -20,
  }
};