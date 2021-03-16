export const domInject = (selector, list = false) => (thisArgs, property) => {
  let element = null
  return Object.defineProperty(thisArgs, property, {
    get () {
      if (!element && !list) element = document.querySelector(selector)
      else if (!element && list) element = document.querySelectorAll(selector)
      return element
    }
  })
}
