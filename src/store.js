const path = require('path');

const PUBLIC_DIR_PATH = path.join(__dirname, '../public');
const AUDIO_DIR_PATH = path.join(__dirname, '../public/audio');
const VIDEO_DIR_PATH = path.join(__dirname, '../public/video');

const { configureStore } = require('@reduxjs/toolkit');

const { reducer } = require('./reducer.js');
const { availablePlayers } = require('./config.js');
const { walkDir, mapPlayersData, mapFileSystemData } = require('./utils.js');

const store = configureStore({ reducer });
