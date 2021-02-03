
import GeoManager from './GeoManager';
import AudioManager from './AudioManager';
import ItineraryManager from './ItineraryManager';
import Device from './utils/Device';

/**
 * Creates GeoXp class.
 * GeoXp manages the MezzoForte Geo Experience
 * @param config - Config options for init
 * @returns { Object } - GeoXp instance
 * @constructor
 */
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
      },
      audio: {
        sound: [{
          _id;
          label;
          url;
        }],
        default: {
          test;
          silence;
          unlock;
          visited;
        }
      },
      itinerary: [{
        label;
        enabled;
        overlap: 
        spot: [{
          _id;
          position;
          audio;
          after;
        }];
      }];
    }
    */

    this._config = config;

    // instantiates modules
    this.geo = new GeoManager(config.geo);
    this.audio = new AudioManager(config.audio);
    this.itinerary = new ItineraryManager(config.itinerary);

    // exposes static classes
    this.utils = {
      device: Device
    };


    //////////////////////////////////////////////
    // subscribes to InventoryManager requests
    //////////////////////////////////////////////
    // request for positions refresh
    this.subItineraryRefresh = this.itinerary.geoRefresh$
      .subscribe(() => {

        // resend inside positions
        this.geo.refresh();
      });

    // request for audio stop
    this.subItineraryLoad = this.itinerary.audioLoad$
      .subscribe( audio => {
        
        // load spot audio
        this.audio.load(audio);
      });

    // request for audio play
    this.subItineraryPlay = this.itinerary.audioPlay$
      .subscribe( audio => {

        // play spot audio
        this.audio.play(audio);
      });
    
    // request for audio stop
    this.subItineraryStop = this.itinerary.audioStop$
    .subscribe( audio => {

      const fade = 4000; // [s]

      // stop spot audio
      this.audio.stop(audio, fade);
    });
    

    //////////////////////////////////////////////
    // subscribes to GeoManager position updates
    //////////////////////////////////////////////
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
    

    //////////////////////////////////////////////
    // subscribes to AudioManager events
    //////////////////////////////////////////////
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

  /**
  * Unlock geolocation and webaudio APIs
  */
  unlock() {
    this.geo.unlock();
    this.audio.unlock();
  }

  /**
  * Loads a new configuration
  * @param config - config parameters
  */
  reload(config) {
    this._config = config;
    this.geo.reload(config.geo);
    this.audio.reload(config.audio);
    this.itinerary.reload(config.itinerary);
  }

  /**
  * Destroys GeoXp instance
  * @param config - config parameters
  */
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