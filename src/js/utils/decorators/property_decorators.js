export const domInject =
  (selector, list = false) =>
  (thisArg, property) => {
    let element = null
    return Object.defineProperty(thisArg, property, {
      get() {
        if (!element && !list) element = document.querySelector(selector)
        else if (!element && list) element = document.querySelectorAll(selector)
        return element
      },
    })
  }

export const InitialValue = (initialValue) => (thisArg, property) => {
  let currentValue = null
  console.log(thisArg)
  return Object.defineProperty(thisArg, property, {
    get() {
      return currentValue || initialValue
    },
    set(newValue) {
      if (newValue) {
        currentValue = newValue
      }
    },
    configurable: true,
  })
}
