# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## **Unreleased**
### Added
* notAfter option to spots (prevents a spot to play after another)
* parametric fade time, configurable by the user
* Babel support for dist bundle
* embed default system sounds (silence, visited and test) in dist bundle

### Changed
* moved all magic numbers to constants file
* improved configuration checks and warnings
* add UMD dist bundle and build before publishing
* use lower bitrates for system sounds
* "default" config object is now "options"
* geo default object names changed to fit positions properties
* magic numbers renamed according to default object names

### Fixed
* fix missing default config values initalization

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