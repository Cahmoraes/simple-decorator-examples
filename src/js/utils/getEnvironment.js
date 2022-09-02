export default () =>
  process.env.NODE_ENV === 'development'
    ? ''
    : `/${process.env.PRODUCTION_PATH}`
