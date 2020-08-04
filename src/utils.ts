import { useLocation } from 'react-router-dom';

export function useLocationQuery() {
  return new URLSearchParams(useLocation().search);
}

export function debounce<T extends Function>(fn: T, wait: number): T {
  let t: number | undefined;
  // @ts-ignore
  return function debounced(this: ThisType<T>, ...args) {
    clearTimeout(t);
    t = window.setTimeout(() => fn.apply(this, ...args), wait);
  };
}

export function throttle<T extends Function>(fn: T, wait: number): T {
  let t: number | undefined;
  // @ts-ignore
  return function throttled(this: ThisType<T>, ...args) {
    if (t == null) {
      fn.apply(this, ...args);
      t = window.setTimeout(() => { t = undefined; }, wait);
    }
  };
}

export function getStorageItem<T>(storage: Storage, key: string, defaultValue: T): T;
export function getStorageItem<T>(storage: Storage, key: string, defaultValue?: T): T | undefined;
export function getStorageItem<T>(storage: Storage, key: string, defaultValue?: T): T | undefined {
  const value = storage.getItem(key);

  if (value == null && defaultValue != null) {
    storage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }

  return value != null ? JSON.parse(value) : undefined;
}

export function setStorageItem<T>(storage: Storage, key: string, value: T) {
  storage.setItem(key, JSON.stringify(value));
}
