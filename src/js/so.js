const so = (function () {
  // Utilitários de estados
  const state = {
    createObservableState({ state, getSubscribers }) {
      function managerSate(newState) {
        return { ...Object.assign(state, newState) }
      }

      function getObservableValue() {
        return state.currentValue
      }

      function getPrevObservableValue() {
        return state.prevValue
      }

      function getInitialObservableValue() {
        return state.initialValue
      }

      function setObservableValue(newValue) {
        managerSate({ currentValue: newValue })
      }

      function setPrevObservableValue(currentValue) {
        managerSate({ prevValue: currentValue })
      }

      function setObservableValues(newValue) {
        setPrevObservableValue(getObservableValue())
        setObservableValue(newValue)
        functions.createFnNotifyAll({
          getSubscribers,
          getObservableValue,
        })()
      }

      return {
        getObservableValue,
        setObservableValues,
        getPrevObservableValue,
        getInitialObservableValue,
      }
    },
    createObservableComputedState({ state, getSubscribers }) {
      function managerSate(newState) {
        return { ...Object.assign(state, newState) }
      }

      function getObservableValue() {
        return state.computedValue
      }

      function setObservableValue() {
        managerSate({ computedValue: state.computedFn() })
        functions.createFnNotifyAll({
          getSubscribers,
          getObservableValue,
        })()
      }

      return {
        getObservableValue,
        setObservableValue,
      }
    },
    createObservableArrayState(state = []) {
      function managerState(newState) {
        state = [...newState]
        return state
      }

      function clearArray() {
        managerState([])
      }

      function addElement(...element) {
        managerState([...state, ...element])
      }

      function getElements() {
        return [...state]
      }

      function getElement(index) {
        return state[index]
      }

      function removeElement(element) {
        let newState = state
        if (typeof element === 'number') {
          newState = state.filter((_, index) => index !== element)
        }
        if (typeof element === 'function') {
          newState = state.filter((el) => el !== element)
        }
        if (typeof element === 'object') {
          newState = state.filter((el) => el() !== element)
        }
        managerState(newState)
      }

      return {
        getElement,
        getElements,
        addElement,
        removeElement,
        clearArray,
      }
    },
    createSubscribersState(state = []) {
      function managerState(newState) {
        state = [...newState]
        return state
      }

      function isDuplicate(subscriber) {
        return state.includes(subscriber)
      }

      function addSubscriber(subscriber) {
        !isDuplicate(subscriber) && managerState([...state, subscriber])
      }

      function getSubscribers() {
        return [...state]
      }

      function removeSubscriber(subscriber) {
        const newState = state.filter(function (subs) {
          return subs !== subscriber
        })
        managerState(newState)
      }

      function clearSubscribers() {
        managerState([])
      }

      return {
        addSubscriber,
        getSubscribers,
        removeSubscriber,
        clearSubscribers,
      }
    },
  }
  // Utilitários de propriedades
  const props = {
    createObservableProps({ subscribersState, observableState }) {
      const notify = functions.createFnNotifyAll({
        getSubscribers: subscribersState.getSubscribers,
        getObservableValue: observableState.getObservableValue,
      })

      return {
        subscribe: {
          get() {
            return functions.createFnSubscribe({
              subscribersState,
              notify,
            })
          },
          enumerable: true,
        },
        // Propriedade prevValue que retorna o valor inicial do observable
        prevValue: {
          get() {
            return observableState.getPrevObservableValue()
          },
          enumerable: true,
        },
        // Propriedade initialValue que retorna o valor inicial do observable
        initialValue: {
          get() {
            return observableState.getInitialObservableValue()
          },
          enumerable: true,
        },
      }
    },
    createPipeProp({ observableState }) {
      return {
        pipe: {
          get() {
            return function (...fns) {
              const pipeableValue = functions.pipe(...fns)(
                observableState.getObservableValue(),
              )
              observableState.setObservableValues(pipeableValue)
              return this
            }
          },
          enumerable: true,
        },
      }
    },
    createObservableArrayProps({ subscribersState, observableArrayState }) {
      const notifyObservableArray = functions.createFnNotifyAll({
        getSubscribers: subscribersState.getSubscribers,
        getObservableValue: observableArrayState.getElements,
      })

      return {
        subscribe: {
          get() {
            return functions.createFnObservableArraySubscribe({
              subscribersState,
              notify: notifyObservableArray,
            })
          },
          enumerable: true,
        },
        dispose: {
          get() {
            return subscribersState.clearSubscribers
          },
          enumerable: true,
        },
        add: {
          get() {
            return function add(...elements) {
              observableArrayTools.createObservableArrayElement({
                observableArrayState,
                elements,
                notifyAll: notifyObservableArray,
              })
            }
          },
          enumerable: true,
        },
        remove: {
          get() {
            return function remove(element) {
              observableArrayState.removeElement(element)
              notifyObservableArray()
            }
          },
          enumerable: true,
        },
        get: {
          get() {
            return function get(index) {
              if (typeof index !== 'number') {
                throw new Error('index should be a type number')
              }
              return observableArrayState.getElement(index)
            }
          },
          enumerable: true,
        },
        getValue: {
          get() {
            return function getValue(index) {
              if (typeof index !== 'number') {
                throw new Error('index must be a type number')
              }
              return observableArrayState.getElement(index)
            }
          },
          enumerable: true,
        },
        flatMap: {
          get() {
            return function flatMap(callback) {
              if (typeof callback !== 'function') {
                throw new Error('flatMap should receive a function as callback')
              }
              return this()
                .map(function (item, index) {
                  return callback(item(), index)
                })
                .reduce(function (flatArray, array) {
                  return flatArray.concat(array)
                }, [])
            }
          },
          enumerable: true,
        },
        clear: {
          get() {
            return function clear() {
              observableArrayState.clearArray()
              notifyObservableArray()
              subscribersState.clearSubscribers()
            }
          },
          enumerable: true,
        },
      }
    },
    createComputedObservableProps({
      subscribersState,
      observableState,
      subscriptionsDependencies,
    }) {
      const notify = functions.createFnNotifyAll({
        getSubscribers: subscribersState.getSubscribers,
        getObservableValue: observableState.getObservableValue,
      })

      return {
        subscribe: {
          get() {
            return functions.createFnComputedSubscribe({
              subscribersState,
              subscriptionsDependencies,
              notify,
            })
          },
          enumerable: true,
        },
      }
    },
    createMemoObservableProps({ cache, fnName }) {
      return {
        name: {
          value: fnName,
        },
        release: {
          get() {
            return function release() {
              cache.clear()
            }
          },
          enumerable: true,
        },
      }
    },
  }
  // Utilitários de funções
  const functions = {
    createFnSubscribe({ subscribersState, notify }) {
      return function subscribe(subscriber) {
        if (typeof subscriber !== 'function') {
          throw new Error('Subscribe should receive a callback function')
        }
        subscribersState.addSubscriber(subscriber)
        notify()
        return {
          dispose: functions.createFnDispose({
            removeSubscriber: subscribersState.removeSubscriber,
            subscriberToRemove: subscriber,
          }),
        }
      }
    },
    createFnComputedSubscribe({
      subscribersState,
      subscriptionsDependencies,
      notify,
    }) {
      return function subscribe(subscriber) {
        if (typeof subscriber !== 'function') {
          throw new Error('Subscribe must receive a callback function')
        }
        subscribersState.addSubscriber(subscriber)
        notify()
        return {
          dispose: functions.createFnComputedDispose({
            removeSubscriber: subscribersState.removeSubscriber,
            subscriberToRemove: subscriber,
            subscriptionsDependencies,
          }),
        }
      }
    },
    createFnObservableArraySubscribe({ subscribersState, notify }) {
      return function subscribe(subscriber) {
        if (typeof subscriber !== 'function') {
          throw new Error('Subscribe must receive a callback function')
        }
        subscribersState.addSubscriber(subscriber)
        notify()
        return {
          dispose: functions.createFnDispose({
            removeSubscriber: subscribersState.removeSubscriber,
            subscriberToRemove: subscriber,
          }),
        }
      }
    },
    createFnComputedDispose({
      removeSubscriber,
      subscriberToRemove,
      subscriptionsDependencies,
    }) {
      return function dispose() {
        removeSubscriber(subscriberToRemove)
        computedObservableTools.removeComputedDependencies(
          subscriptionsDependencies,
        )
      }
    },
    createFnNotifyAll({ getSubscribers, getObservableValue }) {
      return function notifyAll() {
        if (!getSubscribers().length) return null
        getSubscribers().forEach(function (subscriber) {
          subscriber(getObservableValue())
        })
      }
    },
    createFnDispose({ removeSubscriber, subscriberToRemove }) {
      return function dispose() {
        removeSubscriber(subscriberToRemove)
      }
    },
    pipe(...fns) {
      return function (value) {
        return fns.reduce(function (pipeableValue, fn) {
          return fn(pipeableValue)
        }, value)
      }
    },
    combineProperties(...properties) {
      return properties.reduce(function (combinedProperties, property) {
        return Object.assign(combinedProperties, property)
      }, {})
    },
    memoizer(fn) {
      const cache = new Map()
      const memoFn = (...args) => {
        const key = JSON.stringify(args)
        if (cache.has(key)) {
          return cache.get(key)
        } else {
          const result = fn(...args)
          cache.set(key, result)
          return result
        }
      }
      Object.defineProperties(
        memoFn,
        props.createMemoObservableProps({ cache, fnName: `${fn.name}M` }),
      )
      return memoFn
    },
  }
  // Utilitários de middleware
  const middlewareTools = {
    createMiddlewareFnNext({ observableState, newParameterValue }) {
      return function (middlewareValue) {
        observableState.setObservableValues(
          middlewareValue || newParameterValue,
        )
        return observableState.getObservableValue()
      }
    },
    createMiddleware({ middleware, observableState, newParameterValue }) {
      if (typeof middleware !== 'function') return false
      return middleware.bind(
        this,
        observableState.getObservableValue(),
        newParameterValue,
        middlewareTools.createMiddlewareFnNext({
          observableState,
          newParameterValue,
        }),
      )
    },
  }
  // Utilitários de Observable
  const observableTools = {
    validateObservableParams({ parameterValue }) {
      if (typeof parameterValue === 'function') {
        return parameterValue()
      }
      return parameterValue
    },
  }
  // Utilitários de ComputedObservable
  const computedObservableTools = {
    validateComputedObervableParams({ computedFn, dependencies }) {
      // Verifica se computedFn não é uma função
      if (typeof computedFn !== 'function') {
        throw new Error('computedFn must be a function')
      }
      // Verifica se dependencies não é um array
      if (!Array.isArray(dependencies)) {
        throw new Error('dependencies must be a Array')
      }
      // Verifica se as dependências estão vazias
      if (dependencies.length === 0) {
        throw new Error('dependencies is empty')
      } else {
        if (
          !Object.prototype.hasOwnProperty.call(dependencies[0], 'subscribe')
        ) {
          throw new Error('dependencie must be a observable')
        }
      }
    },
    removeComputedDependencies(subscriptionsDependencies) {
      subscriptionsDependencies.map((subscription) => subscription.dispose())
    },
  }
  // Utilitários de Observable Array
  const observableArrayTools = {
    createElementArray({ addElement, element, notifyAll }) {
      addElement(element)
      element.subscribe(notifyAll)
    },
    createObservableArrayElement({
      observableArrayState,
      elements,
      notifyAll,
    }) {
      if (typeof elements === 'undefined' || elements.length === 0) {
        return []
      }
      elements.forEach((element) =>
        observableArrayTools.createElementArray({
          addElement: observableArrayState.addElement,
          element: so.observable(element),
          notifyAll,
        }),
      )
    },
  }
  // Utilitários de inicialização
  const initialize = {
    observable({ observableState, newParameterValue, createdMiddleware }) {
      if (typeof newParameterValue === 'undefined') {
        return observableState.getObservableValue()
      }
      if (typeof createdMiddleware === 'function') {
        createdMiddleware()
      }
      if (typeof newParameterValue === 'function') {
        const callbackEvaluated = newParameterValue(
          observableState.getObservableValue(),
        )
        if (typeof callbackEvaluated === 'undefined') {
          observableState.setObservableValues(
            observableState.getObservableValue(),
          )
        } else {
          observableState.setObservableValues(callbackEvaluated)
        }
        return observableState.getObservableValue()
      }
      observableState.setObservableValues(newParameterValue)
      return observableState.getObservableValue()
    },
    computedObservable({ dependencies, observableState }) {
      const setObservableComputedValue = () =>
        observableState.setObservableValue()

      return {
        createDependenciesState() {
          // Cria array com todas as dependências recebidas por parâmetro.
          // Verifica se as dependências possuem a propriedade subscribe e se são funções.
          const _dependencesSubscriptions = dependencies.map((dep) => {
            return (
              Object.prototype.hasOwnProperty.call(dep, 'subscribe') &&
              typeof dep.subscribe === 'function' &&
              dep.subscribe(setObservableComputedValue)
            )
          })
          return _dependencesSubscriptions
        },
      }
    },
    observableArray({
      observableArrayState,
      subscribersState,
      newParamValue,
      notifyObservableArray,
    }) {
      if (typeof newParamValue === 'undefined') {
        return observableArrayState.getElements()
      }
      if (newParamValue.length === 0) {
        return observableArrayState.getElements()
      }
      if (typeof newParamValue === 'function') {
        return newParamValue(observableArrayState.getElements())
      }

      observableArrayState.clearArray()
      subscribersState.clearSubscribers()

      observableArrayTools.createObservableArrayElement({
        observableArrayState,
        elements: newParamValue,
        notifyAll: notifyObservableArray,
      })

      notifyObservableArray()
    },
  }
  // SO
  const so = {
    // Cria Observable
    observable(parameterValue, middleware = null) {
      const initialValue = observableTools.validateObservableParams({
        parameterValue,
      })
      // Inicializa o estado do Array de inscritos
      const subscribersState = state.createSubscribersState()
      // Estatos iniciais do Observable
      const initialState = {
        initialValue,
        prevValue: null,
        currentValue: initialValue,
      }
      // Gerencia os estados do Observable
      const observableState = state.createObservableState({
        state: initialState,
        getSubscribers: subscribersState.getSubscribers,
      })
      // Gerencia a chamada do Observable
      function observable(newParameterValue) {
        // Cria Middleware
        const createdMiddleware = middlewareTools.createMiddleware({
          middleware,
          observableState,
          newParameterValue,
        })

        return initialize.observable({
          observableState,
          newParameterValue,
          createdMiddleware,
        })
      }
      // Compõe o objeto Observables
      Object.defineProperties(
        observable,
        functions.combineProperties(
          props.createObservableProps({ subscribersState, observableState }),
          props.createPipeProp({ observableState }),
        ),
      )
      // Retorna o Observable
      return observable
    },
    // Cria Computed Observable
    computed(computedFn, dependencies = null) {
      // Verifica se os parâmetros são válidos
      computedObservableTools.validateComputedObervableParams({
        computedFn,
        dependencies,
      })
      // Inicializa o estado do Array de inscritos
      const subscribersState = state.createSubscribersState()
      // Estatos iniciais do Observable
      const initialState = {
        computedValue: computedFn(),
        computedFn: computedFn,
      }
      // Gerencia os estados do Observable
      const computedObservableState = state.createObservableComputedState({
        state: initialState,
        getSubscribers: subscribersState.getSubscribers,
      })
      // Inicializa a construção do Computed Observable
      const _dependencesSubscriptions = initialize
        .computedObservable({
          dependencies,
          observableState: computedObservableState,
        })
        .createDependenciesState()
      // Gerencia a chamada do Computed Observable
      function computedObservable() {
        return computedObservableState.getObservableValue()
      }
      // Compõe o objeto Observables
      Object.defineProperties(
        computedObservable,
        functions.combineProperties(
          props.createObservableProps({
            subscribersState,
            observableState: computedObservableState,
          }),
          props.createComputedObservableProps({
            subscribersState,
            observableState: computedObservableState,
            subscriptionsDependencies: _dependencesSubscriptions,
          }),
        ),
      )
      // Retorna o Computed Observable
      return computedObservable
    },
    // Cria Observable Array
    observableArray(...parameterData) {
      const observableArrayState = state.createObservableArrayState()
      const subscribersState = state.createSubscribersState()
      const notifyObservableArray = functions.createFnNotifyAll({
        getSubscribers: subscribersState.getSubscribers,
        getObservableValue: observableArrayState.getElements,
      })

      observableArrayTools.createObservableArrayElement({
        observableArrayState,
        elements: parameterData,
        notifyAll: notifyObservableArray,
      })

      function observableArray(...newParameterValue) {
        return initialize.observableArray({
          observableArrayState,
          subscribersState,
          newParamValue: newParameterValue,
          notifyObservableArray,
        })
      }

      Object.defineProperties(
        observableArray,
        props.createObservableArrayProps({
          subscribersState,
          observableArrayState,
        }),
      )

      return observableArray
    },
    // Cria Observable
    memo(parameterValue) {
      const initialValue = observableTools.validateObservableParams({
        parameterValue,
      })
      // Inicializa o estado do Array de inscritos
      const subscribersState = state.createSubscribersState()
      // Estatos iniciais do Observable
      const initialState = {
        initialValue,
        prevValue: null,
        currentValue: initialValue,
      }
      // Gerencia os estados do Observable
      const observableState = state.createObservableState({
        state: initialState,
        getSubscribers: subscribersState.getSubscribers,
      })
      // Gerencia a chamada do Observable
      function memo(newParameterValue) {
        return initialize.observable({
          observableState,
          newParameterValue,
        })
      }
      // Compõe o objeto Observables
      const observableMemo = functions.memoizer(memo)
      Object.defineProperties(
        observableMemo,
        functions.combineProperties(
          props.createObservableProps({ subscribersState, observableState }),
          props.createPipeProp({ observableState }),
        ),
      )
      // Retorna o Memo Observable
      return observableMemo
    },
  }

  return so
})()

export default so
