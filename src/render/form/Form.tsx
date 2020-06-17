import React, { FunctionComponent, ReactElement, useCallback, useContext, useReducer } from 'react'
import styles from './Form.less'
import FormContext from '~/context/FormContext'

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
      if (payload.checkMsg || state.checkMsg[payload.name]) {
        state.checkMsg = Object.assign(state.checkMsg, { [payload.name]: payload.checkMsg })
      }
      state.values = Object.assign(state.values, { [payload.name]: payload.val })
      return { ...state }

    case 'setError':
      state.checkMsg = Object.assign(state.checkMsg, { [payload.name]: payload.checkMsg })
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

  console.log('render Form', value)

  const _submit = useCallback(
    ev => {
      ev.preventDefault()
      let error = false
      React.Children.forEach(children, child => {
        const { check, name } = child.props
        if (check) {
          if (check.required && !value.values[name]) {
            error = true
            dispatch({
              type: 'setError',
              payload: {
                name,
                checkMsg: check.required,
              },
            })
          }
        }
      })
      if (error) {
        return
      }
      submit(value.values, error)
    },
    [children, submit, value.values]
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
