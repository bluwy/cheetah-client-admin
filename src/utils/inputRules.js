export const required = v => !!v || 'Required'

export const minLength = length => v => v.length >= length || `Min ${length} character${length !== 0 ? 's' : ''}`

export const maxLength = length => v => v.length <= length || `Max ${length} character${length !== 0 ? 's' : ''}`

export const email = v => /\S+@\S+\.\S+/.test(v) || 'Email is invalid'
