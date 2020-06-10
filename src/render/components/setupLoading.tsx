import React from 'react'
import ReactDOM from 'react-dom'
import Loading from '~/components/Loading'

const { body } = document

function setupLoading(msg, timeout = 1000) {
  const showDom = document.createElement('div')
  showDom.classList.add('api-global-loading')
  body.appendChild(showDom)

  const close = () => {
    ReactDOM.unmountComponentAtNode(showDom)
    body.removeChild(showDom)
  }

  timeout > 0 && setTimeout(close, timeout)

  ReactDOM.render(<Loading text={msg} />, showDom)

  return {
    close,
  }
}

export default setupLoading
