[<img src="https://mezzoforte.design/img/logo_beige.svg" alt="Mezzo Forte" width="150"/>](https://mezzoforte.design/)

# **Mezzo Forte GeoXp Core**

## **Description**

Mezzo Forte **GeoXp Core** is a an event based js library that manages all the background features of a multimedia geolocated tour.

It maps media control events to geographical locations based on configuration rules.

It’s meant to be used in any js environment, front or back end, regardless of the js framework or platform.

## **Docs**
**[Package docs](https://geoxp.mezzoforte.design/modules/geoxp_core)**

***

## **Install**
```bash
# install using npm
npm install @geoxp/core

# or using yarn
yarn add @geoxp/core
```

## **Contents**
* [Key concepts](#key-concepts)
  * [Positions](#positions)
  * [Minimum accuracy](#minimum-accuracy)
  * [Spots](#spots)
  * [Behavior](#behavior)
  * [Patterns](#patterns)
  * [Spots order](#spots-order)
  * [Content replay](#content-replay)
  * [Pattern cookie](#pattern-cookie)
  * [Content overlap](#content-overlap)

* [Usage](#usage)
  * [Instance creation](#instance-creation)
  * [Configuration](#configuration)
  * [Reload and disposal](#reload-and-disposal)
  * [Events subscription](#events-subscription)
    * [Spot incoming](#spot-incoming)
    * [Spot active](#spot-active)
    * [Spot inactive](#spot-inactive)
    * [Spot visited](#spot-visited)
    * [Pattern complete](#pattern-complete)
    * [Pattern last spot](#pattern-last-spot)
  * [Spots content replay](#spots-content-replay)
  * [Manual mode](#manual-mode)
  
* [Best practices](#best-practices)
  * [Designing configuration for a specific use](#designing-configuration-for-a-specific-use)
  * [Positions overlap](#positions-overlap)
  * [Mobile integration](#mobile-integration)

* [Examples](#examples)

* [Credits](#credits)

***

## **Key concepts**
### **Positions**
A GeoXp position is a circular area defined by two geographical coordinates (`{lat, lon}`) a radius and a deadband.
The inner _radius_ defines the **_inside_** position status.
(_radius_ + _deadband_) defines an outer radius that serves hysteresis purposes to avoid abrupt status changes.

### **Minimum accuracy**
Every geographical data, coming from the geolocation system, that does not fulfill accuracy requrements will be ignored.

### **Spots**
A GeoXp spot is the core entity of an experience and represents a relation between a position and an audio content. For example, if you want the user to listen the file `audio_1.mp3` in the position `position_A`, it will be necessary to create a new spot that associate the `audio_1` content to the `position_A `geographical coordinates (in the [**Usage**](#usage) section we describe in detail how to make this configuration).

This is to say, the same media content can be linked to multiple positions, and multiple media can be linked to one position.


### **Behavior**
The event behavior for a GeoXp spot is designed as follows:

<img src="https://mezzoforte.design/img/geoxp-spot.png" alt="GeoXp spot" width="550"/>

User enters the position circle (its _inside_ area), spot becomes _active_, associated content is played.
User leaves the position _inside_ area, but he’s still inside the deadband, the content is still playing.
User leaves the deadband, spot becomes _outgoing_, the audio content fades out and stops.

### **Patterns**
A list of spots is called a pattern. Patterns define the overall behavior of its spots.
Multiple patterns could be active at any time, providing multiple simultaneous experiences (eg: one pattern defines what speeches to play in certain positions, one pattern defines background audio effects to play alongside the speeches, using the same positions).
Patterns are separate entities that don’t talk to each other, spots order and content overlap management are independent between patterns.

### **Spots order**
GeoXP provides limited content queue management. This can be achieved using the spot “after” and “notAfter” properties.
If after is defined, GeoXp will not reproduce a certain spot content unless the after spot has already been played.
If notAfter is defined, GeoXp will not reproduce a certain spot content if the notAfter spot has already been played.

### **Content replay**
When content starts playing, a spot becomes `visited`.
When the user reenters a visited spot, geoXp will not play its content. It will throw a notification instead, to let the user choose what to do.
This behavior can be overridden using the pattern `replay` option. In this case, when the user reenters a visited spot, its content replays as usual.
See [Spot content replay](#spots-content-replay) for details.

### **Storage**
As default behavior, when GeoXp instance is reloaded (eg: page refresh) exprience patterns memory of visited spots is cleared. This can be avoided enabling storage for patterns, by defining the `getStoredVisitedSpots` and `setStoredVisitedSpots` methods. Storage solution can be anything (eg: cookies/localstorage on browser, fs in node, etc.). GeoXp Core storage is managed automatically by our storage plugins.

When storage is enabled, an enitity for each pattern is updated every time a new spot is visited.

This storage can be deleted with different strategies:
* when all spots in a pattern are visited (core sends out a `completed` event).
* when a specific spot, flagged with the “last” option is activated (core sends out a `last` event).
* manually (depending on the storage method used).

## **Usage**
GeoXp Core is intended for usage as a singleton instance. It has to be created once the application starts, based on a configuration object.

## **Instance creation**
```javascript
// import module
import GeoXpCore from '@geoxp/core';

// create configuration object
const config = { /* your configuration here */ };

// create the GeoXp instance
const geoXpCore = new GeoXpCore(config);

```

### **Configuration**
GeoXpCore, once created, works without any external intervention. To provide this high level of automation, it has to be accurately configured according to the desired application.
The configuration is provided as a json object.

```javascript
config: {
  patterns: [ // array of patterns, each with its spots list and parameters
    {
      id: string // pattern unique id
      label: string // pattern name or description
      disabled: bool // pattern is disabled
      replay: bool // spots are automatically replayed
      spots: [ // array of pattern’s spots
        {
          id: string // spot unique id
          label: // spot name or descriptions
          after: // id of the previous mandatory spot (see “key concepts”, “Spots order”)
          notAfter: // id of the spot that prevents current spot playback (see “key concepts”, “Spots order”)
          position: {
            lat: number // latitude [degrees north]
            lon: number // longitude [degrees east]
            radius: number // activation radius [meters]
            deadband: number // deadband past activation radius [meters]
            fetch: number // prefetching distance [factor of radius]
          }
        }
      ]
    }
  ],
  options: {
    visitedFilter: number // time after an already visited spot is notified [milliseconds] - default value = 5000 ms
    accuracy: number // minimum acceptable accuracy [meters] - default value = 25 m
    defaultRadius: number // default activation radius [meters] - default value = 20 m
    defaultDeadband: number // default deadband past activation radius [meters] - default value = 10 m
    defaultFetch: number // default prefetch distance [factor or radius] - default value = 1
  }
}
```
> **NOTE** - patterns are enabled by default. See [API](#api) to know how to disable or re-enable them


### **Reload**

```javascript
// Creates a new geoXp instance
const geoXpCore = new GeoXpCore(config);

// Refreshes all geoXp state with the given configuration
geoXpCore.reload(config);
```

> **NOTE** - If you are using the `Web Geolocation` module together with Core, make sure to reload it as well, to ensure that location updates will invoke the updated version of the Core methods.

### **Events subscription**
GeoXpCore is meant to work automatically based on its configuration, so most of the interaction with it is based on events.
Its event dispatcher (`geoXpCore.event`) is based on [Node.js EventEmitter](https://nodejs.org/api/events.html) and is responsible for events notification to outside subscribers.

Three main methods are wrappped by the `GeoXp` class:
* `geoXpCore.on(eventName, listener)` - adds the `listener` function to the end of the listeners array for the event named `eventName`
* `geoXpCore.once(eventName, listener)` - adds a one-time `listener` function for the event named `eventName`
* `geoXpCore.off(eventName, listener)` - removes the specified `listener` from the listener array for the event named `eventName`

Available events are:

#### **Spot incoming**

```javascript
geoXpCore.on('incoming', spot => { /* ... */ })
```

Spot is nearby, start fetching content.

#### **Spot active**

```javascript
geoXpCore.on('active', spot => { /* ... */ })
```

Spot has been activated, media content should start.


#### **Spot inactive**

```javascript
geoXpCore.on('inactive', spot => { /* ... */ })
```

Spot has been deactivated, all related media content should stop.

#### **Spot visited**

```javascript
geoXpCore.on('visited', spot => { /* ... */ })
```

User entered a spot which he already visited before. User should be able to choose whether to replay it or not.

#### **Pattern complete**

```javascript
geoXpCore.on('complete', patternId => { /* ... */ })
```

All spots in pattern have been visited.

#### **Pattern last spot**

```javascript
geoXpCore.on('last', patternId => { /* ... */ })
```

Spot marked as `last` of pattern has been visited.

## **Spots content replay**
By default, when user reenters a spot he already visisted before, the spot isn't replayed; instead, a `visited` event for that spot is fired.
The spot replay can be triggered calling the `replaySpot(id)` method, passing the id of the spot to replay. The spot is then marked as unvisited, and the playback starts immediately.
Multiple spots could be linked to the same position, so multiple `visited` events could be fired at once. If you don't want to care about which spot is to be replayed, call the `replaySpot()` method with no argument, so all the spots linked to the current position are marked as unvisited, and replayed following the rules defined in configuration (eg: spot order).
This behavior could be overridden using the `pattern.replay` option. If a pattern is set so, its spots will replay immediately, and no `visited` event is fired.

## **Manual mode**
Manual mode enables GeoXp spots to be activated without relying on the user's actual geolocation.

> **❗ Forcing a spot pauses all automatic experience management until the forced content finishes. Afterward, the experience logic resumes seamlessly.**

### How to Use Manual Mode 
Here are three key methods tied to this feature:
* `canForceSpot(spotId)` - checks if manual mode is available for a specific spot. If manual mode isn’t allowed, it returns an error message explaining why. Otherwise, it returns `undefined`.
* `forceSpot(spotId)` - activates playback for the selected spot in manual mode.
* `stopForcedSpot()` - stops all forced spots and reverts to normal operations.

When a spot is forced:
1. GeoXp switches to manual mode. 🚫 Stops geolocation updates and other audio content.
2. The desired spot is activated.
3. Once playback finishes (or is stopped), GeoXp exits manual mode and resumes automatic operations.

### When to Use Manual Mode?
Manual mode is very useful in two scenarios: 

#### **🔮 Special content**
Manual mode is perfect for unique content that doesn’t fit standard geographical placement (e.g., extra features, warnings, or custom messages). This usage turns GeoXp into a simpler media player.

Add a spot without a position (note that after/notAfter logics won’t apply because normal mechanisms are disabled) to your configuration file and call the `forceSpot(spotId)` method to trigger it directly.

```javascript
  spots: [
    // manual spot
    {
      id: string,
      label: string,
    },
    // normal spot
    {
      id: string, 
      label: string,
      after: string,
      notAfter: string, 
      position: {
        lat: number,
        lon: number,
        radius: number,
        deadband: number,
        fetch: number,
      }
    }
  ]
```

> In this scenario, `canForceSpot(id)` will always allow forcing the spot.

#### **📡 Unreliable geolocation**
Then GPS data becomes inaccurate due to environmental factors like nearby buildings, dense tree cover, satellite signal blockages, or electromagnetic interference from power lines, manual spot activation mode becomes accessible.

In this case geoXp enables manual mode only for really low accuracy **(greater than 100m)**, and only if **user is not too far away from the intended spot playback position** (in the case of slow location update time and the user has reached a new spot before an update).

> **Forcing a spot in this case is a _plan B_ when something is not working properly (bad GPS or slow update time).  In this case, forcing a spot ensures smooth playback but disrupts geolocation tracking temporarily.**

## **Best practices**

### Designing configuration for a specific use
Behavior of geoXp covers a wide variety of applications.
This broad approach means that, to guarantee the user experience good flow and consistency, some effort needs to be spent on adopting an optimal configuration for the desired result.

For example, geoXp is used for an audio guide of a museum tour.

* that user must hear the content just once

    `config.experience.patterns[x].replay = false`


Now, let’s change application. GeoXp is used to play ambient sounds at certain locations.

* user must hear the content every time is in the right location

    `config.experience.patterns[x].replay = true`

### Positions overlap
Unless content overlapping is desired, it’s better to avoid positions overlap when possible.

If two pattern spots are actually near each other, try setting radiuses in a way that fencing doesn’t overlap (maybe by setting a small radius and a big deadband: user has to be close to the position for the content to start, but the content will not stop if he walks away).

If overlapping isn’t avoidable, make sure to apply filtering with `experience.options.visitedFilter` (usually 5000 or 10000 ms is enough).

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
* An example of GeoXp usage in a Node environment: [examples/node](https://github.com/mezzo-forte-design/geoxp/tree/main/examples/node)
* An example of GeoXp Web package usage in a TypeScript application: [examples/web-typescript](https://github.com/mezzo-forte-design/geoxp/tree/main/examples/web-typescript)


***

## Credits
* concept - [Mezzo Forte](https://mezzoforte.design/?lang=en)
* development - Francesco Cretti & Giuliano Buratti
* music for example application - [Bensound](https://www.bensound.com)

