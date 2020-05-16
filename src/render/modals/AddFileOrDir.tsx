import React from 'react'
import BaseModal from './BaseModal'
import Input from '~/form/Input'
import Button from '~/form/Button'
import Form from '~/form/Form'

// 摸态框表单,用来添加文件或文件夹

const Component = props => {
  // Form 使用 items 来创建比较好
  return (
    <div className="modal-box">
      <Form>
        <Input name="fileName" placeholder="输入文件名称" />
        <Button />
      </Form>
    </div>
  )
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
