export default (path) =>
  window.history.pushState({}, document.title, `${window.location.origin}/${path}`)
