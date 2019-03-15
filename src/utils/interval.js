export default class Interval {
  constructor(interval = 3000) {
    this.interval = interval || 1;
  }

  do(task) {
    this._running = !(this.lastTrigger = undefined);
    this.task = task;
    window.requestAnimationFrame(this._doLater.bind(this));
    return this;
  }

  stop() {
    this._running = false;
  }

  isRunning() {
    return !!this._running;
  }

  _doLater(timestamp) {
    if (!this.isRunning()) {
      return;
    }

    if (typeof this.lastTrigger === 'undefined' || timestamp - this.lastTrigger >= this.interval) {
      this.lastTrigger = timestamp;
      this.task();
    }

    window.requestAnimationFrame(this._doLater.bind(this));
  }
}
