import { cloneDeep, get, set, pick } from 'lodash-es'

export const cacheObjKeys = (obj, keys) => {
  const cache = cloneDeep(pick(obj, keys))
  const restore = () => keys.forEach(key => set(obj, key, get(cache, key)))
  return { cache, restore }
}
