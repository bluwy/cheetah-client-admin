import { cloneDeep, get, set, pick } from 'lodash-es'

/**
 * Clones the object's keys
 * @param {{}} obj
 * @param {string[]} keys
 */
export const cacheObjKeys = (obj, keys) => {
  const cache = cloneDeep(pick(obj, keys))
  const restore = () => keys.forEach(key => set(obj, key, get(cache, key)))
  return { cache, restore }
}

/**
 * Transform the object converting from key to a value
 * @param {{}} obj
 * @param {{ from: string, to: string, value?: (from: any) => any }[]} transforms
 */
export const transformObj = (obj, transforms) => {
  transforms.forEach((transform) => {
    if (obj[transform.from]) {
      const fromValue = obj[transform.from]
      obj[transform.to] = transform.value != null ? transform.value(fromValue) : fromValue
      delete obj[transform.from]
    }
  })
  return obj
}
