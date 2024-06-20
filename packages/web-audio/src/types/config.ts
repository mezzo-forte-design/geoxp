/**
 * Configuration object structure
 * @module Config
 */

/** GeoXpWebAudioConfigSound */
export type GeoXpWebAudioConfigSound = {
  /** Audio id */
  id: string;

  /** Audio name/description */
  label?: string;

  /** Related spot id from core config */
  spotId: string;

  /** Audio url */
  url: string;

  /** Audio content can be overlapped to others already playing */
  overlap?: boolean;
};

/** GeoXpWebAudioConfigOptions */
export type GeoXpWebAudioConfigOptions = {
  /** Url for audio test sound */
  test: string;

  /** Url for silence sound */
  silence: string;

  /** fade in time [milliseconds] */
  fadeInTime: number;

  /** fade out time [milliseconds] */
  fadeOutTime: number;
};

/** GeoXpWebAudioConfig */
export type GeoXpWebAudioConfig = {
  /** sounds config array */
  sounds: GeoXpWebAudioConfigSound[];

  /** module config options */
  options: GeoXpWebAudioConfigOptions;
};
