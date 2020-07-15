import ReactDOM from 'react-dom'
import React from 'react'
import createBodyElement from '~/utils/createBodyElement'

function BasePopover(Component, classKey: string, props?: any) {
  const { Dom } = createBodyElement(classKey)

  const show = ({ top = 0, left = 0 }) => {
    Dom.style.cssText = `
                          position:absolute;
                          display:block;
                          top:${top + 16}px;
                          left:${left + 8}px
                        `
  }

  document.addEventListener('click', () => {
    // todo 修改
    Dom.style.display = 'none'
  })

  ReactDOM.render(<Component {...props} />, Dom)

  return show
}

export default BasePopover
