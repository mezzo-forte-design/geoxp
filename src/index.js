
import { EventEmitter } from 'events';
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
export default class GeoXp extends EventEmitter {
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
        _id;
        label;
        disabled?;
        overlap?;
        replay?;
        spot: [{
          _id;
          position;
          audio;
          after;
        }];
      }];
    }
    */

    super();

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

    // request for audio preloading
    this.subItineraryIncoming = this.itinerary.spotIncoming$
      .subscribe( spot => {
        
        // load spot audio
        this.audio.load(spot.audio);

        // emits spot incoming
        this.emit('incoming', spot);
      });

    // request for audio play
    this.subItineraryActive = this.itinerary.spotActive$
      .subscribe( spot => {

        // play spot audio
        this.audio.play(spot.audio);

        // emits spot active
        this.emit('active', spot);
      });

    // alredy visisted spot
    this.subItineraryVisisted = this.itinerary.spotVisited$
      .subscribe( spot => {

        // emits spot visided
        this.emit('visited', spot);
      });
    
    // request for audio stop
    this.subItineraryOutgoing = this.itinerary.spotOutgoing$
      .subscribe( spot => {

        const fade = 4000; // [s]

        // stop spot audio
        this.audio.stop(spot.audio, fade);

        // emits spot outgoing
        this.emit('outgoing', spot);
      });
    

    //////////////////////////////////////////////
    // subscribes to GeoManager position updates
    //////////////////////////////////////////////
    // current position
    this.subGeoPosition = this.geo.position$
      .subscribe ( position => {
        
        // emits current position
        this.emit('position', position);
      });

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

        // emits playing audio
        this.emit('play', audio);
      });

    // sound finished
    this.subAudioDone = this.audio.done$
      .subscribe( audio => {

        // sends to itineraryManager for processing
        this.itinerary.end(audio);

        // emits ended audio
        this.emit('end', audio);
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
  * Returns true if has active spots
  * @returns { boolean }
  */
  hasActiveSpots() {
    return this.itinerary.hasActiveSpots();
  }

  /**
  * Returns spot by id
  * @param spotId - Id of spot to find
  * @returns { object } - spot found or null
  */
  getSpot(spotId) {
    return this.itinerary.getSpot(spotId);
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
    this.subItineraryIncoming.unsubscribe();
    this.subItineraryActive.unsubscribe();
    this.subItineraryVisisted.unsubscribe();
    this.subItineraryOutgoing.unsubscribe();
    this.subItineraryRefresh.unsubscribe();
    this.subAudioDone.unsubscribe();
    this.subAudioPlay.unsubscribe();
    this.subGeoPosition.unsubscribe();
    this.subGeoInside.unsubscribe();
    this.subGeoOutgoing.unsubscribe();
    this.subGeoIncoming.unsubscribe();
  
    this.geo.unload();
    this.audio.unload();
    this.itinerary.unload();
  }
}