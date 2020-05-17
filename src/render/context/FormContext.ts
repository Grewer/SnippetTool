import React from 'react'

const FormContext = React.createContext({
  values: {},
  checkMsg: {},
  onChange: (value: any, name: string) => {},
})
export default FormContext
