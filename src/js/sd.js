const sd = (function () {
  const simpleDecorator = {
    /**
     * @param {object} thisArg
     * @param {object} handler
     * */
    property (thisArg, handler) {
      try {
        if (typeof thisArg !== 'object') {
          throw new Error('ThisArgs should be an Object Instance')
        }
        if (typeof handler !== 'object') {
          throw new Error('handler should be an Object')
        }

        Object.keys(handler).forEach(property => {
          if (Array.isArray(handler[property])) {
            handler[property].forEach(decorator => {
              decorator(thisArg, property)
            })
          } else {
            const decorator = handler[property]
            if (typeof decorator !== 'function') {
              throw new Error('decorator should be a function')
            }
            decorator(thisArg, property)
          }
        })
      } catch (error) {
        console.error(error.message)
      }
    },
    /**
   * @param {function} clazz
   * @param {object} handler
   * */
    method (clazz, handler) {
      try {
        if (typeof clazz !== 'function') {
          throw new Error('Clazz should be a Constructor Function')
        }

        if (typeof handler !== 'object') {
          throw new Error('handler should be an Object')
        }

        Object.keys(handler).forEach(property => {
          if (Array.isArray(handler[property])) {
            handler[property].reverse().forEach(decorator => {
              const method = clazz.prototype[property]
              if (typeof method !== 'function') {
                throw new Error(`${property} isn't at prototype of ${clazz.name}`)
              }
              clazz.prototype[property] = function (...args) {
                return decorator(method.bind(this), property, args)
              }
            })
          } else {
            const method = clazz.prototype[property]
            if (typeof method !== 'function') {
              throw new Error(`${property} isn't at prototype of ${clazz.name}`)
            }
            const decorator = handler[property]
            clazz.prototype[property] = function (...args) {
              return decorator(method.bind(this), property, args)
            }
          }
        })
      } catch (error) {
        console.error(error.message)
      }
    }
  }
  return simpleDecorator
})()

export default sd
