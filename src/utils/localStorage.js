const itemFactory = (itemName) => {
  return function (val) {
    if (arguments.length > 0) {
      if (val != null) {
        localStorage.setItem(itemName, val)
      } else {
        localStorage.removeItem(itemName)
      }
    } else {
      return localStorage.getItem(itemName)
    }
  }
}

export const authToken = itemFactory('authToken')
