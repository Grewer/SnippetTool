import React, { useCallback, useEffect, useState } from 'react'
import styles from '~/pages/FileLists.less'

/**
 * 类型分为文件和文件夹
 * @constructor
 */
function FileLists() {
  const [list, setList]: [any[], React.Dispatch<React.SetStateAction<any[]>>] = useState([] as any[])
  const [active, setActive] = useState()

  useEffect(() => {
    setList([...Array(50)].map((v, k) => k + 1))
  }, [])

  const fileClickHandle = useCallback(index => {
    setActive(index)
  }, [])

  const btnClick = () => {
    // fetch.config.withCredentials = true
    // fetch.config.headers = {
    //   Authorization: 'token',
    // }
    // fetch.get(`https://api.github.com/repos/Grewer/dataSave/contents/back.jpg`)

    // fetch.put(`https://api.github.com/repos/Grewer/dataSave/contents/aa/test.txt`, {
    //   message: '使用 api 测试提交文件',
    //   content: btoa('test'),
    //   committer: {
    //     name: 'grewer',
    //     email: 'grewer@grewer.cn',
    //   },
    // })
  }

  return (
    <div className={styles.fileList}>
      <Header />
      <button onClick={btnClick}>click</button>
      <div>search</div>
      <ul>
        {list.map((item, index) => {
          const className = active === index ? `${styles.item} ${styles.active}` : styles.item
          return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li onClick={() => fileClickHandle(index)} className={className} key={index.toString()}>
              {item}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Header() {
  return <div className={styles.header}>{/* 这里是拖曳区域 */}</div>
}

export default FileLists
