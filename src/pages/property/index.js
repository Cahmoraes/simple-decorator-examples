import so from '../../js/so'
import template from './template.html'
import './styles'
import sd from '../../js/sd'
import { domInject } from '../../js/utils/decorators/property_decorators'

export default class Property {
  constructor (element = document.getElementById(process.env.ROOT_ELEMENT)) {
    this._root = element
    sd.property(
      this,
      {
        _input_1: domInject('#input_1'),
        _output_1: domInject('#output_1'),
        _output_2: domInject('#output_2')
      }
    )
    this._label_1 = 'Dados de entrada'
    this._label_2 = 'Dados de saída'
    this._label_3 = 'prevValue:'
    this._label_4 = 'newValue:'
    this._$obs_1 = null

    this._config = {
      title: 'Property Decorator',
      label_1: this._label_1,
      label_2: this._label_2,
      label_3: this._label_3,
      label_4: this._label_4,
      input_1: 'input_1',
      output_1: 'output_1',
      output_2: 'output_2'
    }
  }

  createObservable () {
    this._$obs_1 = so.observable('', (prevValue, newValue, next) => {
      this._output_1.textContent = prevValue
      this._output_2.textContent = newValue
      next()
    })
  }

  addEventListenerInputs () {
    this._input_1.addEventListener('input', (event) => {
      const { target: { value } } = event
      this._$obs_1(value)
    })
  }

  render () {
    this._root.insertAdjacentHTML('beforeend', template(this._config))
  }

  init () {
    this.render()
    this.createObservable()
    this.addEventListenerInputs()
    return this
  }
}
