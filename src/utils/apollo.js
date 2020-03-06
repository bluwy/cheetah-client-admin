import { isArray, isPlainObject } from 'lodash-es'

/**
 * Look for GraphQL errors if present and return its messages, otherwise return the usual message
 * @param {Error} error
 * @returns {string[]}
 */
export function getErrorMessages (error) {
  if (!error) {
    return ['']
  } else if (error.graphQLErrors && error.graphQLErrors.length) {
    return error.graphQLErrors.map(v => v.message)
  } else {
    return [error.message]
  }
}

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

  Object.keys(rootQuery).forEach((k) => {
    // If regex, use match, else direct compare
    if ((query instanceof RegExp && k.match(query)) || k === query) {
      delete rootQuery[k]
    }
  })
}
