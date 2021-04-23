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
geoXp.on('play', audioId => {

  // load audio information
  const audioInfo = geoXp.getAudio(audioId);

  // pause audio
  geoXp.audio.pause(audioId);

  // play audio with 1000 ms fade in
  geoXp.audio.play(audioId, 1000);

  // stop audio with 1000 ms fade out
  geoXp.audio.stop(audioId, 1000);

  // seek audio + 10s
  const newSeek = geoXp.audio.seek(audioId) + 10;
  geoXp.audio.seek(audioId, newSeek);

  // mute all sounds
  geoXp.audio.muteAll();

  // stop all sounds
  geoXp.audio.stopAll();

});

// when audio playback is stopped / ended
geoXp.on('end', audioId => {
  // do something cool...
});