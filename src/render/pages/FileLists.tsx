import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './FileLists.less'
import fetch from '~/utils'
import AddFileOrDir from '~/modals/AddFileOrDir'
import ConfigContext from '~/context/ConfigContext'

/**
 * 类型分为文件和文件夹
 * @constructor
 */
function FileLists() {
  const { fileList } = useContext(ConfigContext)

  const [active, setActive] = useState()

  // useEffect(() => {
  //   setList([...Array(50)].map((v, k) => k + 1))
  // }, [])

  const fileClickHandle = useCallback(index => {
    setActive(index)
  }, [])

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

  return (
    <div className={styles.fileList}>
      <Header />
      {/* <button onClick={btnClick}>click</button> */}
      <div>全局的搜索按钮34</div>
      <div className={styles.title}>
        文件夹列表
        <i onClick={addFileOrDir} className="iconfont icon-jia" />
      </div>
      <ul>
        {fileList.map((item, index) => {
          const className = active === index ? `${styles.item} ${styles.active}` : styles.item
          return (
            <li onClick={() => fileClickHandle(index)} className={className} key={index.toString()}>
              <span className={styles.fileName}>
                <i onClick={() => iconClickHandle(index)} className="iconfont icon-jiantou" />
                {item}
              </span>
              <Control />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Control(props) {
  const Add = () => {
    AddFileOrDir().open()
  }

  // hover显示
  return (
    <span className={styles.control}>
      <i className="iconfont icon-more" />
      <i className="iconfont icon-jia" />
    </span>
  )
}

function Header() {
  return <div className={styles.header}>{/* 这里是拖曳区域 */}</div>
}

export default FileLists
