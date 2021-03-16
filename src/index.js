import './css/style'
import './js/customElements'
import Menu from './components/Menu'
import Main from './components/Main'
import Router from './components/Router'

const router = new Router().init()
new Menu(router).init()
new Main(router).init()
