# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
* cookies to make pattern "visited spots" persistent
* cookies automatic deletion

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