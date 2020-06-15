import React from 'react'
import IFileType from '~/enum/FileType'

const ConfigContext = React.createContext({
  loading: false,
  fileList: [] as {
    fileName: string
    fileType: IFileType
  }[],
  config: {},
})
export default ConfigContext
