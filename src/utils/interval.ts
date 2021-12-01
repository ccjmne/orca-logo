export default class Interval {

  private interval: number;

  private task?: () => void;
  private running = false;
  private lastTrigger?: DOMHighResTimeStamp;

  constructor(interval = 3000) {
    this.interval = Math.max(1, interval);
  }

  public do(task: () => void): Interval {
    this.running = !(this.lastTrigger = undefined);
    this.task = task;
    window.requestAnimationFrame(this.doLater.bind(this));
    return this;
  }

  public stop(): void {
    this.running = false;
  }

  public isRunning(): boolean {
    return this.running;
  }

  private doLater(timestamp: DOMHighResTimeStamp): void {
    if (!this.isRunning()) {
      return;
    }

    if (typeof this.lastTrigger === 'undefined' || timestamp - this.lastTrigger >= this.interval) {
      this.lastTrigger = timestamp;
      if (this.task) {
        this.task();
      }
    }

    window.requestAnimationFrame(this.doLater.bind(this));
  }

}
