
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
      itinerary: {
        route: [{
          _id
          label
          disabled
          replay
          overlap
          spot: [{
              _id
              position
              audio
              after
          }]
        }],
        default: {
          visitedFilter [s]
        }
      }
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

    // exposes event emitter
    this.event = new EventEmitter();


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
        this.event.emit('incoming', spot);
      });

    // request for audio play
    this.subItineraryActive = this.itinerary.spotActive$
      .subscribe( spot => {

        // play spot audio
        this.audio.play(spot.audio);

        // emits spot active
        this.event.emit('active', spot);
      });

    // alredy visisted spot
    this.subItineraryVisited = this.itinerary.spotVisited$
      .subscribe( spot => {

        // emits spot visided
        this.event.emit('visited', spot);
      });
    
    // request for audio stop
    this.subItineraryOutgoing = this.itinerary.spotOutgoing$
      .subscribe( spot => {

        const fade = 4000; // [s]

        // stop spot audio
        this.audio.stop(spot.audio, fade);

        // emits spot outgoing
        this.event.emit('outgoing', spot);
      });
    

    //////////////////////////////////////////////
    // subscribes to GeoManager position updates
    //////////////////////////////////////////////
    // current position
    this.subGeoPosition = this.geo.position$
      .subscribe ( position => {
        
        // emits current position
        this.event.emit('position', position);
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
        this.event.emit('play', audio);
      });

    // sound finished
    this.subAudioDone = this.audio.done$
      .subscribe( audio => {

        // sends to itineraryManager for processing
        this.itinerary.end(audio);

        // emits ended audio
        this.event.emit('end', audio);
      });
  }

  /**
  * Unlocks geolocation and webaudio APIs
  */
  unlock() {
    this.geo.unlock();
    this.audio.unlock();
  }

  /**
  * Provides external positioning
  * @param position - position data in geolocation api format
  * @returns { boolean }
  */
  updateGeolocation(position) {
    this.geo._geoSuccess(position);
  }

  /**
  * Enables/disables specific route
  * @param id - itinerary id to toggle
  * @param enb - flag for enable/disable
  */
  enableRoute(id, enb) { 
    this.itinerary.enableRoute(id, enb);
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
  * @param id - Id of spot to find
  * @returns { object } - spot found or null
  */
  getSpot(id) {
    return this.itinerary.getSpot(id);
  }

  /**
  * Marks spots as unvisited
  * If no spot id provided, marks all inside spots as unvisited
  * @param id - optional
  */
  replaySpot(id = null) {
    this.itinerary.replaySpot(id);
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
    this.subItineraryVisited.unsubscribe();
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