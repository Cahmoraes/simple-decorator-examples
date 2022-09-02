type ThisArgType<T> = T

type IDecorator<T> = (
  thisArgs: ThisArgType<T>,
  property: string,
  ...args: unknown[]
) => unknown

type IDecoratorMethodType = (
  method: (...args: unknown[]) => unknown,
  property: string,
  ...args: unknown[]
) => unknown

type IDecoratorType<T> = IDecorator<T>

interface IHandler<T> {
  [property: string]: IDecoratorType<T> | IDecoratorType<T>[]
}

interface IHandlerMethod {
  [property: string]: IDecoratorMethodType | IDecoratorMethodType[]
}

function isArray(object: unknown): object is object[] {
  return Array.isArray(object)
}

const sd = (function () {
  const simpleDecorator = {
    /**
     * @param {object} thisArg
     * @param {object} handler
     * */
    property<T>(thisArg: ThisArgType<T>, handler: IHandler<T>) {
      try {
        if (typeof thisArg !== 'object') {
          throw new Error('ThisArgs should be an Object Instance')
        }
        if (typeof handler !== 'object') {
          throw new Error('handler should be an Object')
        }

        Object.keys(handler).forEach((property) => {
          const handlers = handler[property]
          if (isArray(handlers)) {
            handlers.forEach((decorator) => {
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
      } catch (error: any) {
        console.error(error.message)
      }
    },
    /**
     * @param {function} clazz
     * @param {object} handler
     * */
    method<T>(clazz: T, handler: IHandlerMethod) {
      try {
        if (typeof clazz !== 'function') {
          throw new Error('Clazz should be a Constructor Function')
        }

        if (typeof handler !== 'object') {
          throw new Error('handler should be an Object')
        }

        Object.keys(handler).forEach((property) => {
          const handlers = handler[property]
          if (isArray(handlers)) {
            handlers.reverse().forEach((decorator) => {
              const method = clazz.prototype[property]
              if (typeof method !== 'function') {
                throw new Error(
                  `${property} isn't at prototype of ${clazz.name}`,
                )
              }
              clazz.prototype[property] = function (...args: unknown[]) {
                return decorator(method.bind(this), property, args)
              }
            })
          } else {
            const method = clazz.prototype[property]
            if (typeof method !== 'function') {
              throw new Error(`${property} isn't at prototype of ${clazz.name}`)
            }
            const decorator = handler[property] as IDecoratorType<T>
            clazz.prototype[property] = function (...args: unknown[]) {
              return decorator(method.bind(this), property, args)
            }
          }
        })
      } catch (error: any) {
        console.error(error.message)
      }
    },
  }
  return simpleDecorator
})()

export default sd
