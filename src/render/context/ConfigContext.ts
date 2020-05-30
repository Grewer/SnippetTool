import React from 'react'

const ConfigContext = React.createContext({
  loading: false,
  fileList: [],
  config: {},
})
export default ConfigContext
