export const debounceTime = (milliseconds = 200) => {
  let timer = 0
  return (method, property, args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = 0
      return method(...args)
    }, milliseconds)
  }
}
