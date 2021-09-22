import { EventEmitter } from 'events';

/* CORE MODULES */
import GeoManager from './GeoManager';

import AudioManager from './AudioManager';

import ExperienceManager from './ExperienceManager';

/* UTILS */
import Device from './utils/Device';
import { isObjectLike } from './utils/helpers';


//////////////////////////////////////////////
// typedefs for jdoc
//////////////////////////////////////////////

/**
* @typedef {Object} GeoCfg
* @property { Object[] } positions - Geo positions
* @property { string } positions[].id - Position id
* @property { string } positions[].label - Position name/desc
* @property { number } positions[].lat - Position latitude [degrees North]
* @property { number } positions[].lon - Position longitude [degrees East]
* @property { number } positions[].radius - Position inner radius [meters]
* @property { number } positions[].deadband - Position deadband from inner radius [meters]
* @property { number } positions[].fetch - Radius for content prefetching [rate of radius]
* @property { Object } options - Geo options
* @property { number } options.enableHighAccuracy - @see https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions/enableHighAccuracy [boolean]
* @property { number } options.accuracy - Min acceptable accuracy [meters]
* @property { number } options.defaultDeadband - Default deadband [meters]
* @property { number } options.defaultRadius - Default position radius [meters]
* @property { number } options.defaultFetch - Default prefetch distance [meters]
*/

/**
* @typedef {Object} AudioCfg
* @property { Object[] } sounds - Audio sounds
* @property { string } sounds[].id - Sound id
* @property { string } sounds[].label - Sound name/desc
* @property { string } sounds[].url - Sound url, local or remote
* @property { Object } options - Audio options
* @property { string } options.test - Test sound url
* @property { string } options.silence - Silence sound url
* @property { string } options.visited - Visited spot audio url
* @property { string } options.fadeInTime - fade time after play [ms]
* @property { string } options.fadeOutTime - fade time before stop [ms]
*/

/**
* @typedef {Object} ExperienceCfg
* @property { string } patterns[].id - Pattern id
* @property { string } patterns[].label - Pattern name/desc
* @property { boolean } [patterns[].disabled = null] - Pattern is disabled
* @property { boolean } [patterns[].replay = null] - Pattern spots are replayed by default
* @property { boolean } [patterns[].overlap = null] - Pattern spots can overlap (more than one can be active at the same time)
* @property { Object[] } patterns[].spots - Pattern spots
* @property { string } patterns[].spots[].id - Spot id
* @property { string } patterns[].spots[].position - Spot linked position id
* @property { string } patterns[].spots[].audio - Spot linked audio id
* @property { string } [patterns[].spots[].after = null] - Spot can go active only after this spot id has been visited
* @property { string } [patterns[].spots[].notAfter = null] - Spot cannot go active after this spot id has been visited
* @property { Object } options - Experience options
* @property { number } options.visitedFilter - Time before visisted spot is notified for filtering [seconds]
*/

/**
* @typedef {Object} Spot
* @property { string } id - Spot id
* @property { string } label - Spot name/desc
* @property { string } position - Spot linked position id
* @property { string } audio - Spot linked audio id
* @property { string } [after = null] - Spot can go active only after this spot id has been visited
* @property { string } [notAfter = null] - Spot cannot go active after this spot id has been visited
*/

/**
* @typedef {Object} Audio
* @property { string } id - Audio id
* @property { boolean } overlap - Audio can overlap with others yet playing
* @property { boolean } playWhenReady - Audio is to be played immediately when loaded
* @property { Spot } spot - Spot that owns this audio content
* @property { Object } audio - Audio instance as [Howler.Howl] {@link https://pub.dev/documentation/howler/latest/howler/Howl-class.html}
*/

/**
* play | end event listener
* @callback audioListener
* @param { Audio } audio
*/

/**
* incoming | active | visited | ougoing event listener
* @callback spotListener
* @param { Spot } spot
*/


//////////////////////////////////////////////
// geoXp class
//////////////////////////////////////////////

