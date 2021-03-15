import 'bootstrap';

// scripts
import { Device } from './utils.js';
import UI from './ui/ui.js';
import { App } from './app.js';

document.addEventListener('DOMContentLoaded', event => {

  console.log('*** !! OK !! ***');

  // iOS fix - disable pinch to zoom
  if (Device.isSafariiOS()) document.body.style.touchAction = 'none';

  const app = new App();

  window.application = app;

  app.renderHelp();

  const btn = app.createStartButton(e => {
    console.log('*** !! START !! ***');
    app.start();
  });

  document.getElementById('spots-map').appendChild(btn);

});
