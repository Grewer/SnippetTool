import ReactDOM from 'react-dom'
import React from 'react'
import createBodyElement from '~/utils/createBodyElement'

function BasePopover(Component, classKey: string, props?: any) {
  const { Dom } = createBodyElement(classKey)

  const show = () => {
    Dom.style.display = 'block'
  }

  document.addEventListener('click', () => {
    Dom.style.display = 'none'
  })

  ReactDOM.render(<Component {...props} />, Dom)

  return show
}

export default BasePopover
