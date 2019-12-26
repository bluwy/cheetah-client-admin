import { cloneDeep, get, set } from 'lodash-es'

/**
 * Cache the keys of `obj`
 * @param {{}} obj
 * @param {string[]} keys
 */
export const cacheObjKeys = (obj, keys) => {
  return keys.reduce((acc, key) => set(acc, key, cloneDeep(get(obj, key))), {})
}

/**
 * Restore `obj`'s keys with cache (Mutates `obj`)
 * @param {{}} obj
 * @param {{}} cache
 */
export const restoreObjKeys = (obj, cache) => {
  Object.entries(cache).forEach(([k, v]) => set(obj, k, v))
}
