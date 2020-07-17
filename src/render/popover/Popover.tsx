import ReactDOM from 'react-dom'
import React from 'react'
import createBodyElement from '~/utils/createBodyElement'

function BasePopover(Component, classKey: string, props?: any) {
  const { Dom } = createBodyElement(classKey)

  Dom.style.display = 'none'

  const show = ({ top = 0, left = 0 }) => {
    Dom.style.cssText = `
                          display:block;
                          transform:translate(${left - 55}px, ${top + 25}px);
                        `
  }

  document.addEventListener(
    'click',
    ev => {
      const ele = ev.target as HTMLElement
      if (ele.dataset.close === '0') {
        return
      }
      if (ele.classList.contains('icon-more')) {
        return
      }
      if (ele.className.includes('popover') || ele.parentElement?.className.includes('popover')) {
        return
      }
      Dom.style.display = 'none'
    },
    false
  )

  ReactDOM.render(<Component {...props} />, Dom)

  return show
}

export default BasePopover
