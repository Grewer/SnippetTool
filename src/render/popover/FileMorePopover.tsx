import React, { FC, memo, useCallback, useContext, useEffect, useRef } from 'react'
import './popover.global.less'
import ReactDOM from 'react-dom'
import BaseDBStore from '~/db/DBStore'
import RenameModal from '~/modals/RenameModal'
import FileListContext from '~/context/FileListContext'
import MoveModal from '~/modals/MoveModal'
import { IconShanchu, IconYidongdaozu, IconZhongmingming } from '~/components/iconfont'

const { body } = document

const FileMorePopover: FC = memo(props => {
  console.log('%c render FileMorePopover', 'background:yellow;', props)

  const { popover } = useContext(FileListContext)

  const { position, item, setPopover, direction } = popover

  const containerRef: React.MutableRefObject<any> = useRef()

  const deleteHandler = useCallback(async () => {
    try {
      await BaseDBStore.deleteFile(item)
      setPopover({
        position: '',
        item: {},
        setPopover,
      })
    } catch (e) {
      alert(e)
    }
  }, [item, setPopover])

  const moveHandler = useCallback(() => {
    MoveModal({ item }).open()
  }, [item])

  const renameHandler = useCallback(() => {
    RenameModal({ item }).open()
  }, [item])

  const triggerHandler = useCallback(
    e => {
      if (!position) {
        return
      }
      const ele = e.target
      if (containerRef.current?.contains(ele) || ele.dataset.more) {
        console.log('click inside')
      } else {
        console.log('click outside')
        setPopover({
          position: '',
          item: {},
          setPopover,
        })
      }
    },
    [position, setPopover]
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
          <i className={`popover-arrow-${direction}`} />
          <ul className="popover-ul">
            <li onClick={deleteHandler}>
              <IconShanchu data-close="0" />
              <span data-close="0">删除</span>
            </li>
            <li onClick={moveHandler}>
              <IconYidongdaozu data-close="0" />
              <span data-close="0">移动</span>
            </li>
            <li onClick={renameHandler}>
              <IconZhongmingming data-close="0" />
              <span data-close="0">重命名</span>
            </li>
          </ul>
        </div>,
        body
      )
    : null
})
export default FileMorePopover
