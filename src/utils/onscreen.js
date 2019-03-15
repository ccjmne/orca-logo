import Interval from './interval';

const main = document.querySelector('.main-wrapper');
class OnScreen {
  constructor(selector, { once = false, enter, leave, threshold = .15, stagger = 200, margin: rootMargin = '0px', root = main }) {
    this.staggerIn = new Interval(stagger);
    this.staggerOut = new Interval(stagger);
    this.stackIn = [];
    this.stackOut = [];

    (observer => OnScreen._getElements(selector).forEach(e => observer.observe(e)))(new IntersectionObserver((entries, obs) => entries.forEach(({ isIntersecting, intersectionRatio, target }) => {
      if (isIntersecting && intersectionRatio >= threshold) {
        target.__onScreen = true;
        if (once) { obs.unobserve(target); }
        if (typeof enter === 'function') {
          this.stackIn.push(target);
          if (!this.staggerIn.isRunning()) { this.staggerIn.do(() => (e => e ? enter(e) : this.staggerIn.stop())(this.stackIn.shift())); }
        }
      } else if (target.__onScreen) {
        target.__onScreen = false;
        if (typeof leave === 'function') {
          this.stackOut.push(target);
          if (!this.staggerOut.isRunning()) { this.staggerOut.do(() => (e => e ? leave(e) : this.staggerOut.stop())(this.stackOut.shift())); }
        }
      }
    }), { rootMargin, threshold, root }));
  }

  static _getElements(selector) {
    if (selector instanceof Array || selector instanceof NodeList) {
      return [].concat(...[].map.call(selector, s => OnScreen._getElements(s)));
    }

    if (selector instanceof Element) {
      return [selector];
    }

    return document.querySelectorAll(selector);
  }
}

export default OnScreen;
