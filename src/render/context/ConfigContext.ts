import React from 'react'
import { IFileListItem, IFileListItemFile } from '~/definition/Main'

export interface IConfigContext {
  loading: boolean
  fileList: IFileListItem[]
  config: {}
  setCurrent: (current: IFileListItemFile) => void
  current: IFileListItemFile
}

const ConfigContext = React.createContext<IConfigContext>({
  loading: false,
  fileList: [] as IFileListItem[],
  config: {},
  setCurrent: (current: IFileListItemFile) => {},
  current: {} as IFileListItemFile,
})
export default ConfigContext