/**
* Creates GeoXp class.
* GeoXp manages the MezzoForte Geo Experience
* @param { Object } config - Config options
* @param { GeoCfg } config.geo - Geo config options
* @param { AudioCfg } config.audio - Audio config options
* @param { ExperienceCfg } config.experience - Experience config options
* @returns { Object } GeoXp singleton instance
* @constructor
*/
class GeoXp {
  constructor(config) {

    // checks for config object
    if (!config || !isObjectLike(config)) {
      console.error('[GeoXp] - Missing or invalid config object! GeoXp needs a configuration object when creating an instance. Check the docs for details');
      return;
    }

    if (!config.experience || !isObjectLike(config.experience)) {
      console.error('[ExperienceManager] - Missing or invalid experience config! GeoXp needs an experience object in the configuration file. Check the docs for details');
      return;
    }

    if (!config.geo || !isObjectLike(config.geo)) {
      console.error('[GeoManager] - Missing or invalid geo config! GeoXp needs a geo object in the configuration file. Check the docs for details');
      return;
    }

    if (!config.audio || !isObjectLike(config.audio)) {
      console.error('[AudioManager] - Missing or invalid audio config! GeoXp needs an audio object in the configuration file. Check the docs for details');
      return;
    }

    this._config = config;

    // instantiates modules
    this.geo = new GeoManager(config.geo);
    this.audio = new AudioManager(config.audio);
    this.experience = new ExperienceManager(config.experience);

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
      .subscribe(info => {

        // load spot audio
        this.audio.load(info.spot, info.overlap);

        // emits spot incoming
        this.event.emit('incoming', info.spot);
      });

    // request for audio play
    this.subExperienceActive = this.experience.spotActive$
      .subscribe(info => {

        // play spot audio
        this.audio.play(info.spot, info.overlap);

        // emits spot active
        this.event.emit('active', info.spot);
      });

    // alredy visisted spot
    this.subExperienceVisited = this.experience.spotVisited$
      .subscribe(spot => {

        // emits spot visided
        this.event.emit('visited', spot);
      });

    // request for audio stop
    this.subExperienceOutgoing = this.experience.spotOutgoing$
      .subscribe(spot => {

        // stop spot audio
        this.audio.stop(spot);

        // emits spot outgoing
        this.event.emit('outgoing', spot);
      });


    //////////////////////////////////////////////
    // subscribes to GeoManager position updates
    //////////////////////////////////////////////
    // current position
    this.subGeoPosition = this.geo.position$
      .subscribe(position => {

        // emits current position
        this.event.emit('position', position);
      });

    // incoming spots
    this.subGeoIncoming = this.geo.incoming$
      .subscribe(position => {

        // sends to experienceManager for processing
        this.experience.incoming(position);
      });

    // inside spots
    this.subGeoInside = this.geo.inside$
      .subscribe(position => {

        // if forced, do not notify position
        if (this.experience.forced) return;

        // sends to experienceManager for processing
        this.experience.inside(position);
      });

    // outgoing spot
    this.subGeoOutgoing = this.geo.outgoing$
      .subscribe(position => {

        // sends to experienceManager for processing
        this.experience.outgoing(position);
      });


    //////////////////////////////////////////////
    // subscribes to AudioManager events
    //////////////////////////////////////////////
    // sound playing
    this.subAudioPlay = this.audio.play$
      .subscribe(audio => {

        // sends to experienceManager for processing
        this.experience.playing(audio.spot);

        // emits playing audio
        this.event.emit('play', audio);
      });

    // sound finished
    this.subAudioDone = this.audio.done$
      .subscribe(audio => {

        // sends to experienceManager for processing
        const removeForce = this.experience.end(audio.spot);

        // removes forcing
        if (removeForce) {
          this.removeForce();
        }

        // emits stopped audio
        this.event.emit('stop', audio);
      });
  }

  /**
  * Unlock method forces geolocation api and howler js activation.
  * This is needed in mobile integration, to avoid browser locking the functionalities when app goes background
  * **IMPORTANT - call this method within a user action, such as a click listener!**
  */
  unlock() {
    this.geo.unlock();
    this.audio.unlock();
  }

  /**
  * Enables/disables defalut internal geolocation system [Geolocation API]{@link https://developer.mozilla.org/it/docs/Web/API/Geolocation}.
  * In case you have an external geolocation system, you may want to disable this calling `internalGeolocation(false)` and update the position with the `updateGeolocation` method.
  * @param { boolean } enabled - enable or disable
  */
  internalGeolocation(enabled) {
    this.geo.internalGeolocation(enabled);
  }

