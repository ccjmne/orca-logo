'use strict';

import anime from 'animejs';
import OnScreen from '../utils/onscreen';

const svgns = 'http://www.w3.org/2000/svg';

window.customElements.define('orca-logo', class OrcaLogo extends HTMLElement {

  static get observedAttributes() {
    return ['animated'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = require('./orca-logo.html');
    (styling => (styling.textContent = require('!./orca-logo.scss'), this.shadowRoot.prepend(styling)))(document.createElement('style'));

    // Generate unique clipPath ids for each orca-logo instance
    const clips = [].map.call(this.shadowRoot.querySelectorAll('clipPath[data-clip]'), clip => (clip.id = OrcaLogo._generateUUID(), clip)).reduce((acc, clip) => (acc[clip.getAttribute('data-clip')] = clip.id, acc), {});
    this.shadowRoot.querySelectorAll('[data-clip-path]').forEach(path => path.setAttributeNS(null, 'clip-path', `url(#${ clips[path.getAttribute('data-clip-path')] })`));
    this.strokes = this.shadowRoot.querySelectorAll('path[animate-stroke]');
    this.fills = this.shadowRoot.querySelectorAll('path[animate-fill]');
    this.reflection = this.shadowRoot.querySelector('rect.shine');
    this.circles = [].map.call(this.strokes, s => {
      const c = s.parentNode.appendChild(document.createElementNS(svgns, 'circle'));
      c.setAttribute('colour', s.getAttribute('colour'));
      c.setAttribute('delay', s.getAttribute('delay'));
      c.setAttribute('radius', s.getAttribute('radius') || 3);
      return Object.assign(c, { pathExtractor: anime.path(s) });
    });
  }

  shine() {
    if (!this.shining) {
      this.shining = anime({ targets: this.reflection, x: [-125, 540], duration: 800, easing: 'easeInOutQuad' }).finished.then(() => this.shining = false);
    }
  }

  connectedCallback() {
    this.addEventListener('mouseenter', this.shine, { passive: true });
    this.addEventListener('touchstart', this.shine, { passive: true });

    if (this.animated) {
      this.style.visibility = 'hidden';
      new OnScreen(this, {
        once: true,
        enter: () => {
          this.style.visibility = 'visible';
          this.strokes.forEach(s => s.style['stroke-opacity'] = 1);
          const duration = 2000;
          const easing = 'easeInOutQuad';
          const defaults = { delay: e => e.getAttribute('delay'), duration: e => duration - parseInt(e.getAttribute('delay')) + 1000, easing };
          // TODO: use anime timeline
          anime({ targets: this.strokes, ...defaults, strokeDashoffset: [anime.setDashoffset, 0] });
          anime({ targets: this.circles, ...defaults, r: c => [0, c.getAttribute('radius')], duration: 500 })
            .finished.then(() => anime({ targets: this.circles, r: c => [c.getAttribute('radius'), 0], easing, duration: 500, delay: 300 }));
          anime({ targets: this.circles, ...defaults, translateX: c => c.pathExtractor('x'), translateY: c => c.pathExtractor('y') })
            .finished.then(() => anime({ targets: this.strokes, 'stroke-opacity': 0, duration: 1000, easing })).then(() => this.shine());
          anime({ targets: this.fills, 'fill-opacity': [0, 1], easing, duration, delay: duration });
        }
      });
    } else {
      this.strokes.forEach(s => s.style.stroke = 'none');
    }
  }

  get animated() {
    return this.getAttribute('animated') !== null && this.getAttribute('animated') !== 'false';
  }

  static _generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  }
});
