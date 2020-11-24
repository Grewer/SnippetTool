import React, { useMemo } from 'react'
import { createCommonModal, ModalTitle } from '~/modals/BaseModal'
import IFileType from '~/enum/FileType'
import useMount from '~/hooks/useMount'
import BaseDBStore from '~/db/DBStore'

const MoveModal = createCommonModal(props => {
  console.log(props)
  const { close, global, item } = props

  const typeName = useMemo(() => {
    const fileTypeName = item.fileType === IFileType.file ? '文件' : '文件夹'
    return {
      fileTypeName,
    }
  }, [item.fileType])

  useMount(async () => {
    const rootTree = await BaseDBStore.getDBTree()
    console.log(rootTree?.data())
  })

  return (
    <div className="modal-box">
      <ModalTitle title={`移动${typeName.fileTypeName}`} close={close} />
      <div>
        当前选中{typeName.fileTypeName}: {item.fileName}
      </div>
      {/* // 当前选择的文件: */}
      {/* // 一棵树 */}
    </div>
  )
})

export default MoveModal
