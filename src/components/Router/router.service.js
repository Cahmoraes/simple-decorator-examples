import so from '../../js/so'
import pushState from '../../js/utils/pushState'

function routerServiceMiddleware (_, newValue, next) {
  const path = newValue.replace('/', '')
  next(path)
}

const initialPath = (window.location.pathname.slice(1) || '').replace('/', '')
const $router = so.observable(initialPath, routerServiceMiddleware)

export class RouterService {
  constructor () {
    if (!RouterService.instance) {
      RouterService.instance = this
    }
    return RouterService.instance
  }

  get route () {
    return $router
  }

  setRoute (path) {
    $router(path)
  }

  navigate (path) {
    pushState(path.replace('/', ''))
    this.setRoute(path)
  }
}

const routerServiceInstance = new RouterService()
Object.freeze(routerServiceInstance)
export default routerServiceInstance
