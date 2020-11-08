import React, { useCallback } from 'react'
import BaseModal, { ModalTitle } from './BaseModal'
import Input from '~/form/Input'
import Button from '~/form/Button'
import Form from '~/form/Form'
import setupLoading from '~/components/setupLoading'
import BaseDBStore from '~/db/DBStore'

// 摸态框表单,用来添加文件或文件夹

const inputCheck = { required: '请输入文件名' }

const Component = props => {
  console.log(props)
  const { close, item } = props

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
        await BaseDBStore.rename(item, values)
        close()
      } catch (e) {
        console.log(e)
      } finally {
        loading.close()
      }
    },
    [close, item]
  )

  const { fileName } = item

  return (
    <div className="modal-box">
      <ModalTitle title="修改文件名" close={close} />
      <Form submit={submit}>
        <div className="modal-item">原名称: {fileName}</div>
        <Input defaultValue={fileName} name="fileName" check={inputCheck} placeholder="输入文件名称" />
        <Button>提交</Button>
      </Form>
    </div>
  )
}

function RenameModal(props = {}) {
  const open = () => {
    BaseModal(Component, props)
  }

  return {
    open,
  }
}

export default RenameModal
