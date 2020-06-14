import React from 'react'
import ReactDOM from 'react-dom'
import './BaseModal.global.less'
import createBodyElement from '~/utils/createBodyElement'

function BaseModal(Component, props?: any) {
  const { Dom, close } = createBodyElement('modal-container')

  ReactDOM.render(<Component close={close} {...props} />, Dom)
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
