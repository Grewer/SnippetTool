import React, { useCallback, useContext, useEffect, useState } from 'react'
import BasePopover from '~/popover/Popover'
import FileMorePopover from '~/popover/FileMorePopover'
import styles from './FileLists.less'
import fetch from '~/utils'
import AddFileOrDir from '~/modals/AddFileOrDir'
import ConfigContext from '~/context/ConfigContext'
import IFileType from '~/enum/FileType'
import { IFileListItem } from '~/definition/Main'

/**
 * 类型分为文件和文件夹
 * @constructor
 */

function FileLists() {
  const { fileList, current, setCurrent } = useContext(ConfigContext)

  console.log('render FileLists', current)

  // useEffect(() => {
  //   setList([...Array(50)].map((v, k) => k + 1))
  // }, [])

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

  const btnClick = () => {
    fetch.config.withCredentials = true
    fetch.config.headers = {
      Authorization: 'token ',
    }
    fetch.get(`https://api.github.com/repos/Grewer/dataSave/contents/back.jpg`)

    fetch.put(`https://api.github.com/repos/Grewer/dataSave/contents/aa/test.txt`, {
      message: '使用 api 测试提交文件',
      content: btoa('test'),
      committer: {
        name: 'grewer',
        email: 'grewer@grewer.cn',
      },
    })
  }

  const iconClickHandle = useCallback(index => {
    // AddFileOrDir().open()
  }, [])

  const addFileOrDir = useCallback(() => {
    AddFileOrDir().open()
  }, [])

  const [popoverClick] = useState(() => {
    const show = BasePopover(FileMorePopover, 'popover-fileMore')
    return ev => {
      ev.stopPropagation()
      const distance = ev.target.getBoundingClientRect()
      show({
        top: distance.top,
        left: distance.left,
      })
    }
  })

  const currentId = current.id

  return (
    <div className={styles.fileList}>
      <Header />
      {/* <button onClick={btnClick}>click</button> */}
      <div>全局的搜索按钮34</div>
      <div className={styles.title}>
        文件夹列表
        <i onClick={() => addFileOrDir()} className="iconfont icon-jia" />
      </div>
      <ul>
        {fileList.map((item, index) => {
          const { id } = item
          const className = currentId === id ? `${styles.item} ${styles.active}` : styles.item
          return (
            <li onClick={() => fileClickHandle(item)} className={className} key={id}>
              <span className={styles.fileName}>
                {item.fileType === IFileType.folder && <i onClick={() => iconClickHandle(index)} className="iconfont icon-jiantou" />} {item.fileName}
              </span>
              <Control moreClick={popoverClick} fileType={item.fileType} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

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
