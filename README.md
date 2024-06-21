[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp**

## **Description**

Mezzo Forte GeoXp is a cross platform, cross environment js library that automates a geolocated tour.

It maps media contents to geographical locations, and automatically reproduces them based on configuration rules.

It’s meant to be used in any js environment, front or back end, regardless of the js framework or platform.

The library is made of modules, with the main one being "core", while plugin modules are available to implement platform specific features.

Plugins are not mandatory, one can use the core and develop its own code to provide gelocation and consume media events.

An API and methods documentation page is available [at this link](https://mezzo-forte.gitlab.io/mezzoforte-geoxp).

An example web app (code is in `/example-web` directory) is published [here](https://geoxp.netlify.app/).

## **Packages**
### [**Core**](./packages/core)
GeoXpCore module is the heart of the GeoXp experience. It maps media management events based on set of rules.

It's cross platform, cross environment, and can be used in any js based project, front end or backend.

### [**Web audio**](./packages/web-audio)
GeoXpWebAudio plugin provides audio playback features to GeoXpCore module.

Based on howler.js, it can be used in any web browser environment.

### [**Web geolocation**](./packages/web-geolocation)
GeoXpWebGeolocation plugin provides user geolocation based on navigator.geolocation API.

It can be used in any web browser environment.

### [**Web storage**](./packages/web-storage)
GeoXpWebStorage plugin provides persistent storage to GeoXpCore using cookies.

It can be used in any web browser environment.

# Contributing

To contribute to this project, fork the repository, work on a development branch and open a MR.
Remember to update the changelog (CHANGELOG.md)!

**Repo admins**: to release a new version, follow these steps:
* verify and test changes
* verify changelog has been updated
* merge MR in `master`
* release a new version with `npm run release --vers=X.Y.Z`
* create a new release in the release section


***

# <a name="examples"></a> Examples
Some configuration examples, for different kind of patterns, can be found inside the [example-patterns](https://gitlab.com/mezzo-forte/mezzoforte-geoxp/-/tree/master/example-patterns).
A basic application, with event usage, can be found inside the [example-app](https://gitlab.com/mezzo-forte/mezzoforte-geoxp/-/tree/master/example-app) folder.

***

# <a name="credits"></a> Credits
* concept - [Mezzo Forte](https://mezzoforte.design/?lang=en)
* development - Francesco Cretti & Giuliano Buratti
* music for example application - [Bensound](https://www.bensound.com)

