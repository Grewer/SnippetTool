import React, { useCallback, useContext } from 'react'
import './popover.global.less'
import ConfigContext from '~/context/ConfigContext'

const FileMorePopover = props => {
  const { fileList, current, setCurrent } = useContext(ConfigContext)

  console.log('render FileMorePopover', current, props)
  const deleteHandler = useCallback(() => {
    console.log(current, props)
  }, [current, props])
  const moveHandler = useCallback(() => {}, [])
  const renameHandler = useCallback(() => {}, [])

  return (
    <div className="popover-box">
      <i className="popover-arrow" />
      <ul className="popover-ul">
        <li onClick={deleteHandler}>
          <i data-close="0" className="iconfont icon-shanchu" />
          <span data-close="0">删除</span>
        </li>
        <li onClick={moveHandler}>
          <i data-close="0" className="iconfont icon-yidongdaozu" />
          <span data-close="0">移动</span>
        </li>
        <li onClick={renameHandler}>
          <i data-close="0" className="iconfont icon-zhongmingming" />
          <span data-close="0">重命名</span>
        </li>
      </ul>
    </div>
  )
}

export default FileMorePopover
