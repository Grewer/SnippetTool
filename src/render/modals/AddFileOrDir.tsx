import React, { useCallback } from 'react'
import BaseModal from './BaseModal'
import Input from '~/form/Input'
import Button from '~/form/Button'
import Form from '~/form/Form'
import Radio from '~/form/Radio'

// 摸态框表单,用来添加文件或文件夹

const Component = props => {
  // Form 使用 items 来创建比较好
  // props 用来传值
  const submit = useCallback(values => {
    console.log(values)
  }, [])

  return (
    <div className="modal-box">
      <div className="modal-title">添加全局文件/文件夹</div>
      <Form submit={submit}>
        <Radio
          data={[
            {
              id: '1',
              name: '文件',
            },
            {
              id: '2',
              name: '文件夹',
            },
          ]}
          name="fileType"
        />
        <Input name="fileName" placeholder="输入文件名称" />
        <Button>提交</Button>
      </Form>
    </div>
  )
}

function AddFileOrDir(props = {}) {
  const open = () => {
    BaseModal(Component, props)
  }

  return {
    open,
  }
}

export default AddFileOrDir
