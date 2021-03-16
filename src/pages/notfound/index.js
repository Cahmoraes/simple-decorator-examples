import template from './template.html'
import './styles.scss'
import notfoundImg from '../../assets/img/404.png'

export default class NotFound {
  constructor (element = document.getElementById(process.env.ROOT_ELEMENT)) {
    this._root = element
    this._config = {
      title: 'Página não encontrada',
      notfoundImg
    }
  }

  addEventListener () {
    const skeleton = this._root.querySelector('.skeleton')
    const img = this._root.querySelector('img')
    img.addEventListener('load', (e) => {
      const target = e.target
      target.style.opacity = 1
      skeleton.remove()
    })
  }

  render () {
    this._root.insertAdjacentHTML('beforeend', template(this._config))
  }

  init () {
    this.render()
    this.addEventListener()
    return this
  }
}
