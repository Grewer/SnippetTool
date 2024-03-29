import React, { FC, memo, useCallback, useContext, useMemo, useRef, useState } from 'react'
import FileMorePopover from '~/popover/FileMorePopover'
import styles from './FileLists.less'
import ConfigContext, { IConfigContext } from '~/context/ConfigContext'
import IFileType from '~/enum/FileType'
import { IFileListItem, IFileListItemFile, IFileListItemFolder } from '~/definition/Main'
import FileListHeader from '~/pages/FileListHeader'
import AddFileOrDir from '~/modals/AddFileOrDir'
import BaseDBStore from '~/db/DBStore'
import FileListContext from '~/context/FileListContext'
import { IconJia, IconJiantou, IconMore } from '~/components/iconfont'

/**
 * 类型分为文件和文件夹
 * @constructor clientHeight offsetHeight
 */
function FileLists() {
  console.log('%c render FileLists', 'background:yellow;')

  const [popover, setPopover]: [
    { item: IFileListItemFile; direction: string; setPopover: (value) => void; position: string },
    React.Dispatch<React.SetStateAction<{ item: IFileListItemFile; direction: string; setPopover: (value) => void; position: string }>>
  ] = useState({
    position: '',
    item: {} as IFileListItemFile,
    setPopover: value => {},
    direction: 'down', // down or up
  })

  const fileListRef: React.MutableRefObject<HTMLDivElement | undefined> = useRef()

  const popoverClick = useCallback((ev, item) => {
    ev.stopPropagation()
    const distance = ev.target.getBoundingClientRect()

    console.log('[popover click]', distance, fileListRef.current?.clientHeight, fileListRef.current?.offsetHeight)

    const check = (fileListRef.current?.clientHeight ?? 0) > distance.bottom + 127

    console.log('是否可以显示在下面', check)

    let position = ''
    if (check) {
      position = `${distance.left - 55}px, ${distance.top + 25}px`
    } else {
      position = `${distance.left - 55}px, ${distance.top - 102}px`
    }

    setPopover(prevState => {
      if (prevState.item === item) {
        return prevState
      }
      return {
        position,
        item,
        direction: check ? 'down' : 'up',
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
      <div ref={fileListRef as any} className={styles.fileList}>
        <FileListHeader />
        <FileListBox />
        <FileMorePopover />
      </div>
    </FileListContext.Provider>
  )
}

function Control(props: { item: IFileListItem; fileType: IFileType; addLocalFolder: (item: IFileListItem) => void }) {
  // hover显示

  const { popoverClick } = useContext(FileListContext)
  const { item } = props
  return (
    <span className={styles.control}>
      <IconMore color="#656262" data-more="1" onClick={ev => popoverClick(ev, item)} />
      {props.fileType === IFileType.folder && <IconJia color="#656262" onClick={() => props.addLocalFolder(item)} />}
    </span>
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
  fileList: IConfigContext['fileList']
  currentId: string
  fileClickHandle: (item: IFileListItem) => void
  iconClickHandle: (item: IFileListItemFolder) => void
  addLocalFolder: (item: IFileListItem) => void
}

const ListView = (props: IListView) => {
  const { level, fileList, currentId, fileClickHandle, iconClickHandle, addLocalFolder } = props
  return (
    <ul>
      {fileList.map(item => {
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
                  <IconJiantou onClick={() => iconClickHandle(item)} className={item.visible ? styles.rotate : ''} />
                )}
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

export default React.memo(FileLists)
