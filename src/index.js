
import GeoManager from './GeoManager';
import AudioManager from './AudioManager';
import ItineraryManager from './ItineraryManager';

export default class GeoXp {
  constructor(config) {
    /**
    config: {
      geo: {
        position: [{
          _id;
          label;
          lat;
          lon;
          radius;    [m]
          deadband;  [m]
          fetch;     (1) 1 : n, ratio of radius for preloading 
        }];
        default: {
          minAccuracy;
          posDeadband;
          playDistance;
          fetchDistance;
        };
      }
      audio: [{
        _id;
        label;
        url;
      }]
      itinerary: {
        label;
        enable;
        overlap: 
        spot: [{
          position;
          audio;
          after;
        }];
      };
    }
    */

    this._config = config;
    this.geo = new GeoManager(config.geo);
    this.audio = new AudioManager(config.audio);
    this.itinerary = new ItineraryManager(config.itinerary);

    // subscribes to inventoryManager requests
    // request for positions refresh
    this.subItineraryRefresh = this.itinerary.geoRefresh$
      .subscribe(() => {

        // resend inside positions
        this.geo.refresh();
      });

    // request for audio stop
    this.subItineraryLoad = this.itinerary.audioLoad$
      .subscribe( spot => {
        
        // load spot audio
        this.audio.load(spot.audio, spot._id);
      });

    // request for audio play
    this.subItineraryPlay = this.itinerary.audioPlay$
      .subscribe( spot => {

        // play spot audio
        this.audio.play(spot.audio, spot._id);
      });
    
    // request for audio stop
    this.subItineraryStop = this.itinerary.audioStop$
    .subscribe( spot => {

      // stop spot audio
      this.audio.stop(spot.audio);
    });
    

    // subscribes to geo position updates
    // incoming spots
    this.subGeoIncoming = this.geo.incoming$
      .subscribe( position => {

        // sends to itineraryManager for processing
        this.itinerary.incoming(position);
      });
    
    // inside spots
    this.subGeoInside = this.geo.inside$
      .subscribe( position => { 

        // sends to itineraryManager for processing
        this.itinerary.inside(position);
      });

    // outgoing spot
    this.subGeoOutgoing = this.geo.outgoing$
      .subscribe( position => {

        // sends to itineraryManager for processing
        this.itinerary.outgoing(position);
      });
    

    // subscribes to audio player updates
    // sound playing
    this.subAudioPlay = this.audio.play$
      .subscribe( audio => {

        // sends to itineraryManager for processing
        this.itinerary.playing(audio);
      });

    // sound finished
    this.subAudioDone = this.audio.done$
      .subscribe( audio => {

        // sends to itineraryManager for processing
        this.itinerary.end(audio);
      });
  }

  reload(config) {
    this._config = config;
    this.geo.reload(config.geo);
    this.audio.reload(config.audio);
    this.itinerary.reload(config.itinerary);
  }

  destroy() {
    this.subItineraryLoad.unsubscribe();
    this.subItineraryPlay.unsubscribe();
    this.subItineraryStop.unsubscribe();
    this.subItineraryRefresh.unsubscribe();
    this.subAudioDone.unsubscribe();
    this.subAudioPlay.unsubscribe();
    this.subGeoInside.unsubscribe();
    this.subGeoOutgoing.unsubscribe();
    this.subGeoIncoming.unsubscribe();
  
    this.geo.unload();
    this.audio.unload();
    this.itinerary.unload();
  }
}