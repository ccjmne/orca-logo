import { ON_SCREEN } from './utils/onscreen';

declare global {
  interface Element {
    [ON_SCREEN]: boolean;
  }
}
