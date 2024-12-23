[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp Web Storage**

## **Description**

GeoXpWebStorage plugin provides persistent storage to GeoXpCore using cookies.

It can be used in any web browser environment.

## **Docs**
**[Package docs](https://geoxp.mezzoforte.design/modules/web_persistent_storage_plugin)**

***

## **Installation**
```bash
# npm
npm install @geoxp/web-storage

# yarn
yarn add @geoxp/web-storage
```

## **Contents**
* [Usage](#usage)
  * [Instance creation](#instance-creation)
  * [Configuration](#configuration)
  * [Reload and disposal](#reload-and-disposal)
  * [API](#api)

* [Examples](#examples)

* [Credits](#credits)

***

## **Usage**
GeoXpWebStorage is intended for use as a singleton instance. It has to be created once the application starts, based on a configuration object.

### **Instance creation**
```javascript
// import modules
import GeoXpCore from '@geoxp/core';
import GeoXpWebStorage from '@geoxp/web-storage';

// create configuration object
const { coreConfig, storageConfig } = { /* your configuration here */ };

// create the GeoXp instances
const geoXpCore = new GeoXpCore(coreConfig);
const geoXpWebStorage = new GeoXpWebStorage(geoXpCore, storageConfig);

```

### **Configuration**
GeoXpWebStorage, once created, works without any external intervention. To provide this high level of automation, it has to be accurately configured according to the desired application.
The configuration is provided as a json object.

```javascript
config: {
  cookiePrefix: string // prefix to append to pattern cookie name
  deleteOnLastSpot: boolean // self delete when last spot is visited
  deleteOnCompletion: boolean // self delete when all spots have been visited
  expiration: number // cookies expiration [minutes] - deafult 5 - set to 0 to exclude cookies
}
```

### **Expiration**
`expiration` partams determines how long the cookies will be saved in the browser. Default is 5 minutes. Set this value to 0 if you want cookies to be deleted at each reload.

### **Reload and disposal**

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

### **API**
All GeoXpWebStorage methods are available in the [documentation page](https://geoxp.mezzoforte.design//GeoXp.html).

***

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
* Some configuration examples, for different kind of patterns: [examples/guides](https://github.com/mezzo-forte-design/geoxp/tree/main/examples/guides)
* A basic web application, with event usage: [examples/web](https://github.com/mezzo-forte-design/geoxp/tree/main/examples/web)
* An example of GeoXp Web package usage in a TypeScript application: [examples/web-typescript](https://github.com/mezzo-forte-design/geoxp/tree/main/examples/web-typescript)

***

## Credits
* concept - [Mezzo Forte](https://mezzoforte.design/?lang=en)
* development - Francesco Cretti & Giuliano Buratti
* music for example application - [Bensound](https://www.bensound.com)

