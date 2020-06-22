import React, { useCallback } from 'react'
import BaseModal, { ModalTitle } from './BaseModal'
import Input from '~/form/Input'
import Button from '~/form/Button'
import Form from '~/form/Form'
import Radio from '~/form/Radio'
import setupLoading from '~/components/setupLoading'
import DBStore from '~/db/DBStore'

// 摸态框表单,用来添加文件或文件夹

const inputCheck = { required: '请输入文件名' }
const radioCheck = { required: '请选择类型' }

const Component = props => {
  console.log(props)
  const { close } = props
  // Form 使用 items 来创建比较好
  // props 用来传值

  const submit = useCallback(
    async (values, error) => {
      if (error) {
        console.error(`submit Error${error}`)
        return
      }
      console.log(values)
      // global.loading
      const loading = setupLoading('', 0)
      try {
        // todo 判断文件还是文件夹
        await DBStore.addFile(values)
        close()
        loading.close()
        // todo message
      } catch (e) {
        console.log(e)
        loading.close()
      }
    },
    [close]
  )
  return (
    <div className="modal-box">
      <ModalTitle title="添加全局文件/文件夹" close={close} />
      <Form submit={submit}>
        <Radio
          check={radioCheck}
          options={[
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
        <Input name="fileName" check={inputCheck} placeholder="输入文件名称" />
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
