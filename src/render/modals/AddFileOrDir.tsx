import React, { useCallback } from 'react'
import BaseModal from './BaseModal'
import Input from '~/form/Input'
import Button from '~/form/Button'
import Form from '~/form/Form'
import Radio from '~/form/Radio'

// 摸态框表单,用来添加文件或文件夹

const Component = props => {
  // Form 使用 items 来创建比较好
  const submit = useCallback(values => {
    console.log(values)
  }, [])

  return (
    <div className="modal-box">
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

function AddFileOrDir() {
  const open = () => {
    BaseModal(Component)
  }

  return {
    open,
  }
}

export default AddFileOrDir
