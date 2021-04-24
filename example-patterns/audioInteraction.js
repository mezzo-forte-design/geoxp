/*
Here's an example that details audio interaction.
For reading easiness, configuration is avoided.
*/

import GeoXp from 'mezzoforte-geoXp';

// just a filler config, it will not work
const cfg = {
  // put the real configuration here...
};

// creates geoXp instance
const geoXp = new GeoXp(cfg);

// when audio playback is started
geoXp.on('play', data => {

  // pause audio
  data.audio.pause();

  // play audio
  data.audio.play();

  // stop audio
  data.audio.stop();

  // seek audio + 10s
  const newSeek = data.audio.seek() + 10;
  data.audio.seek(newSeek);

  // mute all sounds
  geoXp.audio.muteAll();

  // stop all sounds
  geoXp.audio.stopAll();

});

// when audio playback is stopped / ended
geoXp.on('end', data => {
  // do something cool...
});