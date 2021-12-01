/* eslint-disable no-plusplus */

export default class Counter {

  private v: number;

  constructor(init = 0) {
    this.v = init;
  }

  public get value(): number {
    return this.v;
  }

  public increment(): number {
    return ++this.v;
  }

  public decrement(): number {
    return --this.v;
  }

}
