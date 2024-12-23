[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp**
[![Version Badge][npm-img]][npm-url]
[![license](https://img.shields.io/badge/license-Apache%202.0-blue)](https://github.com/mezzo-forte-design/geoxp/blob/main/LICENSE)
[![typescipt](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)


[npm-img]: https://img.shields.io/npm/v/@geoxp/core.svg
[npm-url]: https://www.npmjs.com/package/@geoxp/core

***

***A cross platform, cross environment JS library that automates a multimedia geolocated tour.***

***

[![github-logo]](https://github.com/mezzo-forte-design/geoxp)

[github-logo]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white

***

[https://geoxp.mezzoforte.design](https://geoxp.mezzoforte.design/)

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

## **Resources**
* [Docs](https://geoxp.mezzoforte.design/)
* [Live example web app](https://geoxp-web.netlify.app/)
* [Examples source code](https://github.com/mezzo-forte-design/geoxp/tree/main/examples)


## **Main packages**
### [**Core**](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/packages/core)
GeoXpCore module is the heart of the GeoXp experience. It maps media management events based on set of rules.

It's cross platform, cross environment, and can be used in any js based project, front end or backend.

### [**Web Audio Plugin**](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/packages/web)
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
> * verify CHANGELOG.md has been updated
> * merge MR in `main`
> * publish a new version with `yarn publish`
> * create a new release in the release section

***

# Examples
* Some configuration examples, for different kind of patterns, can be found inside the [examples/guides](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/guides).
* A basic web application, with event usage, can be found inside the [examples/web](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/web) folder.
* An example of GeoXp usage in a Node environment, can be found in [examples/node](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/node)
* An example of GeoXp Web package with TypeScript [examples/web-typescript](https://gitlab.com/mezzo-forte/geoxp/-/tree/main/examples/web-typescript)

***

# Credits
* concept - [Mezzo Forte](https://mezzoforte.design/?lang=en)
* development - Francesco Cretti & Giuliano Buratti
* music for example application - [Bensound](https://www.bensound.com)

