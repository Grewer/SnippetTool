import React from 'react'
import ReactDOM from 'react-dom'
import Loading from '~/components/Loading'
import createBodyElement from '~/utils/createBodyElement'

function setupLoading(msg, timeout = 1000) {
  const { Dom, close } = createBodyElement('api-global-loading')

  timeout > 0 && setTimeout(close, timeout)

  ReactDOM.render(<Loading text={msg} />, Dom)

  return {
    close,
  }
}

export default setupLoading
