[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp Web**

## **Description**
GeoXp Web is a library that unifies four essential packages — `Core`, `Web Audio`, `Web Geolocation`, and `Web Storage` — into a single, easy-to-use package. It is designed to simplify the initialization and management of these tools for developers working in web environments.

***

## **Install**
```bash
# install using npm
npm install @geoxp/web

# or using yarn
yarn add @geoxp/web
```

***

## Features

- **Unified Package**: Combines `GeoXp Core`, `Web-Audio`, `Web-Geolocation`, and `Web-Storage` into one convenient library.
- **Optimized for Web**: Tailored for web browser environments, reducing the complexity of managing multiple separate imports and initializations.
- **Flexible Configuration**: Accepts a configuration object to set up the individual packages (`core`, `audio`, `geolocation`, `storage`). Refer to the respective package documentation for specific configuration options.
- **Event Management Interfaces**: Provides built-in interfaces to handle events seamlessly.
- **Direct Access to Instances**: Allows direct access to individual package instances via `core`, `audio`, `geolocation`, and `storage` properties.

## **Usage**
GeoXp Web is intended for usage as a singleton instance. It has to be created once the application starts, based on a configuration object.

## **Instance creation**
```javascript
import GeoXpWeb from '@geoxp/web';

const config = {
  core: { /* configuration for GeoXp Core */ },
  audio: { /* configuration for Web Audio */ },
  geolocation: { /* configuration for Web Geolocation */ },
  storage: { /* configuration for Web Storage */ },
};

const geoXp = new GeoXpWeb(config);
```

### **Configuration**
GeoXpWeb, once created, works without any external intervention. To provide this high level of automation, it has to be accurately configured according to the desired application.
The configuration respects each of the four packages specific configurations (see their docs for details).

### **Reload**

```javascript
// Refreshes all GeoXpWeb state with the given configuration
geoXp.reload(config);
```

### **API**
Once initialized, you can directly interact with any of the included package instances APIs. For example:
```javascript
// Disables specific pattern
geoXp.core.disablePattern(patternId: string);
// Immediately stops all audio currently playing
geoXp.audio.stopAll();
// Enables / disables geolocation updates
geoXp.geolocation.toggleUpdates();

```

### **Events**
GeoXp Web provides event management interfaces to handle specific events across the integrated packages. For example:
```javascript
geoXp.on('active', (spot: GeoXpSpot) => { /* ... */ })
geoXp.on('playing', (sound: GeoXpWebAudioSound) => { /* ... */ })
geoXp.on('location', (location: GeoXpGeolocation) => { /* ... */ })
```

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
* An example of GeoXp usage in a Node environment, can be found in [examples/node](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/node)

***

## Credits
* concept - [Mezzo Forte](https://mezzoforte.design/?lang=en)
* development - Francesco Cretti & Giuliano Buratti
* music for example application - [Bensound](https://www.bensound.com)
