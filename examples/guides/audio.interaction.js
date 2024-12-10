/*
Here's an example that details audio interaction.
For reading easiness, configuration is avoided.
*/

import GeoXpCore from '@geoxp/core';
import GeoXpWebAudio from '@geoxp/web-audio';

// just a filler config, it will not work
const config = {
  // put the real configuration here...
  core: {},
  audio: {},
};

// geoXp modules creation
const geoXpCore = new GeoXpCore(config.core);
const geoXpWebAudio = new GeoXpWebAudio(geoXpCore, config.audio);

// when audio playback is started
geoXpWebAudio.on('playing', sound => {

  // pause audio
  sound.pause();

  // play audio
  sound.play();

  // stop audio
  sound.stop();

  // seek audio + 10s
  const newSeek = sound.seek() + 10;
  sound.seek(newSeek);

  // mute all sounds
  sound.muteAll();

  // stop all sounds
  sound.stopAll();
});

// when audio playback is stopped / ended
geoXp.on('stopped', sound => {
  // do something cool...
});