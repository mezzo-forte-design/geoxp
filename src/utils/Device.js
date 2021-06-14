import Bowser from "bowser";

/**
 * Device static class.
 * Device holds all the device interaction and configuration
 * @returns { Object } - GeoManager instance
 */
export default class Device {

  /**
  * Device supports webaudio API
  */
  static webaudio() {
    return Boolean(window.AudioContext || window.webkitAudioContext
      || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
  }

  /**
  * Device supports geolocation API
  */
  static geolocation() {
    return Boolean("geolocation" in navigator);
  }

  /**
  * Device supports geolocation and webaudio APIs
  */
  static isSupported() {
    return this.webaudio() && this.geolocation();
  }

  /**
  * Returns default geolocation options
  */
  static get geolocationOpts() {
    const geolocationOpts = {
      enableHighAccuracy : false,
      maximumAge         : 30000,
      timeout            : 27000
    };
    return geolocationOpts;
  }

  /**
  * Device has touchscreen
  */
  static isTouch() {
    // TODO
  }

  /**
  * Device is Mobile
  */
  static isMobile() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getPlatformType() === 'mobile';
  }

  /**
  * Device is desktop
  */
  static isDesktop() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getPlatformType() === 'desktop';
  }

  /**
  * Using chrome browser
  */
  static isChrome() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getBrowserName() === 'Chrome';
  }

  /**
  * Using FF browser
  */
  static isFF() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getBrowserName() === 'Firefox';
  }

  /**
  * Using safari browser
  */
  static isSafari() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return Boolean(browser.getBrowserName() === 'Safari');
  }

  /**
  * Using safari over IOS
  */
  static isSafariiOS() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return Boolean(browser.getOSName() === 'iOS' && browser.getBrowserName() === 'Safari');
  }

  /**
  * Using facebook app
  */
  static isFacebookApp() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
  }

  /**
  * Gets device OS
  */
  static get os() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getOSName();
  }

  /**
  * Gets current browser
  */
  static get browser() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getBrowserName();
  }

  /**
  * Gets current platform
  */
  static get platform() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    return browser.getPlatformType();
  }
}