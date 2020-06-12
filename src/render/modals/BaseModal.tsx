import React from 'react'
import ReactDOM from 'react-dom'
import './BaseModal.global.less'

const { body } = document

function BaseModal(Component, props?: any) {
  const showDom = document.createElement('div')
  showDom.classList.add('modal-container')
  body.appendChild(showDom)

  const close = () => {
    ReactDOM.unmountComponentAtNode(showDom)
    body.removeChild(showDom)
  }
  ReactDOM.render(<Component close={close} {...props} />, showDom)
}

export const ModalTitle: React.FC<{
  title: string
  close: () => void
}> = React.memo(props => {
  return (
    <div className="modal-title">
      <span>{props.title}</span>
      <span className="modal-close-icon" onClick={props.close}>
        x
      </span>
    </div>
  )
})

export default BaseModal
