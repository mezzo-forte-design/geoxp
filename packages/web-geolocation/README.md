[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp Web Geolocation**

## **Description**

GeoXpWebGeolocation plugin provides user geolocation based on navigator.geolocation API.

It can be used in any web browser environment.

## **Docs**
**[Package docs](https://geoxp.mezzoforte.design/modules/web_geolocation_plugin)**

***

## **Installation**
```bash
# install using npm
npm install @geoxp/web-geolocation

# or using yarn
yarn add @geoxp/web-geolocation
```

## **Contents**
* [Usage](#usage)
  * [Instance creation](#instance-creation)
  * [Configuration](#configuration)
  * [Reload and disposal](#reload-and-disposal)
  * [Events subscription](#events-subscription)
    * [Location](#location)
  * [API](#api)
* [Best practices](#best-practices)
  * [Mobile integration](#mobile-integration)

* [Examples](#examples)

* [Credits](#credits)

***

## **Usage**
GeoXpWebGeolocation is intended for use as a singleton instance. It has to be created once the application starts, based on a configuration object.

### **Instance creation**
```javascript
// import modules
import GeoXpCore from '@geoxp/core';
import GeoXpWebGeolocation from '@geoxp/web-geolocation';

// create configuration object
const { coreConfig, geoConfig } = { /* your configuration here */ };

// create the GeoXp instances
const geoXpCore = new GeoXpCore(coreConfig);
const geoXpWebGeolocation = new GeoXpWebGeolocation(geoXpCore, geoConfig);

```

### **Configuration**
GeoXpWebGeolocation, once created, works without any external intervention. To provide this high level of automation, it has to be accurately configured according to the desired application.
The configuration is provided as a json object.

```javascript
config: {
  enableHighAccuracy: boolean // The application would like to receive the best possible results (can increase location fix time)
  maximumAge: number // Maximum age of a possible cached position that is acceptable to return [milliseconds]
  timeout: number // Maximum length of time the device is allowed to take in order to return a position [milliseconds]
}
```

### **Reload and disposal**

```javascript
// create the GeoXp instances
const geoXpCore = new GeoXpCore(coreConfig);
const geoXpWebGeolocation = new GeoXpWebGeolocation(geoXpCore, geoConfig);

// refresh all geoXp state with the given configuration
geoXpCore.reload(coreConfig);
geoXpWebGeolocation.reload(geoConfig);

// Disposes geoXp web geolocation
geoXpWebGeolocation.unload();
```

### **Events subscription**
GeoXpWebGeolocation is meant to work automatically based on its configuration, so most of the interaction with it is based on events.
Its event dispatcher (`geoXpWebGeolocation.event`) is based on [Node.js EventEmitter](https://nodejs.org/api/events.html) and is responsible for events notification to outside subscribers.

Three main methods are wrappped by the `GeoXp` class:
* `geoXpWebGeolocation.on(eventName, listener)` - adds the `listener` function to the end of the listeners array for the event named `eventName`
* `geoXpWebGeolocation.once(eventName, listener)` - adds a one-time `listener` function for the event named `eventName`
* `geoXpWebGeolocation.off(eventName, listener)` - removes the specified `listener` from the listener array for the event named `eventName`

Available events are:

#### **Location**

```javascript
geoXpWebGeolocation.on('location', location => { /* ... */ })
```

User location has been updated.

### **API**
All GeoXpWebAudio methods are available in the [documentation page](https://geoxp.mezzoforte.design//GeoXp.html).

***

## **Best practices**

### Mobile integration
Most mobile browsers will block navigator.geolocation API after some time with no user interaction, resulting in unpredictable behavior.
To avoid this, force a periodic unlocking calling the `unlock()` method inside a user interaction (eg: click listerner, etc).

## Contributing

To contribute to this project, fork the repository, work on a development branch and open a MR.
**Remember to update the changelog (CHANGELOG.md)!**

> **For repo admins**
> To release a new version, follow these steps:
> * verify and test changes
> * verify changelog has been updated
> * merge MR in `main`
> * publish a new version
> * create a new release in the release section


***

## Examples
* Some configuration examples, for different kind of patterns, can be found inside the [examples/guides](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/guides).
* A basic web application, with event usage, can be found inside the [examples/web](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/web) folder.
* An example of GeoXp Web package with TypeScript [examples/web-typescript](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/web-typescript)

***

## Credits
* concept - [Mezzo Forte](https://mezzoforte.design/?lang=en)
* development - Francesco Cretti & Giuliano Buratti
* music for example application - [Bensound](https://www.bensound.com)

