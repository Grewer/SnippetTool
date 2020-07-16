import React, { useCallback, useContext } from 'react'
import FormContext from '~/context/FormContext'
import ErrorTip from '~/form/ErrorTip'

const WrapFormContext = props => {
  const { children, name, check, ...rest } = props
  const { values, onChange, checkMsg } = useContext(FormContext)
  // console.log('[WrapFormContext]', props, values)

  const _onChange = useCallback(
    value => {
      let msg = ''
      if (check?.required) {
        if (value === undefined || value === null || value === '') {
          msg = '请输入此字段'
        }
      }
      onChange(value, name, msg)
    },
    [check, onChange, name]
  )

  const value = {
    name,
    value: values[name] || '',
    onChange: _onChange,
    checkMsg: checkMsg[name] || '',
  }

  return (
    <ErrorTip {...rest} {...value}>
      {children}
    </ErrorTip>
  )
}

//  React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.
const FormFactory = React.createFactory(WrapFormContext)

export default FormFactory
