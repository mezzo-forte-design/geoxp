const initialState = {
    insideGeoSpots  : [],
    visitedSpots    : [],
    activeSpots     : [],
    currentSounds   : [],
    loaded          : false
}  

const defaultSoundState = {
    url     : null,
    key     : null,
    state   : 'stopped', // stopped, starting, playing, stopping
    loop    : false,
    rms     : [10e-3, 10e-3],
    pan     : {
      state  : 'updated', // updating, updated
      value  : 0,
    },
    volume  : {
      state   : 'updated', // updating, updated
      value   : 0,
    }
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'APP_RESET': {
        return initialState;
      }
      break;
      case 'APP_INIT': {
        const config = action.payload;
        return {
            ...state,
            loaded: true
        };
      }
      break;
    }
}
  
  