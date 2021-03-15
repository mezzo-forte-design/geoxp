const {torino, parigi, biancane} = require('./itineraries.config.js');

// minimun distance to play target audio, in meters
exports.playDistance = 18; // meters

// histeresis delta
exports.distanceDelta = 6; // meters

// minimum distance to fetch
exports.fetchDistance = 100; // meters

// minimum accuracy required (avoid to play sounds when position is not accurate)
exports.minAccuracy = 20; // meters

// list of geo targets (lat and lon) with relative label name and audio content
exports.targets = {torino, parigi, biancane};
