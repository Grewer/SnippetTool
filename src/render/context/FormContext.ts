import React from 'react'

const FormContext = React.createContext({
  values: {},
  checkMsg: {},
  onChange: (value: any, name: string, checkMsg: string) => {},
})
export default FormContext
