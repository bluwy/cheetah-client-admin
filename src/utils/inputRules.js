export const required = v => !!v || 'Required'

export const minStrLength = length => v => (v && v.length >= length) || `Min ${length} character${length !== 1 ? 's' : ''}`

export const maxStrLength = length => v => (v && v.length <= length) || `Max ${length} character${length !== 1 ? 's' : ''}`

export const minArrLength = length => v => (v && v.length >= length) || `Min ${length} item${length !== 1 ? 's' : ''}`

export const maxArrLength = length => v => (v && v.length <= length) || `Max ${length} item${length !== 1 ? 's' : ''}`

export const email = v => !v || /\S+@\S+\.\S+/.test(v) || 'Email is invalid'
