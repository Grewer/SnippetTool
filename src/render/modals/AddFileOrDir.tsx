import React, { useCallback } from 'react'
import BaseModal, { ModalTitle } from './BaseModal'
import Input from '~/form/Input'
import Button from '~/form/Button'
import Form from '~/form/Form'
import Radio from '~/form/Radio'
import setupLoading from '~/components/setupLoading'
import DB from '~/db/db'

// 摸态框表单,用来添加文件或文件夹

const Component = props => {
  // Form 使用 items 来创建比较好
  // props 用来传值
  const submit = useCallback(values => {
    console.log(values)
    // global.loading
    const loading = setupLoading('', 0)
    try {
      const baseDB = DB.getBaseDB()
      const fileList: Collection<any> = baseDB.getCollection('fileList')

      console.log(DB.getBaseDB())
      console.log(fileList)
      fileList.insert(values)
      baseDB.saveDatabase()
      loading.close()
    } catch (e) {
      console.log(e)
      loading.close()
    }
  }, [])

  return (
    <div className="modal-box">
      <ModalTitle title="添加全局文件/文件夹" onClose={props.onClose} />
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
