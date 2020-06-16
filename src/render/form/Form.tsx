import React, { FunctionComponent, ReactElement, useCallback, useContext, useReducer } from 'react'
import styles from './Form.less'
import FormContext from '~/context/FormContext'

const WrapFormContext = props => {
  const { children, name, check, ...rest } = props
  const { values, onChange, checkMsg } = useContext(FormContext)
  console.log('[WrapFormContext]', props, values)

  const _onChange = useCallback(
    value => {
      let msg = ''
      if (check.required && (value === undefined || value === null || value === '')) {
        msg = '请输入此字段'
      }
      onChange(value, name, msg)
    },
    [name, onChange, check]
  )

  const value = {
    name,
    value: values[name] || '',
    onChange: _onChange,
    checkMsg: checkMsg[name] || '',
  }

  return (
    <PreventRender {...rest} {...value}>
      {children}
    </PreventRender>
  )
}

const PreventRender: React.FC<{ children: React.FunctionComponent<any> }> = React.memo(props => {
  const { children, ...rest } = props
  // console.log('[PreventRender]', props)
  return React.createElement(children, rest)
})

const factory = React.createFactory(WrapFormContext)

function Reducers(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setValue':
      console.log('run setValue', action, state)
      if (payload.checkMsg) {
        state.checkMsg = Object.assign(state.checkMsg, { [payload.name]: payload.checkMsg })
      }
      state.values = Object.assign(state.values, { [payload.name]: payload.val })
      return { ...state }
    default:
      return state
  }
}

interface IForm<T = any> {
  submit(values: T, error: boolean | string): any

  children: ReactElement[]
}

function Form(props: IForm) {
  const { children, submit } = props

  const [value, dispatch] = useReducer(Reducers, {
    values: {},
    checkMsg: {},
    onChange: (val, name, checkMsg) => {
      dispatch({
        type: 'setValue',
        payload: {
          name,
          val,
          checkMsg,
        },
      })
    },
  })

  console.log('render Form')

  const _submit = useCallback(
    ev => {
      ev.preventDefault()
      let error = false
      const errorArray = Object.keys(value.checkMsg)
      if (errorArray.length) {
        error = value.checkMsg[errorArray[0]]
      }
      // todo check 一遍
      submit(value.values, error)
    },
    [submit, value.checkMsg, value.values]
  )

  return (
    <FormContext.Provider value={value}>
      <form onSubmit={_submit} className={styles.form}>
        {React.Children.map(children, element => {
          // console.log(child)
          // @ts-ignore
          if (element.type.button) {
            return element
          }
          return factory(element.props, element.type)
        })}
      </form>
    </FormContext.Provider>
  )
}

export default Form
