import getEnvironment from '../../../js/utils/getEnvironment'
import RouterService from '../router.service'

export default class Link extends window.HTMLAnchorElement {
  constructor () {
    super()

    const currentPath = this.getAttribute('href')
    this.setAttribute('href', `${getEnvironment()}${currentPath}`)

    this._path = this.getAttribute('href')
  }

  connectedCallback () {
    this.addEventListener('click', (event) => {
      event.preventDefault()
      RouterService.navigate(this._path)
    })
  }
}
