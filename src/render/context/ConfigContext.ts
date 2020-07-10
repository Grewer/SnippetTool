import React from 'react'
import { IFileListItem, IFileListItemFile } from '~/definition/Main'

const ConfigContext = React.createContext({
  loading: false,
  fileList: [] as IFileListItem[],
  config: {},
  setCurrent: (current: IFileListItemFile) => {},
  current: {} as IFileListItemFile,
})
export default ConfigContext
