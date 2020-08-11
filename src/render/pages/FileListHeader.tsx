import React, { memo, useCallback } from 'react'
import styles from '~/pages/FileLists.less'
import AddFileOrDir from '~/modals/AddFileOrDir'

const FileListHeader = memo(() => {
  const addFileOrDir = useCallback(() => {
    AddFileOrDir({
      global: true,
    }).open()
  }, [])
  return (
    <>
      <DragArea />
      <div>全局的搜索按钮34</div>
      <div className={styles.title}>
        文件夹列表
        <i onClick={() => addFileOrDir()} className="iconfont icon-jia" />
      </div>
    </>
  )
})

const DragArea = memo(() => <div className={styles.header}>{/* 这里是拖曳区域 */}</div>)

export default FileListHeader
