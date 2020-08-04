/* eslint-disable import/prefer-default-export */
import { makeVar } from '@apollo/client';
import { getStorageItem, setStorageItem } from '/@/utils';

type AppTheme = 'light' | 'dark';

const APP_THEME_KEY = 'apptheme';
const storedAppTheme = getStorageItem<AppTheme>(localStorage, APP_THEME_KEY, 'light');

const internalAppTheme = makeVar(storedAppTheme);

// Need to hook an event on change.
// Apollo currently doesn't implement a `subscribe` hook, but this will do.
export const appTheme: typeof internalAppTheme = (...args) => {
  if (args.length > 0) {
    setStorageItem(localStorage, APP_THEME_KEY, args[0]);
  }

  return internalAppTheme(...args);
};
