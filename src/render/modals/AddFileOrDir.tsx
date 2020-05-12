import React from 'react'
import BaseModal from './BaseModal'

// 摸态框表单,用来添加文件或文件夹

const Component = props => {
  return <div className="modal-box">123</div>
}

function AddFileOrDir() {
  const open = () => {
    BaseModal(Component)
  }

  return {
    open,
  }
}

export default AddFileOrDir
