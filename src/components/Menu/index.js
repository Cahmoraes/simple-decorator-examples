import so from '../../js/so'
import template from './template.html'
import './styles'
import Component from '../../models/component'

export default class Menu extends Component {
  constructor (router, element = document.getElementById('menu')) {
    super(element)
    this._router = router
    this._config = { title: 'Simple Decor@tor' }
    this.$_activeItem = so.observable()
    this._menuItems = []
    this._activeClass = 'active'
    this._menuHamburguer = null
    this._navMenu = null
    this._menuContainer = null
  }

  render () {
    return this._element.insertAdjacentHTML('beforeend', template(this._config))
  }

  subscribeObservable () {
    this.$_activeItem.subscribe(activeItem => {
      if (!activeItem) return
      this._menuItems.forEach(item => item.classList.remove(this._activeClass))
      activeItem.classList.add(this._activeClass)
      activeItem.parentElement.classList.add(this._activeClass)
    })
  }

  getElements () {
    this._menuItems = [...this._element.querySelectorAll('li')]
    this._menuHamburguer = this._element.querySelector('[data-menu="hamburguer"]')
    this._navMenu = this._element.querySelector('[data-menu="nav"]')
    this._menuContainer = this._element.querySelector('[data-menu="container"]')
  }

  handleOutsideClick (event) {
    const clickedElement = event.target
    if (!this._menuContainer.contains(clickedElement)) {
      this._navMenu.classList.remove(this._activeClass)
      this._menuHamburguer.classList.remove(this._activeClass)
      document.body.removeEventListener('click', this.handleOutsideClick)
    }
  }

  addEventLitenerMenu () {
    this._router.route.subscribe(path => {
      if (path !== '/') {
        const pathEnhancement = path.replace('/', '')
        const menuItem = this._element.querySelector(`[href*="/${pathEnhancement}"]`)
        if (menuItem) {
          this.$_activeItem(menuItem.parentElement)
        }
      } else {
        this.$_activeItem(this._element.querySelector('[href]').parentElement)
      }
      this._navMenu.classList.remove(this._activeClass)
      this._menuHamburguer.classList.remove(this._activeClass)
    })

    this._menuHamburguer.addEventListener('click', () => {
      this._navMenu.classList.add(this._activeClass)
      this._menuHamburguer.classList.add(this._activeClass)
      document.body.addEventListener('click', this.handleOutsideClick)
    })
  }

  bindMethods () {
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  init () {
    this.bindMethods()
    this.render()
    this.getElements()
    this.subscribeObservable()
    this.addEventLitenerMenu()
    return this
  }
}
