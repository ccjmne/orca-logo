import Interval from './interval';

/* eslint no-param-reassign: "off" */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

type Selector = ReadonlyArray<Selector> | NodeListOf<globalThis.Element> | Element | string;
const main = document.querySelector('.main-wrapper')!;

export const ON_SCREEN = Symbol('orca-logo:onscreen');
export type OnScreenOptions = {
  once: boolean;
  enter: (e: Element) => void;
  leave: (e: Element) => void;
  threshold: number;
  stagger: number;
  margin: string;
  root: Element;
};

export default class OnScreen {

  private staggerIn: Interval;
  private staggerOut: Interval;
  private stackIn: Array<Element>;
  private stackOut: Array<Element>;

  constructor(
    selector: Selector,
    { once = false, enter, leave, threshold = 0.15, stagger = 200, margin: rootMargin = '0px', root = main }: Partial<OnScreenOptions>,
  ) {
    this.staggerIn = new Interval(stagger);
    this.staggerOut = new Interval(stagger);
    this.stackIn = [];
    this.stackOut = [];

    (observer => OnScreen.getElements(selector).forEach(e => observer.observe(e)))(
      new IntersectionObserver(
        (entries, obs) => entries.forEach(({ isIntersecting, intersectionRatio, target }) => {
          if (isIntersecting && intersectionRatio >= threshold) {
            target[ON_SCREEN] = true;
            if (once) {
              obs.unobserve(target);
            }
            if (typeof enter === 'function') {
              this.stackIn.push(target);
              if (!this.staggerIn.isRunning()) {
                this.staggerIn.do(() => (e => (e ? enter(e) : this.staggerIn.stop()))(this.stackIn.shift()));
              }
            }
          } else if (target[ON_SCREEN]) {
            target[ON_SCREEN] = false;
            if (typeof leave === 'function') {
              this.stackOut.push(target);
              if (!this.staggerOut.isRunning()) {
                this.staggerOut.do(() => (e => (e ? leave(e) : this.staggerOut.stop()))(this.stackOut.shift()));
              }
            }
          }
        }),
        { rootMargin, threshold, root },
      ),
    );
  }

  static getElements(selector: Selector): ReadonlyArray<Element> {
    if (selector instanceof Array) {
      return selector.flatMap(s => OnScreen.getElements(s));
    }

    if (selector instanceof NodeList) {
      return Array.from(selector);
    }

    if (selector instanceof Element) {
      return [selector];
    }

    return Array.from(document.querySelectorAll(selector));
  }

}
