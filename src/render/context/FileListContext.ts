import React from 'react'
import { IFileListItem, IFileListItemFile } from '~/definition/Main'

export type IFileListContext = {
  popover: {
    position: string
    item: IFileListItemFile
    setPopover: (value) => void
  }
  popoverClick: (event: React.MouseEvent, item: IFileListItem) => void
}

const FileListContext = React.createContext<IFileListContext>({
  popover: {
    position: '',
    item: {} as any,
    setPopover: value => {},
  },
  popoverClick: (ev, item) => {},
})

export default FileListContext
