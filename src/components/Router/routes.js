import getEnvironment from '../../js/utils/getEnvironment'

export default [
  {
    path: getEnvironment() || '/',
    component: 'method',
    options: {
      title: 'Method',
    },
  },
  {
    path: `${getEnvironment()}/method`,
    component: 'method',
    options: {
      title: 'Method',
    },
  },
  {
    path: `${getEnvironment()}/property`,
    component: 'property',
    options: {
      title: 'Property',
    },
  },
  {
    path: '*',
    component: 'notfound',
    options: {
      title: 'Página não encontrada',
    },
  },
]
