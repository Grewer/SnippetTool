import React, { useState } from 'react'
import styles from './FileLists.less'

function FileLists() {
  const [list, setList]: [any[], React.Dispatch<React.SetStateAction<any[]>>] = useState([] as any[])
  // useEffect(() => {
  //   setList([...Array(50)].map((v, k) => k + 1))
  // }, [])

  return (
    <div className={styles.fileList}>
      <div>search</div>
      <ul>
        {list.map((item, index) => {
          return <li key={index.toString()}>{item}</li>
        })}
      </ul>
    </div>
  )
}

export default FileLists
