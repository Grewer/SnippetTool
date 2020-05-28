import React from 'react'
import ReactDOM from 'react-dom'
import './BaseModal.global.less'

const { body } = document

function BaseModal(Component, props?: any) {
  const showDom = document.createElement('div')
  showDom.classList.add('modal-container')
  body.appendChild(showDom)
  const clickHandle = ev => {
    const { target } = ev
    // console.dir(target)
    if (target.classList.contains('modal-container')) {
      close()
    }
  }

  showDom.addEventListener('click', clickHandle, {
    capture: false,
  })

  const close = () => {
    showDom.removeEventListener('click', clickHandle)
    ReactDOM.unmountComponentAtNode(showDom)
    body.removeChild(showDom)
  }
  ReactDOM.render(<Component onClose={close} {...props} />, showDom)
}

export default BaseModal
