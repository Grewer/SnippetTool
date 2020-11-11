import React, { useCallback } from 'react'
import { createCommonModal, ModalTitle } from './BaseModal'
import Input from '~/form/Input'
import Button from '~/form/Button'
import Form from '~/form/Form'
import Radio from '~/form/Radio'
import setupLoading from '~/components/setupLoading'
import DBStore from '~/db/DBStore'
import IFileType from '~/enum/FileType'

// 摸态框表单,用来添加文件或文件夹

const inputCheck = { required: '请输入文件名' }
const radioCheck = { required: '请选择类型' }

const AddFileOrDir = createCommonModal(props => {
  console.log(props)
  const { close, global, item } = props

  // const { setVisible, visible } = props
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
        if (values.fileType === IFileType.file) {
          await DBStore.addFile(values, global ? null : item)
        } else {
          await DBStore.addFolder(values, global ? null : item)
        }
        close()
      } catch (e) {
        console.log(e)
      } finally {
        loading.close()
      }
    },
    [close, global, item]
  )
  return (
    <div className="modal-box">
      <ModalTitle title={`添加${global ? '全局' : ''}文件/文件夹`} close={close} />
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
          defaultValue="1"
          name="fileType"
        />
        <Input name="fileName" check={inputCheck} placeholder="输入文件名称" />
        <Button>提交</Button>
      </Form>
    </div>
  )
})

export default AddFileOrDir
