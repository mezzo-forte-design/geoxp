/**
 * Experience Manager
 */

// time to wait to see if somthing goes active before setting a spot as visited
export const DEFAULT_VISITED_FILTER_TIME = 5000; // ms


/**
 * Geo Manager
 */

// minimum accuracy (in meters) to consider a position update as valid
export const DEFAULT_MIN_ACCURACY = 10; // meters

// position deadband
export const DEFAULT_POSITION_DEADBAND = 10; // meters

// position play distance
export const DEFAULT_PLAY_DISTANCE = 20; // meters

// position fetch distance as
export const DEFAULT_FETCH_DISTANCE = 1; // multiplication coefficient

// MANUAL MODE - minimum accuracy (in meters) to allow manual mode (force spot)
export const DEFAULT_FORCE_MIN_ACCURACY = 100; // m


/**
 * Audio Manager
 */

// fade in time
export const DEFAULT_FADE_IN_TIME = 0; // ms

// fade out time
export const DEFAULT_FADE_OUT_TIME = 1000; // ms