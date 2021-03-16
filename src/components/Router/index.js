import so from '../../js/so'
import getEnvironment from '../../js/utils/getEnvironment'
import RouterService from './router.service'

export default class Router {
  constructor () {
    this._currentRoute = so.observable(window.location.pathname)
  }

  addEventListener () {
    window.addEventListener('popstate', () => {
      if (this._currentRoute() !== this.getWindowRoute().replace('/', '')) {
        this.setRoute(this.getWindowRoute())
      }
    })
  }

  navigate (path) {
    RouterService.navigate(path)
  }

  get route () {
    return RouterService.route
  }

  getWindowRoute () {
    return window.location.pathname
  }

  setRoute (path) {
    RouterService.setRoute(path)
  }

  setCurrentRoute (path) {
    if (typeof path !== 'undefined') {
      this._currentRoute(path)
    }
  }

  subscribeObservable () {
    RouterService.route.subscribe(value => {
      this.setCurrentRoute(value)
    })
  }

  verifyLocastorage () {
    const key = process.env.STORAGED_PATH
    const storagedPath = window.localStorage.getItem(key)
    if (storagedPath) {
      window.localStorage.removeItem(key)
      const tmpPath = storagedPath.split('/')[1] || '/'
      const path = `${getEnvironment()}/${tmpPath}`
      this.navigate(path)
    }
  }

  init () {
    this.verifyLocastorage()
    this.addEventListener()
    this.subscribeObservable()
    return this
  }
}
