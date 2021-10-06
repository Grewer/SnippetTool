import React, { useMemo, useState } from 'react'
import { createCommonModal, ModalTitle } from '~/modals/BaseModal'
import FileType from '~/enum/FileType'
import useMount from '~/hooks/useMount'
import BaseDBStore from '~/db/DBStore'
import styles from './moveModal.less'
import { IFileListItem } from '~/definition/Main'

const MoveModal = createCommonModal(props => {
  console.log(props)
  const { close, global, item } = props

  const [trees, setTree] = useState<IFileListItem[]>([])

  const typeName = useMemo(() => {
    const fileTypeName = item.fileType === FileType.file ? '文件' : '文件夹'
    return {
      fileTypeName,
    }
  }, [item.fileType])

  useMount(async () => {
    const rootTree = await BaseDBStore.getDBTree()
    console.log('rootTree', rootTree?.data())
    setTree(rootTree?.data() ?? [])
  })

  // 样式 TODO
  return (
    <div className="modal-box">
      <ModalTitle title={`移动${typeName.fileTypeName}`} close={close} />
      <div className={styles.container}>
        <div className={styles.current}>
          当前选中{typeName.fileTypeName}: {item.fileName}
        </div>
        <ul>
          {trees.map(tree => {
            return (
              <li key={tree.id}>
                check {tree.fileType === FileType.folder && <span>⏬</span>} {tree.fileName}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
})

export default MoveModal
