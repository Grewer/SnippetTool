import React, { FC, memo, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { ModalTitle } from './BaseModal'
import Input from '~/form/Input'
import Button from '~/form/Button'
import Form from '~/form/Form'
import Radio from '~/form/Radio'
import setupLoading from '~/components/setupLoading'
import DBStore from '~/db/DBStore'

const { body } = document

// 摸态框表单,用来添加文件或文件夹

const inputCheck = { required: '请输入文件名' }
const radioCheck = { required: '请选择类型' }

interface IProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

const AddFileOrDir: FC<IProps> = memo(props => {
  console.log(props)
  const { setVisible, visible } = props
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
        await DBStore.addGlobalFile(values)
        setVisible(false)
      } catch (e) {
        console.log(e)
      } finally {
        loading.close()
      }
    },
    [setVisible]
  )
  return visible
    ? ReactDOM.createPortal(
        <div className="modal-container">
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
                // defaultValue="1" todo add
                name="fileType"
              />
              <Input name="fileName" check={inputCheck} placeholder="输入文件名称" />
              <Button>提交</Button>
            </Form>
          </div>
        </div>,
        body
      )
    : null
})
export default AddFileOrDir
