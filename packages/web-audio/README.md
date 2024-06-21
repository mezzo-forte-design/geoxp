[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp Web Audio**

## **Description**

GeoXpWebAudio plugin provides audio playback features to GeoXpCore module.

Based on howler.js, it can be used in any web browser environment.

***

## **Installation**
`npm install @mezzo-forte/geoxp/web-audio`

## **Contents**
* [Usage](#usage)
  * [Instance creation](#instance-creation)
  * [Configuration](#configuration)
  * [Reload and disposal](#reload-and-disposal)
  * [Events subscription](#events-subscription)
    * [Audio playing](#audio-playing)
    * [Audio playing](#audio-stopped)
    * [Audio ended](#audio-ended)
  * [Audio interaction](#audio-interaction)
  * [API](#api)
* [Best practices](#best-practices)
  * [Mobile integration](#mobile-integration)

* [Examples](#examples)

* [Credits](#credits)

***

## <a name="usage"></a> **Usage**
GeoXpWebAudio is intended for use as a singleton instance. It has to be created once the application starts, based on a configuration object.

### <a name="instance-creation"></a> **Instance creation**
```javascript
// import modules
import GeoXpCore from '@mezzo-forte/geoxp/core';
import GeoXpWebAudio from '@mezzo-forte/geoxp/web-audio';

// create configuration object
const { coreConfig, audioConfig } = { /* your configuration here */ };

// create the GeoXp instances
const geoXpCore = new GeoXpCore(coreConfig);
const geoXpWebAudio = new GeoXpWebAudio(geoXpCore, audioConfig);

```

### <a name="configuration"></a> **Configuration**
GeoXpWebAudio, once created, works without any external intervention. To provide this high level of automation, it has to be accurately configured according to the desired application.
The configuration is provided as a json object.

```javascript
config: {
  sounds: [ // array of audio contents
    {
      id: string // unique content id
      label: string // content name/description
      spotId: // reference spot id as in core configuration
      url: string // content url (local or remote)
      overlap: boolean // audio can overlap others already playing
    }
  ],
  options: {
    test: string // url for test sound
    silence: string // url for silence sound
    fadeInTime: number // fade in time [ms] - default value = 0 ms
    fadeOutTime: number // fade out time [ms] - default value = 1000 ms
  }
}
```

### <a name="reload-and-disposal"></a> **Reload and disposal**

```javascript
// create the GeoXp instances
const geoXpCore = new GeoXpCore(coreConfig);
const geoXpWebAudio = new GeoXpWebAudio(geoXpCore, audioConfig);

// refresh all geoXp state with the given configuration
geoXpCore.reload(coreConfig);
geoXpWebAudio.reload(audioConfig);

// Disposes geoXp web audio
geoXpWebAudio.unload();
```

### <a name="events-subscription"></a> **Events subscription**
GeoXpWebAudio is meant to work automatically based on its configuration, so most of the interaction with it is based on events.
Its event dispatcher (`geoXpWebAudio.event`) is based on [Node.js EventEmitter](https://nodejs.org/api/events.html) and is responsible for events notification to outside subscribers.

Three main methods are wrappped by the `GeoXp` class:
* `geoXpWebAudio.on(eventName, listener)` - adds the `listener` function to the end of the listeners array for the event named `eventName`
* `geoXpWebAudio.once(eventName, listener)` - adds a one-time `listener` function for the event named `eventName`
* `geoXpWebAudio.off(eventName, listener)` - removes the specified `listener` from the listener array for the event named `eventName`

Available events are:

#### <a name="audio-playing"></a> **Audio playing**

```javascript
geoXpWebAudio.on('playing', sound => { /* ... */ })
```

Some audio content just started playing.

#### <a name="audio-ended"></a> **Audio ended**

```javascript
geoXp.on('ended', sound =>  { /* ... */ })
```

Some audio content just ended (listened to the end).

#### <a name="audio-stopped"></a> **Audio stopped**

```javascript
geoXp.on('stopped', sound =>  { /* ... */ })
```

Some audio content just stopped (before its end).

### <a name="audio-interaction"></a> **Audio interaction**
It’s possible to interact with audio when needed (eg: showing audio current seek, playing / pausing audio, etc.).
In facts, the `audio` property of the [`playing`](#audio-playing) event is an `Howl` oject (the Howler.js instance for audio management) that exposes all methods for audio interaction (pause, play, seek).

```javascript
// Sets the volume for all audio contents, 0 to 1 max volume
geoXpWebAudio.setVolume(volume: number);

// Immediately stops all audio currently playing
geoXpWebAudio.stopAll();

// Immediately mutes / unmutes all audio currently playing
geoXpWebAudio.muteAll(mute: boolean);
```

### <a name="api"></a> **API**
All GeoXpWebAudio methods are available in the [documentation page](https://mezzo-forte.gitlab.io/mezzoforte-geoxp/GeoXp.html).

***

## <a name="best-practices"></a> **Best practices**

### <a name="mobile-integration"></a> Mobile integration
Most mobile browsers will block Howler after some time with no user interaction, resulting in unpredictable behavior.
To avoid this, force a periodic unlocking calling the `unlock()` method inside a user interaction (eg: click listerner, etc).

## Contributing

To contribute to this project, fork the repository, work on a development branch and open a MR.
Remember to update the changelog (CHANGELOG.md)!

**Repo admins**: to release a new version, follow these steps:
* verify and test changes
* verify changelog has been updated
* merge MR in `master`
* release a new version with `npm run release --vers=X.Y.Z`
* create a new release in the release section


***

## <a name="examples"></a> Examples
Some configuration examples, for different kind of patterns, can be found inside the [example-patterns](https://gitlab.com/mezzo-forte/mezzoforte-geoxp/-/tree/master/example-patterns).
A basic application, with event usage, can be found inside the [example-web](https://gitlab.com/mezzo-forte/mezzoforte-geoxp/-/tree/master/example-web) folder.

***

## <a name="credits"></a> Credits
* concept - [Mezzo Forte](https://mezzoforte.design/?lang=en)
* development - Francesco Cretti & Giuliano Buratti
* music for example application - [Bensound](https://www.bensound.com)

