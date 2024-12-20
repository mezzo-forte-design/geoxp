[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp**
***A cross platform, cross environment JS library that automates a geolocated tour.***

## Installation

The library is made of modules, with the main one being "core", while plugin modules are available to implement platform specific features.

You can install individual packages, according to your needs:

```bash
# npm
npm install @geoxp/core
npm install @geoxp/web-audio

# yarn
yarn add @geoxp/core
yarn add @geoxp/web-audio
```

If you're gonna use it **in the browser**, you most likely want to install the Web wrapper:

```bash
# npm
npm install @geoxp/web

# yarn
yarn add @geoxp/web
```

Keep reading to understand better how this piece of software works :)

## **Description**

Mezzo Forte GeoXp maps media contents to geographical locations, and automatically reproduces them based on configuration rules.

It’s meant to be used in any JS environment, front or back end, regardless of the JS framework or platform.

The library is made of modules, with the main one being "core", while plugin modules are available to implement platform specific features.

Plugins are not mandatory, one can use the core and develop its own code to provide gelocation and consume media events.

An API and methods documentation page is available [at this link](https://geoxp.mezzoforte.design/).

An example web app (code is in `/examples/web` directory) is published [here](https://geoxp-web.netlify.app/).

## **Main packages**
### [**Core**](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/packages/core)
GeoXpCore module is the heart of the GeoXp experience. It maps media management events based on set of rules.

It's cross platform, cross environment, and can be used in any js based project, front end or backend.

### [**Web Audio Plugin**](/modules/Web_Audio_Plugin)
GeoXpWebAudio plugin provides audio playback features to GeoXpCore module.

Based on `howler.js`, it can be used in any web browser environment.

### [**Web Geolocation Plugin**](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/packages/web-geolocation)
GeoXpWebGeolocation plugin provides user geolocation based on navigator.geolocation API.

It can be used in any web browser environment.

### [**Web Storage Plugin**](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/packages/web-storage)
GeoXpWebStorage plugin provides persistent storage to GeoXpCore using cookies.

It can be used in any web browser environment.

### Other packages
#### [**Web Wrapper**](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/packages/web)
A wrapper intended to be used in a browser environment  that unifies four essential packages —`Core`, `Web Audio`, `Web Geolocation`, and `Web Storage` — into a single, easy-to-use package.

#### **Utils** 
A collection of utilities shared by the packages.

# Contributing

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

# Examples
* Some configuration examples, for different kind of patterns, can be found inside the [examples/guides](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/guides).
* A basic web application, with event usage, can be found inside the [examples/web](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/web) folder.
* An example of GeoXp usage in a Node environment, can be found in [examples/node](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/node)

***

# Credits
* concept - [Mezzo Forte](https://mezzoforte.design/?lang=en)
* development - Francesco Cretti & Giuliano Buratti
* music for example application - [Bensound](https://www.bensound.com)

