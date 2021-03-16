import template from './template.html'
import Spinner from './../../components/Spinner/template.html'

export default class Loading {
  constructor (element = document.getElementById(process.env.ROOT_ELEMENT)) {
    this._root = element
    this._config = {
      title: 'Loading',
      loading: this.spinner()
    }
  }

  render () {
    this._root.insertAdjacentHTML('beforeend', template(this._config))
  }

  spinner () {
    return `
    ${Spinner({
      width: 90,
      height: 90,
      color_1: '#913BF3',
      color_2: '#84e',
      color_3: '#9B30F9',
      background: '#f1f2f3'
    })}
      <div class="container center roxo">
        <p>Carregando...</p>
      </div>
    `
  }

  init () {
    this.render()
  }
}
