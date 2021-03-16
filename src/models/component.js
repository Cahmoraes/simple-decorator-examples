export default class Component {
  constructor (element) {
    this._element = element
  }

  init () {
    throw new Error('Init deve ser implementado')
  }
}
