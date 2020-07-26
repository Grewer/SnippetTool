import React from 'react'
import './BaseModal.global.less'

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
