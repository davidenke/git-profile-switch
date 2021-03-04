import type { API } from './common/types';

declare global {
  interface Window {
    api: API;
  }
}

export { Components, JSX } from './components';
