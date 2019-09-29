import { isArray, isPlainObject } from 'lodash-es'

/**
 * Recursively deletes all keys
 * @param {import('apollo-cache').DataProxy} store Apollo proxy store
 * @param {string} id Store data key
 */
export function deepDeleteId (store, id) {
  const data = store.data

  if (typeof data[id] !== 'undefined') {
    Object.values(data[id]).forEach((v) => {
      if (isArray(v)) {
        v.forEach(c => isPlainObject(c) && c.type === 'id' && deepDeleteId(store, c.id))
      } else if (isPlainObject(v) && v.type === 'id') {
        deepDeleteId(store, v.id)
      }
    })

    store.data.delete(id)
  }
}

/**
 * Deletes root query cache and all related ids
 * @param {import('apollo-cache').DataProxy} store Apollo proxy store
 * @param {string|RegExp} query Query to match
 */
export function storeDeleteQuery (store, query) {
  const rootQuery = store.data.data.ROOT_QUERY

  Object.entries(rootQuery).forEach(([k, v]) => {
    // If regex, use match, else direct compare
    if ((query instanceof RegExp && k.match(query)) || k === query) {
      // If query result is array, iterate through
      if (isArray(v)) {
        // If children type of id, each recursively delete from store
        v.forEach(c => c.type === 'id' && deepDeleteId(store, c.id))
      } else if (isPlainObject(v) && v.type === 'id') {
        // Recursively delete from store
        deepDeleteId(store, v.id)
      }

      // Finally, remove the query
      delete rootQuery[k]
    }
  })
}
