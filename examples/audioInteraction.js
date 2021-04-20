/*
Here's an example that details audio interaction.
For reading easiness, configuration is avoided. 
*/

import GeoXp from 'mezzoforte-geoXp';

// Just a filler config, it will not work
const cfg;

// creates geoXp instance
this.geoXp = new GeoXp(cfg);

// when audio playback is started
this.geoXp.on('play', (audioId) => {

  // load audio information
  const audioInfo = this.geoXp.getAudio(audioId);

  // pause audio
  this.geoXp.audio.pause(audioId);

  // play audio with 1000 ms fade in
  this.geoXp.audio.play(audioId, 1000);

  // stop audio with 1000 ms fade out
  this.geoXp.audio.stop(audioId, 1000);

  // seek audio + 10s
  const newSeek = this.geoXp.audio.seek(audioId) + 10;
  this.geoXp.audio.seek(audioId, newSeek);

  // mute all sounds
  this.geoXp.audio.muteAll();

  // stop all sounds
  this.geoXp.audio.stopAll();

});

// when audio playback is stopped / ended
this.geoXp.on('end', (audioId) => {

});