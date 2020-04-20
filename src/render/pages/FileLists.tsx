import React, { useCallback, useEffect, useState } from 'react'
import styles from './FileLists.less'

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

  return (
    <div className={styles.fileList}>
      <Header />
      <div>search</div>
      <ul>
        {list.map((item, index) => {
          const className = active === index ? `${styles.item} ${styles.active}` : styles.item
          return (
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
