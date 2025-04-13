
import * as ol from 'ol';

declare global {
  interface Window {
    ol: typeof ol;
  }
}

export {};
