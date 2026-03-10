# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## **v1.2.2** - 2026-03-10
### 🩹 Fixed
* [core] `getSpotFromRef` not breaking after first match — `forEach` kept iterating and overwrote the found spot with `undefined` if subsequent patterns didn't contain it

## **v1.2.1** - 2025-08-04
### 🩹 Fixed
* safely clone configuration objects only when defined, avoiding runtime errors

## **v1.2.0** - 2025-07-22
### ➕ Added
* [core] `run()` and `pause()` methods to easily start or stop GeoXp operations globally.
* [core] `running` getter to check the current operational state.
* [core] `autoRun` option in the core constructor to control whether the instance starts automatically.

### 🪛 Changed
* deep copy config objects to avoid changes in original reference

### 🩹 Fixed
* [core] spots not reactivating upon replay request after visited
* docs generation script

### ➖ Removed
* [core] Deprecated and buggy `enablePatterns` and `disablePatterns` methods → Use `run()` and `pause()` instead.

## **v1.1.4** - 2025-06-07
### ➕ Added
* [core] `enablePatterns` and `disablePatterns` methods

### 🩹 Fixed
* [web-geolocation] fix position listeners binding 

## **v1.1.3** - 2025-04-10
### ➕ Added
* `export` field in `package.json` for all packages

## **v1.1.2** - 2025-04-10
### 🩹 Fixed
* [web-geolocation] avoid potential multiple `watchPosition` invocations 

## **v1.1.1** - 2025-04-09
### 🩹 Fixed
* [web] fix `ready` event

## **v1.1.0** - 2025-04-08
### ➕ Added
* [web-audio] `autoplaySounds` options
* [web-audio] `ready` event

## **v1.0.3** - 2025-01-07
### ➕ Added
* manual spot to web example

### 🪛 Changed
* improved documentation for manual mode

### 🩹 Fixed
* make spot position optional to enable manual spots configuration

## **v1.0.2** - 2024-12-23
### 🪛 Changed
* refine README
* update repo URLs

## **v1.0.1** - 2024-12-23
### 🩹 Fixed
* fix publishConfig field

## **v1.0.0** - 2024-12-23
* first version of the brand new modular GeoXp!