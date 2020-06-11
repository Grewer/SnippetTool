import React from 'react'

const ConfigContext = React.createContext({
  loading: false,
  fileList: [] as {
    fileName: string
    fileType: '1' | '2'
  }[],
  config: {},
})
export default ConfigContext
