[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp**
### Manuale V2
###### April 2021
#
###
# **Description**

Mezzo Forte GeoXp is a client side, event based js library that manages all the core background features of a typical geolocated audio tour.

It maps audio contents to geographical positions, and automatically reproduces them based on some configuration rules.

It’s meant to be used inside any front end interface, regardless of the js framework.

It’s made of four modules.

* **Geo**

    Manages all geolocation logic. It’s based on geolocation API, but it can be used with any external geolocation provider.

* **Audio**

    Manages all audio playback logic. It relies on Howler JS library.

* **Experience**

    It’s the real core of the package, defines automatic actions to be done as a consequence of geolocation updates.

* **Device**

    Static class that provides some common features for the hosting device.

***

# **Install**
`npm install mezzoforte-geoxp`


# **Contents**
* [Key concepts](#key-concepts)
  * [Geo key concepts](#geo-key-concepts)
  * [Audio key concepts](#Audio-key-concepts)
  * [Experience key concepts](#Experience-key-concepts)
    * [Spots](#Spots)
    * [Behavior](#Behavior)
    * [Patterns](#Patterns)
    * [Spots order](#Spots-order)
    * [Content replay](#Content-replay)
    * [Content overlap](#Content-overlap)

* [Usage](#usage)
  * [Configuration](#Configuration)
  * [Construction and disposal](#Construction-and-disposal)
  * [Events subscription](#Events-subscription)
  * [Core methods](#Core-methods)
  * [Audio interaction](#Audio-interaction)

* [Best practices](#best-practices)
  * [Design configuration for a specific use](#Design-configuration-for-a-specific-use)
  * [Positions overlap](#Positions-overlap)
  * [Mobile integration](#Mobile-integration)
  * [Geolocation providers](#Geolocation-providers)

***

# **Key concepts**
## **Geo key concepts**
### Position
_TODO_


## **Audio key concepts**
### Audio content
_TODO_


## **Experience key concepts**
### **Spots**
A GeoXp spot is the core entity of an experience and represents a relation between a position and an audio content. For example, if you want the user to listen the file audio_1.mp3 in the position position_A, it will be necessary to create a new spot that associate the audio_1 content to the position_A geographical coordinates (in the [**Usage**](#usage) section we describe in detail how to make this configuration).

This is to say, more than one spot can be linked to a certain position, the same audio content can be linked to multiple positions.


### **Behavior**
The event behavior for a GeoXp spot is designed as follows:

<img src="https://mezzoforte.design/img/geoxp-spot.png" alt="GeoXp spot" width="550"/>

User enters the position circle (its active area), spot becomes “inside”, associated audio content is played.
User leaves the position active area, but he’s still inside the deadband, the audio content is still playing.
User leaves the deadband, spot becomes “outgoing”, the audio content fades out and stops.

### **Patterns**
A list of spots is called a pattern. Patterns define the overall behavior of its spots.
Multiple patterns could be active at any time, providing multiple simultaneous experiences (eg: one pattern defines what speeches to play in certain positions, one pattern defines background audio effects to play alongside the speeches, using the same positions).
Patterns are separate entities that don’t talk to each other, spots order and content overlap management are independent between patterns.

### **Spots order**
GeoXP provides limited content queue management. This can be achieved using the spot “after” property.
If after is defined, geoXp will not reproduce a certain spot content unless the after spot has already been played.

### **Content replay**
When content starts playing, a spot becomes “visited”.
When the user reenters a visited spot, geoXp will not play its content. It will throw a notification instead, to let the user choose what to do.
This behavior can be overridden using the pattern “replay” option. In this case, when the user reenters a visited spot, its content replays as usual.
Spots could be “unvisited” (actually forcing an immediate replay) using the replaySpot() method.

### **Content overlap**
When the user is actually inside multiple spots at the same time (locations are overlapping, multiple spots are linked to the same location), as default behavior geoXp will play one content at a time, with no overlapping. When the first audio finishes, the other starts.
This can be overridden using the pattern “overlap” configuration option.

### **Device key concepts**
Device is a utility class useful to detect users’ device features, platform type, browser and OS. It’s a static class and is used internally to adjust some modules configurations.

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
If no default object is provided, geoXp will use its hardcoded default configuration.


## **Geo configuration**
Provides information for geolocation module configuration.

```javascript
geo: {
  positions: [
    {
      _id: string // unique position id
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
      _id: string // unique content id
      label: string // audio name or description
      url: string // content url (local or remote)
    }
  ],
  default: {
    test: string // url for test sound
    silence: string // url for silence sound
    unlock: string // url for unlock sound
    visited: string // url for spot already visited sound
  }
```

## **Experience configuration**
Experience configuration provides relations between geolocation and content.

```javascript
experience: {
  patterns: [ // array of patterns, each with its spots list and parameters
    {
      _id: string // pattern unique id
      label: string // pattern name or description
      disabled: bool // pattern is disabled
      replay: bool // spots are automatically replayed
      overlap: bool // content playback can overlap
      spot: [ // array of pattern’s spots
        {
          _id: string // spot unique id
          position: // position id as in geo position configuration
          audio: // audio id as in audio sound configuration
          after: // id of the previous mandatory spot (see “key concepts”, “Spot order”)
        }
      ]
    }
  ],
  default: {
    visitedFilter: number // milliseconds before an already visited spot is notified
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


## **Position update**

```javascript
geoXp.on('position', position => { /* ... */ })
```

Position update occurs every time geolocation API receives a new location.
The new location is provided to the callback as geolocation API standard position object (https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition).


## **Spot incoming**

```javascript
geoXp.on('incoming', spot => { /* ... */ })
```

User entered the prefetch distance of a spot. GeoXp will start related audio pre loading.
The object provided as callback argument carries all the spot info based on configuration.

```javascript
spot: {
	_id: string,
	position: string (position _id as in geo configuration)
	audio: string (audio _id as in audio configuration)
	after: string (spot _id as in experience pattern configuration)
}
```

## **Spot active**

```javascript
geoXp.on('active', spot => { /* ... */ })
```

A spot is being activated. GeoXp will play the content associated.
The object provided as callback argument carries all the spot info based on configuration.

## **Spot visited**

```javascript
geoXp.on('visited', spot => { /* ... */ })
```

User entered a spot which he already visited before.
The object provided as callback argument carries all the spot info based on configuration.

## **Spot outgoing**

```javascript
geoXp.on('outgoing', spot => { /* ... */ })
```

User exited a spot. GeoXp will stop playing related content.
The object provided as callback argument carries all the spot info based on configuration.


## **Content playing**

```javascript
geoXp.on('play', audio => { /* ... */ })
```

Some audio content just started playing.
Callback argument is an object with the audio information.

```javascript
audio: {
	_id: string,
  // ... TODO ...
}
```

## **Content ended**

```javascript
geoXp.on('end', audio =>  {})
```

Some audio content just ended (either for completion or because it has been stopped).
Callback argument is an object with the audio information.

```javascript
audio: {
	_id: string,
  // ... TODO ...
}
```

## **Core methods**
###  **`.unlock()`**
Unlock method forces geolocation api and howler js activation. This is needed in mobile integration, to avoid browser locking the functionalities when app goes background.

### **`.disablePattern(id: string)`**
Forces deactivation of a configured pattern based.
Id is the _id of the pattern to set as in experience configuration.

### **`.enablePattern(id: string)`**
Forces re-activation of a configured pattern that has been previously disabled with `disablePattern` method.
Id is the _id of the pattern to set as in experience configuration.

### **`.internalGeolocation(enabled: boolean)`**
Enables/disables defalut internal geolocation system ([Geolocation API](https://developer.mozilla.org/it/docs/Web/API/Geolocation)).
In case you has an external geolocation system you may want to disable this calling `internalGeolocation(false)` and update the position with
the `updateGeolocation` method.

### **`.updateGeolocation(position: object)`**
Provides external geolocation updates (in case geolocation API isn’t available and/or you want to use an external Geolocation system).
Position must be passed as [Geolocation API standard position object](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition).

### **`.hasActiveSpots(): bool`**
Returns true if there are active spots.

### **`.hasAudioPlaying(overlap: boolean): bool`**
_TODO_

### **`.getSpot(id: string): object`**
Gets spot info, providing it’s id, as object.

```javascript
spot: {
	_id: string,
	position: string // (position _id as in geo configuration)
	audio: string // (audio _id as in audio configuration)
	after: string // (spot _id as in experience pattern configuration)
}
```

### **`.replaySpot(?id: string)`**
Marks a visited spot as unvisited, based on its id.

If no id is provided, all current inside spots are marked as unvisited.
Marking a spot as unvisited will make its content play again when the user enters its configured location.

### **`.reload(config: object)`**
Reloads geoXp instance with a new configuration. Every configuration change needs a reload() to be processed.

### **`.destroy()`**
Destroys geoXp instance and all of its subscriptions.

## **`Audio interaction`**
GeoXp manages all audio content on its own. However, it’s possible to interact with it when needed (eg: showing audio current seek, playing / pausing audio, etc.).

All methods for audio interaction are available in the audio module.

### **`.audio.getAudio(id: string): object`**
Gets audio content info based on its id as in audio configuration.

It returns an object containing all audio current state.
```javascript
{
  id, // audio id
  label, // audio name or description
  duration, // audio content duration
  seek, // audio current seek (if playing)
  playing // audio is currently playing
}
```

### **`.audio.load(id: string)`**
Loads an audio content in buffer without playing it, based on its id as in audio configuration.

### **`.audio.play(id: string, fade: number, volume: number)`**
Plays audio immediately based on its id as in audio configuration.

Fade and volume are optional parameters that can be used to customize the playback.

Fade represents the duration of the audio fading, in milliseconds.
Volume is a number from 0 to 1 (full volume).


### **`.audio.stop(id: string, fade: number)`**
Stops audio based on its id as in audio configuration (if it’s actually playing).

Fade is an optional parameter, representing the duration of the audio fading.

### **`.audio.pause(id: string)`**
Pauses audio playback based on its id as in audio configuration (if it’s playing).

### **`.audio.seek(id: string, seek: number): number`**
Gets the current seek of an audio content, based on its id as in audio configuration.

If seek parameter is passed, the current audio seek is set.

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

* that user must hear the content every time he is in the right location

    `config.experience.patterns[x].replay = true`


## Positions overlap
Unless content overlapping is desired, it’s better to avoid positions overlap when possible.

If two pattern spots are actually near each other, try setting radiuses in a way that fencing doesn’t overlap (maybe by setting a small radius and a big delta: user has to be close to the position for the content to start, but the content will not stop if he walks away).

If overlapping isn’t avoidable, make sure to apply filtering with `experience.default.visitedFilter` (usually 5000 or 10000 ms is enough).

## Mobile integration
Most mobile browsers will block Howler and geolocation API after some time with no user interaction. Some system to force a periodic unlocking (using the `unlock()` method) is suggested.

## Geolocation providers
Some framework or browser will not support geolocation API, or have better ways to get the device location. It’s possible to use geoXp with external geolocation providers (eg: Capacitor or native geolocation systems).

Just disable the default geolocation system using `internalGeolocation(false)` and pass the position data to the `updateGeolocation(position)` method as [geolocation API standard position object](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition).
