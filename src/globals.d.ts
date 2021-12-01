import { ON_SCREEN } from './utils/onscreen';

declare global {
  interface ShadowRoot {
    adoptedStyleSheets: ReadonlyArray<CSSStyleSheet>;
  }

  interface Element {
    [ON_SCREEN]: boolean;
  }
}
