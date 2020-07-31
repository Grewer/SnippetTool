import React, { ReactElement, useCallback, useReducer } from 'react'
import styles from './Form.less'
import FormContext from '~/context/FormContext'
import FormFactory from '~/form/FormFactory'

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

  console.log('%c render Form', 'background:yellow;', value)

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
          if (element.type.button || !element.props.name) {
            return element
          }
          return FormFactory(element.props, element.type)
        })}
      </form>
    </FormContext.Provider>
  )
}

export default Form
