import React, { memo } from 'react'
import styles from '~/pages/FileLists.less'
import AddFileOrDir from '~/modals/AddFileOrDir'
import { IconJia } from '~/components/iconfont'

const addFileOrDir = () => {
  AddFileOrDir({
    global: true,
  }).open()
}

const FileListHeader = memo(() => {
  return (
    <>
      <DragArea />
      <div>全局的搜索按钮34</div>
      <div className={styles.title}>
        文件夹列表
        <IconJia color="#C7C6C2" onClick={addFileOrDir} />
      </div>
    </>
  )
})

const DragArea = memo(() => <div className={styles.header}>{/* 这里是拖曳区域 */}</div>)

export default FileListHeader