  /**
  * Provides external geolocation updates (in case geolocation API isn’t available and/or you want to use an external Geolocation system).
  * Can also be used for development purposes, to simulate user location
  * @param { Object } position - position data in [Geolocation API position format]{@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition}
  */
  updateGeolocation(position) {
    this.geo._geoSuccess(position);
  }

  /**
  * Enables a configured experience pattern
  * @param { string } id - pattern id to enable
  */
  enablePattern(id) {
    this.experience.enablePattern(id);
  }

  /**
  * Disables a configured experience pattern
  * @param { string } id - pattern id to disable
  */
  disablePattern(id) {
    this.experience.disablePattern(id);
  }

  /**
  * Returns true if has active spots
  * @returns { boolean } Some spots are active
  */
  hasActiveSpots() {
    return this.experience.hasActiveSpots();
  }

  /**
  * Returns spot by id
  * @param { string } id - id of spot to find
  * @returns { Spot | null } Spot found or null
  */
  getSpot(id) {
    return this.experience.getSpot(id);
  }

  /**
  * Marks spots as unvisited.
  * If no spot id provided, marks all inside spots as unvisited
  * @param { string } [id = null] - id of spot to unvisit
  */
  replaySpot(id = null) {
    this.experience.replaySpot(id);
  }

  /**
  * Checks if manual mode is available.
  * Rules are:
  * Your gps accuracy is really bad
  * You are not too far away
  * @param { string } id - id of spot to force
  * @returns { boolean } Spot force is available
  * */
  canForceSpot(id) {

    // checks if can force current spot based on its position
    const position = this.experience.getSpot(id).position;
    return this.geo.canForceSpot(position);
  }

  /**
  * Forces spot activation (manual mode)
  * Forces other spots deactivation unless overlapping
  * Rules are
  * Your gps accuracy is really bad
  * You are not too far away
  * @param { string } id - spot id
  * */
  forceSpot(id) {

    // checks if can be forced
    if (!this.canForceSpot(id)) return;

    // stops internal geolocation
    this.geo.internalGeolocation(false);

    // forces spot
    this.experience.forceSpot(id);
  }

  /**
  * Removes the forced spot activation
  * */
  removeForce() {
    this.experience.forced = null;
    this.geo.internalGeolocation(true);
    this.geo.refresh();
  }

  /**
  * Checks if any sound is playing
  * @param { boolean } [overlap = false] - if true, excludes overlapping audios
  * @returns { boolean } Sounds are playing
  * */
  hasAudioPlaying(overlap = false) {
    return this.audio.hasAudioPlaying(overlap);
  }

  /**
  * Loads a new configuration
  * @param { Object } config - Config options
  * @param { GeoCfg } config.geo - Geo config options
  * @param { AudioCfg } config.audio - Audio config options
  * @param { ExperienceCfg } config.experience - Experience config options
  */
  reload(config) {
    this._config = config;
    this.geo.reload(config.geo);
    this.audio.reload(config.audio);
    this.experience.reload(config.experience);
  }

  /**
  * Destroys GeoXp instance
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

  /**
  * Event wrapper on
  * @param { string } eventName - 'incoming', 'active', 'visited', 'outgoing', 'position', 'play', 'end'
  * @param { spotListener | audioListener } listener - listener
  */
  on(eventName, listener) {
    if (typeof listener !== 'function') {
      console.error('[GeoXp EventEmitter - on] listener must be a function');
      return;
    }

    this.event.on(eventName, listener);
  }

  /**
  * Event wrapper once
  * @param { string } eventName - 'incoming', 'active', 'visited', 'outgoing', 'position', 'play', 'end'
  * @param { spotListener | audioListener } listener - listener
  */
  once(eventName, listener) {
    if (typeof listener !== 'function') {
      console.error('[GeoXp EventEmitter - on] listener must be a function');
      return;
    }

    this.event.once(eventName, listener);
  }

  /**
  * Event wrapper off
  * @param { string } eventName - 'incoming', 'active', 'visited', 'outgoing', 'position', 'play', 'end'
  * @param { spotListener | audioListener } listener - listener
  */
  off(eventName, listener) {
    if (typeof listener !== 'function') {
      console.error('[GeoXp EventEmitter - on] listener must be a function');
      return;
    }

    this.event.off(eventName, listener);
  }
}

export default GeoXp;