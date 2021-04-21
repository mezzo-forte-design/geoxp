
import { EventEmitter } from 'events';
import GeoManager from './GeoManager';
import AudioManager from './AudioManager';
import ExperienceManager from './ExperienceManager';
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
        positions: [{
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
        sounds: [{
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
      experience: {
        patterns: [{
          _id
          label
          disabled
          replay
          overlap
          spots: [{
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
    this.experience = new ExperienceManager(config.experience);

    // sets minimum manual mode precision
    this.forceSpotMinimumPrecision = 100;

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
    this.subExperienceRefresh = this.experience.geoRefresh$
      .subscribe(() => {

        // resend inside positions
        this.geo.refresh();
      });

    // request for audio preloading
    this.subExperienceIncoming = this.experience.spotIncoming$
      .subscribe( spot => {
        
        // load spot audio
        this.audio.load(spot.audio);

        // emits spot incoming
        this.event.emit('incoming', spot);
      });

    // request for audio play
    this.subExperienceActive = this.experience.spotActive$
      .subscribe( info => {

        // play spot audio
        this.audio.play(info.spot.audio, 0, 1, info.overlap);

        // emits spot active
        this.event.emit('active', info.spot);
      });

    // alredy visisted spot
    this.subExperienceVisited = this.experience.spotVisited$
      .subscribe( spot => {

        // emits spot visided
        this.event.emit('visited', spot);
      });
    
    // request for audio stop
    this.subExperienceOutgoing = this.experience.spotOutgoing$
      .subscribe( spot => {

        const fade = 3000; // [s]

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

        // sends to experienceManager for processing
        this.experience.incoming(position);
      });
    
    // inside spots
    this.subGeoInside = this.geo.inside$
      .subscribe( position => { 

        // sends to experienceManager for processing
        this.experience.inside(position);
      });

    // outgoing spot
    this.subGeoOutgoing = this.geo.outgoing$
      .subscribe( position => {

        // sends to experienceManager for processing
        this.experience.outgoing(position);
      });
    

    //////////////////////////////////////////////
    // subscribes to AudioManager events
    //////////////////////////////////////////////
    // sound playing
    this.subAudioPlay = this.audio.play$
      .subscribe( audio => {

        // sends to experienceManager for processing
        this.experience.playing(audio);

        // emits playing audio
        this.event.emit('play', audio);
      });

    // sound finished
    this.subAudioDone = this.audio.done$
      .subscribe( audio => {

        // sends to experienceManager for processing
        this.experience.end(audio);

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
  * Enables / disables internal geolocation updates
  * @param enabled - enable flag
  */ 
  internalGeolocation(enabled) {
    this.geo.internalGeolocation(enabled);
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
  * Enables/disables specific pattern
  * @param id - pattern id to toggle
  * @param enb - flag for enable/disable
  */
  enablePattern(id, enb) { 
    this.experience.enablePattern(id, enb);
  }

  /**
  * Returns true if has active spots
  * @returns { boolean }
  */
  hasActiveSpots() {
    return this.experience.hasActiveSpots();
  }

  /**
  * Returns spot by id
  * @param id - Id of spot to find
  * @returns { object } - spot found or null
  */
  getSpot(id) {
    return this.experience.getSpot(id);
  }

  /**
  * Marks spots as unvisited
  * If no spot id provided, marks all inside spots as unvisited
  * @param id - optional
  */
  replaySpot(id = null) {
    this.experience.replaySpot(id);
  }

  /**
  * Checks if manual mode is available
  * @returns { boolean }
  * */
  canForceSpot() {
    if (this.geo.lastPosition && this.geo.lastPosition.coords.accuracy > this.forceSpotMinimumPrecision) {
      return true;
    } else return false;
  }

  /**
  * Forces spot activation
  * Forces other spots deactivation unless overlapping
  * Rules are
  * GPS precision > 100 m
  * GPS precision <= 100 m & 
  * @param id - spot id
  * */
  forceSpot(id) {
    console.log('force',this.geo.lastPosition);
    if (this.geo.lastPosition && this.geo.lastPosition.coords.accuracy > this.forceSpotMinimumPrecision) {
      this.experience.forceSpot(id);
    } else {
      console.error('[index.forceSpot] - Force is forbidden');
    }
  }

  /**
  * Checks if any sound is playing
  * @param overlap - if true, exclude overlapping audios
  * @returns { boolean }
  * */
  hasAudioPlaying(overlap = false) {
    return this.audio.hasAudioPlaying(overlap);
  }

  /**
  * Loads a new configuration
  * @param config - config parameters
  */
  reload(config) {
    this._config = config;
    this.geo.reload(config.geo);
    this.audio.reload(config.audio);
    this.experience.reload(config.experience);
  }

  /**
  * Destroys GeoXp instance
  * @param config - config parameters
  */
  destroy() {
    this.subExperienceIncoming.unsubscribe();
    this.subExperienceActive.unsubscribe();
    this.subExperienceVisited.unsubscribe();
    this.subExperienceOutgoing.unsubscribe();
    this.subExperienceRefresh.unsubscribe();
    this.subAudioDone.unsubscribe();
    this.subAudioPlay.unsubscribe();
    this.subGeoPosition.unsubscribe();
    this.subGeoInside.unsubscribe();
    this.subGeoOutgoing.unsubscribe();
    this.subGeoIncoming.unsubscribe();
  
    this.geo.unload();
    this.audio.unload();
    this.experience.unload();
  }
}