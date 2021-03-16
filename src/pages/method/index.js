import sd from '../../js/sd'
import so from '../../js/so'
import { domInject } from '../../js/utils/decorators/decoratos'
import template from './template.html'

export default class Method {
  constructor (element = document.getElementById(process.env.ROOT_ELEMENT)) {
    this._root = element
    this._$obs_1 = so.observable(0)
    this._$computedInicial = so.computed(() => this._$obs_1.initialValue, [this._$obs_1])
    this._$computedPrev = so.computed(() => this._$obs_1.prevValue, [this._$obs_1])
    sd.property(
      this,
      {
        _button_1: domInject('#button_1'),
        _inicialValue: domInject('#inicialValue'),
        _prevValue: domInject('#prevValue')
      }
    )
    this._config = {
      title: 'Method',
      button_1: 'button_1'
    }
  }

  render () {
    this._root.insertAdjacentHTML('beforeend', template(this._config))
  }

  addEventListener () {
    this._button_1.addEventListener('click', () => {
      this._$obs_1(this._$obs_1() + 1)
    })
  }

  subscribeObservable () {
    this._$obs_1.subscribe(value => {
      this._button_1.textContent = `Valor atual: (${value})`
    })

    this._$computedInicial.subscribe(computedValue => {
      this._inicialValue.textContent = `Valor inicial: (${computedValue})`
    })

    this._$computedPrev.subscribe(computedValue => {
      this._prevValue.textContent = `Valor anterior: (${computedValue})`
    })
  }

  init () {
    this.render()
    this.addEventListener()
    this.subscribeObservable()
    return this
  }
}
