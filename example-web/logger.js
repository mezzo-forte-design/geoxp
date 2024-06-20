export default class Logger {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.howlPropsToStringify = [
      '_src',
      '_duration',
      '_state'
    ];
  }

  message(text, ...args) {
    this.printLog(text, 'slategray', ...args);
  }

  warn(text, ...args) {
    this.printLog(text, 'orange', ...args);
  }

  error(text, ...args) {
    this.printLog(text, 'firebrick', ...args);
  }

  isObject(val) {
    return (
      typeof val === 'object' &&
      !Array.isArray(val) &&
      val !== null
    );
  }

  printLog(text, color, ...args) {
    this.container.insertAdjacentHTML('beforeend', `<span style="color:${color}">${text}</span>`);

    if (
      args &&
      Array.isArray(args) &&
      args.length > 0
    ) {
      args.forEach(data => {
        const dataToPrint = this.isObject(data) ? { ...data } : data;

        if (this.isObject(dataToPrint.audio)) {
          dataToPrint.audio = JSON.parse(JSON.stringify(dataToPrint.audio, this.howlPropsToStringify));
        }

        this.container.insertAdjacentHTML('beforeend', `<span style="color:${color}">Data: ${JSON.stringify(dataToPrint)}</span>`);
      });
    }

    this.container.insertAdjacentHTML('beforeend', `<span style="color:gray">--------------</span>`);
  }

  clear() {
    this.container.innerHTML = '';
  }
}