import React, { FC, memo, useCallback, useContext, useState } from 'react'
import BasePopover from '~/popover/Popover'
import FileMorePopover from '~/popover/FileMorePopover'
import styles from './FileLists.less'
import AddFileOrDir from '~/modals/AddFileOrDir'
import ConfigContext from '~/context/ConfigContext'
import IFileType from '~/enum/FileType'
import { IFileListItem } from '~/definition/Main'

/**
 * 类型分为文件和文件夹
 * @constructor
 */

function FileLists() {
  console.log('%c render FileLists', 'background:yellow;')

  const addFileOrDir = useCallback(() => {
    AddFileOrDir().open()
  }, [])

  const [popover, setPopover] = useState({ position: '', item: {}, setPopover: value => {} })

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
      <Header />
      {/* <button onClick={btnClick}>click</button> */}
      <div>全局的搜索按钮34</div>
      <div className={styles.title}>
        文件夹列表
        <i onClick={() => addFileOrDir()} className="iconfont icon-jia" />
      </div>
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
            <Control moreClick={ev => props.popoverClick(ev, item)} fileType={item.fileType} />
          </li>
        )
      })}
    </ul>
  )
})

function Control(props: { fileType: IFileType; moreClick: (event: React.MouseEvent) => void }) {
  const Add = () => {
    AddFileOrDir().open()
  }

  // hover显示
  return (
    <span className={styles.control}>
      <i className="iconfont icon-more" onClick={props.moreClick} />
      {props.fileType === IFileType.folder && <i className="iconfont icon-jia" />}
    </span>
  )
}

function Header() {
  return <div className={styles.header}>{/* 这里是拖曳区域 */}</div>
}

export default React.memo(FileLists)
