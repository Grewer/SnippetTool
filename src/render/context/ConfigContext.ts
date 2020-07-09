import React from 'react'
import { IFileListItem } from '~/definition/Main'

const ConfigContext = React.createContext({
  loading: false,
  fileList: [] as IFileListItem[],
  config: {},
  setCurrent: (current: IFileListItem) => {},
  current: {} as IFileListItem,
})
export default ConfigContext
