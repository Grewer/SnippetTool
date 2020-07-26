import React, { useCallback, useContext, useEffect, useRef } from 'react'
import './popover.global.less'
import ReactDOM from 'react-dom'
import ConfigContext from '~/context/ConfigContext'

const { body } = document

const FileMorePopover = props => {
  console.log('%c render FileMorePopover', 'background:yellow;', props)

  const { position, item, setPopover } = props.popover

  const containerRef: React.MutableRefObject<any> = useRef()

  const deleteHandler = useCallback(() => {
    console.log(props)
  }, [props])
  const moveHandler = useCallback(() => {}, [])
  const renameHandler = useCallback(() => {}, [])

  const triggerHandler = useCallback(
    e => {
      const ele = e.target
      if (containerRef.current?.contains(ele) || ele.classList.contains('icon-more')) {
        console.log('click inside')
      } else {
        console.log('click outside')
        setPopover({
          position: ``,
          item: {},
          setPopover,
        })
      }
    },
    [setPopover]
  )

  useEffect(() => {
    document.addEventListener('click', triggerHandler)
    return () => {
      document.removeEventListener('click', triggerHandler)
    }
  }, [triggerHandler])

  return position
    ? ReactDOM.createPortal(
        <div
          ref={containerRef}
          className="popover-fileMore"
          style={{
            transform: `translate(${position})`,
          }}
        >
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
        </div>,
        body
      )
    : null
}

export default FileMorePopover