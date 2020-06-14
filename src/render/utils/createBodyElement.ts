import ReactDOM from 'react-dom'

const { body } = document

const createBodyElement = className => {
  const showDom = document.createElement('div')
  showDom.classList.add(className)
  body.appendChild(showDom)

  const close = () => {
    ReactDOM.unmountComponentAtNode(showDom)
    body.removeChild(showDom)
  }

  return {
    Dom: showDom,
    close,
  }
}

export default createBodyElement
