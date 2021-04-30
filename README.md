[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp**
###### April 2021
#
###
# **Description**

Mezzo Forte GeoXp is a client side, event based js library that manages all the core background features of a geolocated audio tour.

It maps audio contents to geographical positions, and automatically reproduces them based on configuration rules.

It’s meant to be used inside any front-end interface, regardless of the js framework.

It’s made of three modules.

* **Geo**

    Manages all geolocation logic. It’s based on geolocation API, but it can be used with any external geolocation provider.

* **Audio**

    Manages all audio playback logic. It relies on Howler JS library.

* **Experience**

    It’s the real core of the package, defines automatic actions to be done as a consequence of geolocation updates.


***

# **Install**
`npm install @mezzo-forte/geoxp`

# **Contents**
* [Key concepts](#key-concepts)
  * [Geo key concepts](#geo-key-concepts)
    * [Positions](#positions)
    * [Geolocation providers](#geolocation-providers)
    * [Minimum accuracy](#minimum-accuracy)
  * [Audio key concepts](#audio-key-concepts)
    * [Audio content](#audio-content)
  * [Experience key concepts](#experience-key-concepts)
    * [Spots](#spots)
    * [Behavior](#behavior)
    * [Patterns](#patterns)
    * [Spots order](#spots-order)
    * [Content replay](#content-replay)
    * [Content overlap](#content-overlap)
    * [Force a spot](#force-a-spot)

* [Usage](#usage)
  * [Configuration](#configuration)
  * [Geo configuration](#geo-configuration)
  * [Audio configuration](#audio-configuration)
  * [Experience configuration](#experience-configuration)
  * [Construction and disposal](#construction-and-disposal)
  * [Events subscription](#events-subscription)
    * [Position update](#position-update)
    * [Spot incoming](#spot-incoming)
    * [Spot active](#spot-active)
    * [Spot visited](#spot-visited)
    * [Spot outgoing](#spot-outgoing)
    * [Content playing](#content-playing)
    * [Content ended](#content-ended)
  * [Core methods](#Core-methods)
  * [Audio interaction](#Audio-interaction)

* [Best practices](#best-practices)
  * [Design configuration for a specific use](#design-configuration-for-a-specific-use)
  * [Positions overlap](#positions-overlap)
  * [Mobile integration](#mobile-integration)
  * [Geolocation providers](#geolocation-providers)

* [Examples](#examples)

***

# **Key concepts**
## **Geo key concepts**
### **Positions**
A GeoXp position is a circular area defined by two geographical coordinates (`{lat, lon}`) a radius and a deadband.
The inner _radius_ defines the **_inside_** position status.
(_radius_ + _deadband_) defines an outer radius that serves hysteresis purposes to avoid abrupt status changes.

### **Geolocation providers**
GeoXp default geolocation provider is the Web [Geolocation API](https://developer.mozilla.org/it/docs/Web/API/Geolocation).
Some framework or browser will not support Geolocation API, or have better ways to get the device location. It’s possible to use GeoXp with external geolocation providers (eg: Capacitor or native geolocation systems).

### **Minimum accuracy**
Every geographical data, coming from the geolocation system, that does not fulfill accuracy requrements will be ignored.

## **Audio key concepts**
### **Audio content**
An audio content can be any audio file, reachable through an URL. GeoXp audio player is based on [Howler.js](https://howlerjs.com/) (see [here](https://github.com/goldfire/howler.js#format-recommendations) for suggested formats).


## **Experience key concepts**
### **Spots**
A GeoXp spot is the core entity of an experience and represents a relation between a position and an audio content. For example, if you want the user to listen the file `audio_1.mp3` in the position `position_A`, it will be necessary to create a new spot that associate the `audio_1` content to the `position_A `geographical coordinates (in the [**Usage**](#usage) section we describe in detail how to make this configuration).

This is to say, more than one spot can be linked to a certain position, the same audio content can be linked to multiple positions.


### **Behavior**
The event behavior for a GeoXp spot is designed as follows:

<img src="https://mezzoforte.design/img/geoxp-spot.png" alt="GeoXp spot" width="550"/>

User enters the position circle (its _inside_ area), spot becomes _active_, associated audio content is played.
User leaves the position _inside_ area, but he’s still inside the deadband, the audio content is still playing.
User leaves the deadband, spot becomes _outgoing_, the audio content fades out and stops.

### **Patterns**
A list of spots is called a pattern. Patterns define the overall behavior of its spots.
Multiple patterns could be active at any time, providing multiple simultaneous experiences (eg: one pattern defines what speeches to play in certain positions, one pattern defines background audio effects to play alongside the speeches, using the same positions).
Patterns are separate entities that don’t talk to each other, spots order and content overlap management are independent between patterns.

### **Spots order**
GeoXP provides limited content queue management. This can be achieved using the spot “after” property.
If after is defined, GeoXp will not reproduce a certain spot content unless the after spot has already been played.

### **Content replay**
When content starts playing, a spot becomes “visited”.
When the user reenters a visited spot, geoXp will not play its content. It will throw a notification instead, to let the user choose what to do.
This behavior can be overridden using the pattern “replay” option. In this case, when the user reenters a visited spot, its content replays as usual.
Spots could be “unvisited” (actually forcing an immediate replay) using the `replaySpot()` method.

### **Content overlap**
When the user is actually inside multiple spots at the same time (locations are overlapping, multiple spots are linked to the same location), as default behavior GeoXp will play one content at a time, with no overlapping. When the first audio finishes, the other starts.
This can be overridden using the pattern “overlap” configuration option.

### **Force a spot**
Forcing a spot activation is possible only in two cases:
* provided GPS signal accuracy is over the threshold of 100 meters (in the case of a poor GPS signal)
* provided GPS accuracy is good and user's position is close to the target spot (in the case of slow location update time and the user has reached a new spot before an update)

Otherwise, spot activation is automatic.

**IMPORTANT - forcing a spot is a _plan B_ when something is not working properly (bad GPS or slow update time). It will interrupt all automatic experience management, until the forced content is finished. After that, all the experience logic will get back to work.**

# **Usage**
GeoXp is intended to be used as a singleton instance. It has to be created once the application starts, based on a configuration object.

## **Configuration**
GeoXp, once created, works without any external intervention. To provide this high level of automation, it has to be accurately configured according to the desired application.
The configuration is provided with a json object made of three parts, each carrying the configuration information for one of the internal modules.

```javascript
config: {
  geo: { /* ... */ },
  audio: { /* ... */ },
  experience: { /* ... */ }
}
```

Configuration for geolocation (*geo*) is a simple map of positions and parameters for geofencing, configuration for audio is a list of all the audio content available.

Configuration for experience is meant to set links between positions and related content.

Each configuration section has a .default child that stores some module working parameters.
If no default object is provided, GeoXp will use its hardcoded default configuration.


## **Geo configuration**
Provides information for geolocation module configuration.

```javascript
geo: {
  positions: [
    {
      id: string // unique position id
      label: string // position name or description
      lat: number // latitude in degrees north
      lon: number // longitude in degrees east
      radius: number // fencing radius in meters
      deadband: number // fencing deadband in meters
      fetch: number // prefetching distance as ratio of the radius, from 1 to n
    }
  ],
  default: {
    minAccuracy: number // minimum acceptable accuracy in meters
    posDeadband: number // default fencing deadband
    playDistance: number // default fencing radius
    fetchDistance: number // default prefetch distance ratio
  }
}
```

## **Audio configuration**
Provides information for audio module configuration.

```javascript
audio: {
  sounds: [ // array of audio contents
    {
      id: string // unique content id
      url: string // content url (local or remote)
    }
  ],
  default: {
    test: string // url for test sound
    silence: string // url for silence sound
    visited: string // url for spot already visited sound
  }
```

## **Experience configuration**
Experience configuration provides relations between geolocation and content.

```javascript
experience: {
  patterns: [ // array of patterns, each with its spots list and parameters
    {
      id: string // pattern unique id
      label: string // pattern name or description
      disabled: bool // pattern is disabled
      replay: bool // spots are automatically replayed
      overlap: bool // content playback can overlap
      spot: [ // array of pattern’s spots
        {
          id: string // spot unique id
          position: // position id as in geo position configuration
          audio: // audio id as in audio sound configuration
          after: // id of the previous mandatory spot (see “key concepts”, “Spot order”)
          label: // spot name or descriptions
        }
      ]
    }
  ],
  default: {
    visitedFilter: number // milliseconds after an already visited spot is notified
  }
}
```
> NOTE - patterns are enabled by deafult. See [core methods](#core-methods) to know how to disable or re-enable them

## **Construction and disposal**

```javascript
// Creates a new geoXp instance
const geoXp = new GeoXp(config);

// Refreshes geoXp for configuration change
geoXp.reload(config);

// Disposes geoXp object
geoXp.destroy();
```

## **Events subscription**
GeoXp is meant to work automatically based on its configuration, so most of the interaction with it is based on events.
Its event dispatcher (`geoXp.event`) is based on [Node.js EventEmitter](https://nodejs.org/api/events.html) and is responsible for events notification to outside subscribers.

Three main methods are wrappped by the `GeoXp` class:
* `geoXp.on(eventName, listener)` - adds the `listener` function to the end of the listeners array for the event named `eventName`
* `geoXp.once(eventName, listener)` - adds a one-time `listener` function for the event named `eventName`
* `geoXp.off(eventName, listener)` - removes the specified `listener` from the listener array for the event named `eventName`

All other `EventEmitter` properties and methos are accessible through the `event` property of `GeoXp` class.

Available events are:

### **Position update**

```javascript
geoXp.on('position', position => { /* ... */ })
```

Position update occurs every time geolocation API receives a new location.
The new location is provided to the callback as [Geolocation API standard position object](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition).


### **Spot incoming**

```javascript
geoXp.on('incoming', spot => { /* ... */ })
```

User entered the prefetch distance of a spot. GeoXp will start related audio pre loading.
The object provided as callback argument carries all the spot info based on configuration.

```javascript
spot: {
	id: string,
	position: string (position id as in geo configuration)
	audio: string (audio id as in audio configuration)
	after: string (spot id as in experience pattern configuration)
}
```

### **Spot active**

```javascript
geoXp.on('active', spot => { /* ... */ })
```

A spot is being activated. GeoXp will play the content associated.
The object provided as callback argument carries all the spot info based on configuration.

### **Spot visited**

```javascript
geoXp.on('visited', spot => { /* ... */ })
```

User entered a spot which he already visited before.
The object provided as callback argument carries all the spot info based on configuration.

### **Spot outgoing**

```javascript
geoXp.on('outgoing', spot => { /* ... */ })
```

User exited a spot. GeoXp will stop playing related content.
The object provided as callback argument carries all the spot info based on configuration.


### **Content playing**

```javascript
geoXp.on('play', audio => { /* ... */ })
```

Some audio content just started playing.
Callback argument is an object with the audio information.

```javascript
audio: {
  id: string, // is the Howler instance audio id. Is composed as spotId-audioId
  overlap: boolean,
  playWhenReady: boolean,
  spot: { // spot that caused playback
    id: string, // spot id
    label: string, // spot label
    audio: string, // audio id
    postion: string, // position id
    after: string
  }
  audio: Howler.Howl // howler instance
}
```

### **Content ended**

```javascript
geoXp.on('stop', audio =>  { /* ... */ })
```

Some audio content just stopped (either for completion or because it has been stopped).
Callback argument is an object with the audio information.

```javascript
audio: {
  id: string, // is the Howler instance audio id. Is composed as spotId-audioId
  overlap: boolean,
  playWhenReady: boolean,
  spot: { // spot that caused playback
    id: string, // spot id
    label: string, // spot label
    audio: string, // audio id
    postion: string, // position id
    after: string
  }
  audio: Howler.Howl // howler instance
}
```

## **Core methods**
###  **`.unlock()`**
Unlock method forces geolocation api and howler js activation. This is needed in mobile integration, to avoid browser locking the functionalities when app goes background.

**IMPORTANT - call this method within a user action, such as a click listener!**

### **`.disablePattern(id: string)`**
Forces deactivation of a configured pattern.
Id is the id of the pattern to set as in experience configuration.

### **`.enablePattern(id: string)`**
Forces re-activation of a configured pattern that has been previously disabled with `disablePattern` method.
Id is the id of the pattern to set as in experience configuration.

### **`.internalGeolocation(enabled: boolean)`**
Enables/disables defalut internal geolocation system ([Geolocation API](https://developer.mozilla.org/it/docs/Web/API/Geolocation)).
In case you have an external geolocation system, you may want to disable this calling `internalGeolocation(false)` and update the position with the `updateGeolocation` method.

### **`.updateGeolocation(position: object)`**
Provides external geolocation updates (in case geolocation API isn’t available and/or you want to use an external Geolocation system).
Position must be passed as [Geolocation API standard position object](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition).
Can also be used for development purposes, to simulate user location.

### **`.hasActiveSpots(): bool`**
Returns true if there are active spots.

### **`.hasAudioPlaying(overlap: boolean): bool`**
Checks if any sound is playing.

### **`.getSpot(id: string): object`**
Gets spot info as object:

```javascript
spot: {
	id: string,
	position: string // (position id as in geo configuration)
	audio: string // (audio id as in audio configuration)
	after: string // (spot id as in experience pattern configuration)
}
```

### **`.replaySpot(?id: string)`**
Marks a visited spot as unvisited, based on its id.

If no id is provided, all current inside spots are marked as unvisited.
Marking a spot as unvisited will make its content play again when the user enters its configured location.

### **`.forceSpot(id: string)`**
If possible, forces a spot activation. See [Focre a spot](#force-a-spot).

### **`.canForceSpot(id: string): boolean`**
Checks if a spot can be forced.

### **`.removeForce()`**
If there are foced spots, removes the _forced_ condition and restores the normal automatic experience logic (this will not necessary stop audio playback).

### **`.reload(config: object)`**
Reloads geoXp instance with a new configuration. Every configuration change needs a reload() to be processed.

### **`.destroy()`**
Destroys geoXp instance and all of its subscriptions.

## **`Audio interaction`**
GeoXp manages all audio content on its own.
However, it’s possible to interact with it when needed (eg: showing audio current seek, playing / pausing audio, etc.).
In facts, the `audio` property of the [`play`](#content-playing) and [`stop`](#content-ended) events is an `Howl` oject (the Howler.js instance for audio management) that exposes all methods for audio interaction (pause, play, seek).

### **`.audio.setVolume(volume: number)`**
Sets the volume for all audio contents (wether they are playing or not).
Ranges from 0 to 1 (full volume).

### **`.audio.stopAll()`**
Immediately stops all audio currently playing.

### **`.audio.muteAll()`**
Immediately mute all audio currently playing.


***

# Best practices
## Design configuration for a specific use
Behavior of geoXp covers a wide variety of applications.
This broad approach means that, to guarantee the user experience good flow and consistency, some effort needs to be spent on adopting an optimal configuration for the desired result.

For example, geoXp is used for an audio guide of a museum tour.

The content is made of speeches, in which a guide is explaining historical facts about different museum spots.

* This means that content cannot overlap

    `config.experience.patterns[x].overlap = false`

* that user must hear the content just once

    `config.experience.patterns[x].replay = false`


Now, let’s change application. GeoXp is used to play ambient sounds at certain locations.

* This means that content can overlap

    `config.experience.patterns[x].overlap = true`

* that user must hear the content every time is in the right location

    `config.experience.patterns[x].replay = true`


## Positions overlap
Unless content overlapping is desired, it’s better to avoid positions overlap when possible.

If two pattern spots are actually near each other, try setting radiuses in a way that fencing doesn’t overlap (maybe by setting a small radius and a big delta: user has to be close to the position for the content to start, but the content will not stop if he walks away).

If overlapping isn’t avoidable, make sure to apply filtering with `experience.default.visitedFilter` (usually 5000 or 10000 ms is enough).

## Mobile integration
Most mobile browsers will block Howler and Geolocation API after some time with no user interaction. Some system to force a periodic unlocking (using the `unlock()` method) is suggested.

***

# Examples
Some configuration examples, for different kind of patterns, can be found inside the [example-patterns](https://gitlab.com/mezzo-forte/mezzoforte-geoxp/-/tree/master/example-patterns).
A basic application, with event usage, can be found inside the [example-app](https://gitlab.com/mezzo-forte/mezzoforte-geoxp/-/tree/master/example-app) folder.

