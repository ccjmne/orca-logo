import Counter from '../utils/counter.class';
import OnScreen from '../utils/onscreen';

import sheet from './orca-logo.scss';

/* eslint-disable no-new */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

const template = document.createElement(`template`);
template.innerHTML = require('./orca-logo.html');

const CLIP_ID_PREFIX = 'orca-logo:clip';
const CLIP_ID_SEQ = new Counter();

window.customElements.define(
  'orca-logo',
  class OrcaLogo extends HTMLElement {

    public static get observedAttributes() {
      return ['animated'];
    }

    /**
     * `shadowRoot` usually is of type `ShadowRoot | null`,
     * but in `CcElement`, is is always attached (i.e.: defined).
     */
    declare readonly shadowRoot: ShadowRoot;

    private reflection: SVGRectElement;
    private shining = false;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.adoptedStyleSheets = [sheet];
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.reflection = this.shadowRoot.querySelector('rect.shine')!;
    }

    connectedCallback() {
      if (!this.isConnected) {
        /**
         * Note: `connectedCallback` may be called once your element is no longer connected,
         * use Node.isConnected to make sure.
         *
         * See https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks
         */
        return;
      }

      // Generate unique clipPath ids (for the shine) for each orca-logo instance
      const clips: { [key: string]: number } = Array
        .from(this.shadowRoot.querySelectorAll('clipPath[data-clip]'))
        .reduce((acc, e) => ({ ...acc, [e.getAttribute('data-clip')!]: `${CLIP_ID_PREFIX}#${CLIP_ID_SEQ.increment()}` }), {});
      this.shadowRoot
        .querySelectorAll('[data-clip-path]')
        .forEach(path => path.setAttributeNS('http://www.w3.org/2000/svg', 'clip-path', `url(#${clips[path.getAttribute('data-clip-path')!]})`));

      if (!this.spinner) {
        // don't need to be removed on disconnectedCallback since they only are scoped to `this`
        this.addEventListener('mouseenter', this.shine, { passive: true });
        this.addEventListener('touchstart', this.shine, { passive: true });
      }

      if (this.animated) {
        // TODO: avoid `new` without assignment...
        new OnScreen(this, { once: true, enter: () => this.classList.add('in-viewport') });
      }
    }

    public shine() {
      if (!this.shining) {
        this.shining = !!(this.reflection.animate(
          { x: [-125, 540] },
          { duration: 800, easing: 'ease-in-out' },
        ).onfinish = () => (this.shining = false));
      }
    }

    public get animated() {
      return (
        this.getAttribute('animated') !== null
        && this.getAttribute('animated') !== 'spinner'
        && this.getAttribute('animated') !== 'false'
      );
    }

    public get spinner() {
      return this.getAttribute('animated') === 'spinner';
    }

  },
);
