// scripts
import {Device} from './utils.js';
import UI from './ui/ui.js';
import {Intro} from './app.js';


document.addEventListener('DOMContentLoaded', event => {

    if (!Device.isMobile()) {
      document.body.innerHTML = UI.desktopBlock;
      return;
    }

    if (!Device.isSupported()) {
      document.body.innerHTML = UI.notSupported;
      return;
    }

    const introduction = new Intro();

    introduction.start();

});
