# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## **v1.3.9** - 2024-03-27
### Fix
* include WebAudio for iOS Safari - ⚠ rolls back changes from v1.3.7

## **v1.3.8** - 2024-03-19
### Fix
* fixed audio not stopping if paused

## **v1.3.7** - 2024-03-19
### Added
* exclude WebAudio also for iOS Safari - ⚠ this excludes fades on iOS but avoids crashes

## **v1.3.6** - 2024-02-02
### Added
* method `activateSubscriptions` to be called on constructor and after config reload (only if destroy has been called before)
* DESTROY button on test app

## **v1.3.5** - 2023-12-07
### Fixed
* `_GEO_WATCH` is now an array of ids so every watcher can be cleared correctly

## **v1.3.4** - 2023-11-17
### Added
* spots without "position" can be forced at any time, disregarding the usual forcing rules

### Changed
* `canForceSpot` now returns an error string if spot can't be forced, returns `undefined` if spot can be forced

## **v1.3.3** - 2023-10-06
### Fixed
* global volume setter was bugged

## **v1.3.2** - 2023-03-17
### Fixed
* spots could not be replayed if there was no overlap and an audio was already playing
* geo config ignored highAccuracy setting
* experience user configuration was always overridden with default values

## **v1.3.1** - 2021-12-21
### Added
* Eslint plugin

### Changed
* update example app

### Fixed
* minor bugfixes after eslint analysis
* fix replay of already inside spots

## **v1.3.0** - 2021-10-05
### Added
* cookies to make pattern "visited spots" persistent
* cookies automatic deletion
* `getVisitedSpots()` method

### Changed
* restyled test app UI
* test UI audios changed
* improved JDoc with a new template

## **v1.2.1** - 2021-09-22
### Changed
* unload Howl instance and free cache, after sound stops or ends
* update docs and README

## **v1.2.0** - 2021-09-05
### Added
* add UMD dist bundle and build before publishing
* notAfter option to spots (prevents a spot to play after another)
* parametric fade time, configurable by the user
* Babel support for dist bundle
* embed default system sounds (silence, visited and test) in dist bundle

### Changed
* moved all magic numbers to constants file
* improved configuration checks and warnings
* use lower bitrates for system sounds
* "default" config object is now "options"
* geo default object names changed to fit positions properties
* magic numbers renamed according to default object names
* changed DEFAULT_ACCURACY to 25 m

### Fixed
* fix missing default config values initalization
* fix deadband (now used only to calculate outgoing spots, not incoming)
* fix pattern enable/disable (now it works!)

### Removed
* remove hardcoded mp3 from audio manager

## **v1.1.0** - 2021-06-06
### Added
* include audio files in /src directory
* add JSDoc documentation page
* add verbose warnings

### Fixed
* fix Geolocation API highAccuracy timeout

### Changed
* update README

## **v1.0.0** - 2021-04-24
### Added
* first release of GeoXp!