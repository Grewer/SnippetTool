import React, { FC, memo, useCallback, useContext, useState } from 'react'
import FileMorePopover from '~/popover/FileMorePopover'
import styles from './FileLists.less'
import ConfigContext from '~/context/ConfigContext'
import IFileType from '~/enum/FileType'
import { IFileListItem, IFileListItemFile } from '~/definition/Main'
import FileListHeader from '~/pages/FileListHeader'
import AddFileOrDir from '~/modals/AddFileOrDir'

/**
 * 类型分为文件和文件夹
 * @constructor
 */

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

  return (
    <div className={styles.fileList}>
      <FileListHeader />
      <FileListView popoverClick={popoverClick} />
      <FileMorePopover popover={popover} />
    </div>
  )
}

const FileListView: FC<{ popoverClick: (ev, item) => void }> = memo(props => {
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

  const iconClickHandle = useCallback(index => {
    // AddFileOrDir().open()
  }, [])

  const addLocalFolder = useCallback(item => {
    AddFileOrDir({
      global: false,
      item,
    }).open()
  }, [])

  return (
    <ul>
      {fileList.map((item, index) => {
        const { id } = item
        const className = currentId === id ? `${styles.item} ${styles.active}` : styles.item
        return (
          <li onClick={() => fileClickHandle(item)} className={className} key={id}>
            <span className={styles.fileName}>
              {item.fileType === IFileType.folder && <i onClick={() => iconClickHandle(index)} className="iconfont icon-jiantou" />} {item.fileName}
            </span>
            <Control item={item} addLocalFolder={addLocalFolder} moreClick={props.popoverClick} fileType={item.fileType} />
          </li>
        )
      })}
    </ul>
  )
})

function Control(props: {
  item: IFileListItem
  fileType: IFileType
  moreClick: (event: React.MouseEvent, item: IFileListItem) => void
  addLocalFolder: (item: IFileListItem) => void
}) {
  // hover显示
  const { item } = props
  return (
    <span className={styles.control}>
      <i className="iconfont icon-more" onClick={ev => props.moreClick(ev, item)} />
      {props.fileType === IFileType.folder && <i onClick={() => props.addLocalFolder(item)} className="iconfont icon-jia" />}
    </span>
  )
}

export default React.memo(FileLists)
