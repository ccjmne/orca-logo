'use strict';

import OnScreen from '../utils/onscreen';

window.customElements.define('orca-logo', class OrcaLogo extends HTMLElement {

  static get observedAttributes() {
    return ['animated'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = require('./orca-logo.html');
    (styling => (styling.textContent = require('!./orca-logo.scss'), this.shadowRoot.prepend(styling)))(document.createElement('style'));

    // Generate unique clipPath ids (for the shine) for each orca-logo instance
    const clips = [].map.call(this.shadowRoot.querySelectorAll('clipPath[data-clip]'), clip => (clip.id = OrcaLogo._generateUUID(), clip)).reduce((acc, clip) => (acc[clip.getAttribute('data-clip')] = clip.id, acc), {});
    this.shadowRoot.querySelectorAll('[data-clip-path]').forEach(path => path.setAttributeNS(null, 'clip-path', `url(#${ clips[path.getAttribute('data-clip-path')] })`));
    this.reflection = this.shadowRoot.querySelector('rect.shine');

    if (!this.spinner) {
      // don't need to be removed on disconnectedCallback since they only are scoped to `this`
      this.addEventListener('mouseenter', this.shine, { passive: true });
      this.addEventListener('touchstart', this.shine, { passive: true });
    }

    if (this.animated) {
      new OnScreen(this, { once: true, enter: () => this.classList.add('in-viewport') });
    }
  }

  shine() {
    if (!this.shining) {
      this.shining = this.reflection.animate({ x: [-125, 540] }, { duration: 800, easing: 'ease-in-out' }).onfinish = () => this.shining = false;
    }
  }

  get animated() {
    return this.getAttribute('animated') !== null && this.getAttribute('animated') !== 'spinner' && this.getAttribute('animated') !== 'false';
  }

  get spinner() {
    return this.getAttribute('animated') === 'spinner';
  }

  static _generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  }
});
