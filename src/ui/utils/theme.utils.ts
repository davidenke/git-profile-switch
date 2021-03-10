import { Theme } from '../../common/types';

const schemeWatcher = window.matchMedia('(prefers-color-scheme: dark)');

export const getTheme = (): Theme => schemeWatcher.matches ? 'dark' : 'light';

export const addThemeListener = (listener: (theme: Theme) => void): () => void => {
  const _handler = ({ matches }) => listener(matches ? 'dark' : 'light');
  schemeWatcher.addEventListener('change', _handler, false);
  return () => schemeWatcher.removeEventListener('change', _handler, false);
};
