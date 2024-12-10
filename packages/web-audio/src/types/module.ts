/**
 * @hidden
 * @module
 */

import { GeoXpWebAudioConfigSound } from './config';
import { Howl } from 'howler';

export type GeoXpWebAudioSound = {
  cfg: GeoXpWebAudioConfigSound;
  audio: Howl;
  shouldPlay: boolean;
  shouldStop: boolean;
  isFadingOut: boolean;
};

export type GeoXpWebAudioEvent =
  | { playing: [GeoXpWebAudioSound] }
  | { stopped: [GeoXpWebAudioSound] }
  | { ended: [GeoXpWebAudioSound] };
