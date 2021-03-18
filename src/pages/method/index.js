import sd from '../../js/sd'
import { debounceTime } from '../../js/utils/decorators/method_decorators'
import { domInject } from '../../js/utils/decorators/property_decorators'
import template from './template.html'

export default class Method {
  constructor (element = document.getElementById(process.env.ROOT_ELEMENT)) {
    this._root = element
    sd.property(
      this,
      {
        _button_1: domInject('#button_1'),
        _output_1: domInject('#output_1')
      }
    )
    this._config = {
      title: 'Method Decorator',
      button_1: 'button_1',
      output_1: 'output_1'
    }
  }

  render () {
    this._root.insertAdjacentHTML('beforeend', template(this._config))
  }

  addEventListener () {
    this._button_1.addEventListener('click', this.loadContent.bind(this))
  }

  loadContent () {
    this._output_1.textContent += 'Executou\n'
  }

  init () {
    this.render()
    this.addEventListener()
    return this
  }
}

sd.method(
  Method,
  {
    loadContent: debounceTime(500)
  }
)
