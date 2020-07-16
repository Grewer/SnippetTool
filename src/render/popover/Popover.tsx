import ReactDOM from 'react-dom'
import React from 'react'
import createBodyElement from '~/utils/createBodyElement'

function BasePopover(Component, classKey: string, props?: any) {
  const { Dom } = createBodyElement(classKey)

  Dom.style.display = 'none'

  const show = ({ top = 0, left = 0 }) => {
    Dom.style.cssText = `
                          display:block;
                          transform:translate(${left - 45}px, ${top + 25}px);
                        `
  }

  document.addEventListener('click', ev => {
    const ele = ev.target as HTMLElement
    if (ele.classList.contains('icon-more')) {
      return
    }
    if (ele.className.includes('popover')) {
      return
    }
    Dom.style.display = 'none'
  })

  ReactDOM.render(<Component {...props} />, Dom)

  return show
}

export default BasePopover
