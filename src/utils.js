import Bowser from "bowser";

export class Device {
  static webaudio() {
    return Boolean(window.AudioContext || window.webkitAudioContext
      || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
  }

  static geolocation() {
    return Boolean("geolocation" in navigator);
  }

  static isSupported() {
    return this.webaudio() && this.geolocation();
  }

  static get geolocationOpts() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const geolocationOpts = {
      enableHighAccuracy : Boolean(browser.getBrowserName() !== 'Firefox'),
      maximumAge         : 30000,
      timeout            : 27000
    };
    return geolocationOpts;
  }

  static isTouch() {
    // TODO
  }

  static isMobile() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getPlatformType() === 'mobile';
  }

  static isDesktop() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getPlatformType() === 'desktop';
  }

  static isChrome() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getBrowserName() === 'Chrome';
  }

  static isFF() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getBrowserName() === 'Firefox';
  }

  static isSafari() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return Boolean(browser.getBrowserName() === 'Safari');
  }

  static isSafariiOS() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return Boolean(browser.getOSName() === 'iOS' && browser.getBrowserName() === 'Safari');
  }

  static isFacebookApp() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
  }

  static get os() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getOSName();
  }

  static get browser() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getBrowserName();
  }

  static get platform() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getPlatformType();
  }
}

export class Clock {
  constructor(container, limit) {
    this.container  = container;
    this.TIME_LIMIT = limit;
    this.timePassed = 0;
    this.timeLeft   = limit;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.TIME_LIMIT - this.timePassed;
      this.container.innerHTML = this.formatTime(this.timeLeft);
      if (this.timeLeft === 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.resetTimer();
    this.container.innerHTML  = '';
  }

  resetTimer() {
    this.timePassed = 0;
    this.timeLeft = this.TIME_LIMIT;
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }
}

// export class CookieManager {
//   constructor(options) {
//     this.text = options.text;
//     this.css = `
//       position: absolute;
//       bottom: 0;
//       width: 100%;
//       font-size: .9rem;
//       opacity: 0;
//       transition: opacity 3s;
//       display: flex;
//       flex-direction: column;
//       text-align: center;
//       background-color: ${options.background};
//       color: ${options.color};
//       padding: 1rem;
//       z-index: 100;
//       cursor:pointer;
//       border-top: 1px solid ${options.color};
//     `;
//   }

//     /**
//    * @function setCookie
//    * @param {string} name
//    * @param {string} value
//    * @param {number} duration duration in minutes
//    */
//   setCookie(name, value, duration) {
//     const exp = new Date();
//     const now = new Date();
//     exp.setTime(now.getTime() + (parseInt(duration) * 60000));
//     document.cookie = name + '=' + escape(value) + '; expires=' + exp.toGMTString() + '; path=/';
//   }

//   /**
//    * @function getCookie
//    * @param  {string} name
//    * @return {string} cookie value
//    */
//   getCookie(name) {
//     if (document.cookie.length > 0) {
//       let start = document.cookie.indexOf(name + "=");
//       if (start != -1) {
//         start = start + name.length + 1;
//         let end = document.cookie.indexOf(";",start);
//         if (end == -1) {
//           end = document.cookie.length;
//         }
//         return unescape(document.cookie.substring(start, end));
//       } else {
//         return '';
//       }
//     }
//     return '';
//   }

//   showCookieBanner() {
//     const consentCookie = this.getCookie(`cookieconsent_status`);
//     if (consentCookie !== 'dismiss') {
//       const div = this.createCookieDiv();
//       document.body.appendChild(div);
//       div.style.opacity = 1;
//     }
//   }

//   createCookieDiv() {
//     const div = document.createElement('div');
//     div.id = 'cookie-consent-banner';
//     div.style.cssText = this.css;

//     const p = document.createElement('div');
//     p.innerHTML = this.text;

//     const controls = document.createElement('div')
//     controls.style.cssText = 'display:flex; justify-content: space-around;';

//     const learnMore = document.createElement('a');
//     learnMore.innerHTML = ' Learn More';
//     learnMore.target = '_blank';
//     learnMore.href = '/privacy-cookie-policy';
//     learnMore.style.color = '#A5A093';
//     learnMore.style.padding = '1rem';
//     learnMore.style.cursor = 'pointer';

//     const dismiss = document.createElement('span');
//     dismiss.innerHTML = 'OK';
//     dismiss.style.cursor = 'pointer';
//     dismiss.style.padding = '1rem';
//     dismiss.style.fontSize = '1rem';
//     dismiss.style.fontWeight = '900';
//     dismiss.style.color = '#BDA545';
//     dismiss.onclick = e => {
//       this.setCookie('cookieconsent_status', 'dismiss', 14400); // 10 gg
//       div.remove();
//     };

//     controls.appendChild(learnMore);
//     controls.appendChild(dismiss);

//     div.appendChild(controls);
//     div.appendChild(p);

//     return div;
//   }
// }

// export const parseUrlParams = url => {
// 	const params = {};
// 	const parser = document.createElement('a');
// 	parser.href = url;
// 	const query = parser.search.substring(1);
// 	const vars = query.split('&');
//   vars.forEach(el => {
//     const pair = el.split('=');
//     params[pair[0]] = decodeURIComponent(pair[1]);
//   });
// 	return params;
// };
