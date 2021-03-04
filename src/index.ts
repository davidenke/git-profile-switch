import type { API } from './types';

declare global {
  interface Window {
    api: API;
  }
}

export { Components, JSX } from './components';
