import ReactDOM from 'react-dom'
import React from 'react'
import createBodyElement from '~/utils/createBodyElement'

function BasePopover(Component, classKey: string, props?: any) {
  let Dom = document.querySelector('.popover-fileMore') as any
  if (Dom) {
    console.log(Dom)
    const show = ({ top = 0, left = 0 }) => {
      Dom.style.cssText = `
                          display:block;
                          transform:translate(${left - 55}px, ${top + 25}px);
                        `
    }

    // todo 使用 ReactDOM.createPortal 改造
    ReactDOM.render(<Component {...props} />, Dom)
    return show
  }

  const { Dom: _Dom } = createBodyElement(classKey)

  Dom = _Dom

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
  // 此方案传参困难 仍旧使用原来 的方案
  return show
}

export default BasePopover
