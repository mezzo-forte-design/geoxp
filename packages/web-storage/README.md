[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp Web Storage**

## **Description**

GeoXpWebStorage plugin provides persistent storage to GeoXpCore using cookies.
It can be used in any web browser environment.

***

## **Installation**
`npm install @mezzo-forte/geoxp/web-storage`

## **Contents**
* [Usage](#usage)
  * [Instance creation](#instance-creation)
  * [Configuration](#configuration)
  * [Reload and disposal](#reload-and-disposal)
  * [API](#api)

* [Examples](#examples)

* [Credits](#credits)

***

## <a name="usage"></a> **Usage**
GeoXpWebStorage is intended for use as a singleton instance. It has to be created once the application starts, based on a configuration object.

### <a name="instance-creation"></a> **Instance creation**
```javascript
// import modules
import GeoXpCore from '@mezzo-forte/geoxp/core';
import GeoXpWebStorage from '@mezzo-forte/geoxp/web-storage';

// create configuration object
const { coreConfig, storageConfig } = { /* your configuration here */ };

// create the GeoXp instances
const geoXpCore = new GeoXpCore(coreConfig);
const geoXpWebStorage = new GeoXpWebStorage(geoXpCore, storageConfig);

```

### <a name="configuration"></a> **Configuration**
GeoXpWebStorage, once created, works without any external intervention. To provide this high level of automation, it has to be accurately configured according to the desired application.
The configuration is provided as a json object.

```javascript
config: {
  cookiePrefix: string // prefix to append to pattern cookie name
  deleteOnLastSpot: boolean // self delete when last spot is visited
  deleteOnCompletion: boolean // self delete when all spots have been visited
  expiration: number // cookies expiration [minutes]
}
```

### <a name="reload-and-disposal"></a> **Reload and disposal**

```javascript
// create the GeoXp instances
const geoXpCore = new GeoXpCore(coreConfig);
const geoXpWebStorage = new GeoXpWebStorage(geoXpCore, storageConfig);

// refresh all geoXp state with the given configuration
geoXpCore.reload(coreConfig);
geoXpWebStorage.reload(storageConfig);

// Clears all stored cookies
geoXpWebStorage.clearAll();
```

### <a name="api"></a> **API**
All GeoXpWebStorage methods are available in the [documentation page](https://mezzo-forte.gitlab.io/mezzoforte-geoxp/GeoXp.html).

***

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

