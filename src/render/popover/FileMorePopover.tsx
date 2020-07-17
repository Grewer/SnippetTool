import React from 'react'
import './popover.global.less'

const FileMorePopover = props => {
  return (
    <div className="popover-box">
      <i className="popover-arrow" />
      <ul className="popover-ul">
        <li>
          <i data-close="0" className="iconfont icon-shanchu" />
          <span data-close="0">删除</span>
        </li>
        <li>
          <i data-close="0" className="iconfont icon-yidongdaozu" />
          <span data-close="0">移动</span>
        </li>
        <li>
          <i data-close="0" className="iconfont icon-zhongmingming" />
          <span data-close="0">重命名</span>
        </li>
      </ul>
    </div>
  )
}

export default FileMorePopover
