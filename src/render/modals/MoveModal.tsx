import React from 'react'
import { createCommonModal, ModalTitle } from '~/modals/BaseModal'

const MoveModal = createCommonModal(props => {
  console.log(props)
  const { close, global, item } = props

  return (
    <div className="modal-box">
      <ModalTitle title={`添加${global ? '全局' : ''}文件/文件夹`} close={close} />
    </div>
  )
})

export default MoveModal
