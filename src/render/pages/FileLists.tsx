import React, { FC, memo, useCallback, useContext, useMemo, useState } from 'react'
import FileMorePopover from '~/popover/FileMorePopover'
import styles from './FileLists.less'
import ConfigContext, { IConfigContext } from '~/context/ConfigContext'
import IFileType from '~/enum/FileType'
import { IFileListItem, IFileListItemFile, IFileListItemFolder } from '~/definition/Main'
import FileListHeader from '~/pages/FileListHeader'
import AddFileOrDir from '~/modals/AddFileOrDir'
import BaseDBStore from '~/db/DBStore'
import FileListContext from '~/context/FileListContext'

/**
 * 类型分为文件和文件夹
 * @constructor
 */
// todo use context
function FileLists() {
  console.log('%c render FileLists', 'background:yellow;')

  const [popover, setPopover]: [
    { item: IFileListItemFile; setPopover: (value) => void; position: string },
    React.Dispatch<React.SetStateAction<{ item: IFileListItemFile; setPopover: (value) => void; position: string }>>
  ] = useState({
    position: '',
    item: {} as IFileListItemFile,
    setPopover: value => {},
  })

  const popoverClick = useCallback((ev, item) => {
    ev.stopPropagation()
    const distance = ev.target.getBoundingClientRect()

    setPopover(prevState => {
      if (prevState.item === item) {
        return prevState
      }
      return {
        position: `${distance.left - 55}px, ${distance.top + 25}px`,
        item,
        setPopover,
      }
    })
  }, [])

  const contextValue = useMemo(() => {
    return {
      popoverClick,
      popover,
    }
  }, [popover, popoverClick])

  return (
    <FileListContext.Provider value={contextValue}>
      <div className={styles.fileList}>
        <FileListHeader />
        <FileListBox />
        <FileMorePopover />
      </div>
    </FileListContext.Provider>
  )
}

const FileListBox: FC = memo(props => {
  console.log('%c render FileListView', 'background:yellow;')

  const { fileList, current, setCurrent } = useContext(ConfigContext)
  const currentId = current.id

  const fileClickHandle = useCallback(
    (item: IFileListItem) => {
      if (current.id === item.id) {
        return
      }
      // setActive(index)
      if (item.fileType === IFileType.file) {
        setCurrent(item)
      }
    },
    [setCurrent, current]
  )

  const iconClickHandle = useCallback(async (item: IFileListItemFolder) => {
    if (!item.load && !item.visible) {
      await BaseDBStore.loadChildFile(item)
      return
    }

    await BaseDBStore.toggleVisible(item, !item.visible)

    // loading
  }, [])

  const addLocalFolder = useCallback((item: IFileListItem) => {
    AddFileOrDir({
      global: false,
      item,
    }).open()
  }, [])

  const params = { fileList, currentId, fileClickHandle, iconClickHandle, addLocalFolder }

  return <ListView {...params} level={1} />
})

interface IListView {
  level: number
  fileList?: IConfigContext['fileList']
  currentId: string
  fileClickHandle
  iconClickHandle
  addLocalFolder
}

const ListView = (props: IListView) => {
  // todo 添加类型
  const { level, fileList, currentId, fileClickHandle, iconClickHandle, addLocalFolder } = props
  return (
    <ul>
      {fileList?.map(item => {
        const { id } = item
        const className = currentId === id ? `${styles.item} ${styles.active}` : styles.item
        return (
          <li key={id}>
            <div
              onClick={() => fileClickHandle(item)}
              style={{
                paddingLeft: `${12 * level}px`,
              }}
              className={className}
            >
              <span className={styles.fileName}>
                {item.fileType === IFileType.folder && (
                  <i onClick={() => iconClickHandle(item)} className={`iconfont icon-jiantou ${item.visible ? styles.rotate : ''}`} />
                )}{' '}
                {item.fileName}
              </span>
              <Control item={item} addLocalFolder={addLocalFolder} fileType={item.fileType} />
            </div>
            {item.fileType === IFileType.folder && item.visible && <ListView key={level + 1} {...props} level={level + 1} fileList={item.children} />}
          </li>
        )
      })}
    </ul>
  )
}

function Control(props: { item: IFileListItem; fileType: IFileType; addLocalFolder: (item: IFileListItem) => void }) {
  // hover显示

  const { popoverClick } = useContext(FileListContext)
  const { item } = props
  return (
    <span className={styles.control}>
      <i className="iconfont icon-more" onClick={ev => popoverClick(ev, item)} />
      {props.fileType === IFileType.folder && <i onClick={() => props.addLocalFolder(item)} className="iconfont icon-jia" />}
    </span>
  )
}

export default React.memo(FileLists)
