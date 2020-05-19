import React, { ReactElement, useCallback, useContext, useReducer } from 'react'
import styles from './Form.less'
import FormContext from '~/context/FormContext'

function WrapFormContext(props) {
  const { children, name, ...rest } = props
  const { values, onChange } = useContext(FormContext)
  console.log('WrapFormContext', props, values)

  const _onChange = ev => {
    console.log('run _onChange', ev, ev.target, ev.target.value)
    onChange(ev.target.value, name)
  }
  return React.createElement(children, Object.assign(rest, { value: values[name], onChange: _onChange }))
}

const factory = React.createFactory(WrapFormContext)

function Reducers(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setValue':
      console.log('run setValue', action, state)
      state.values = Object.assign(state.values, payload)
      return state
    default:
      return state
  }
}

interface IForm<T = any> {
  submit(values: T): any

  children: ReactElement[]
}

function Form(props: IForm) {
  const { children, submit } = props

  const [value, dispatch] = useReducer(Reducers, {
    values: {},
    checkMsg: {},
    onChange: (val, name) => {
      dispatch({
        type: 'setValue',
        payload: {
          [name]: val,
        },
      })
    },
  })

  console.log('render Form')

  const _submit = useCallback(
    ev => {
      ev.preventDefault()
      submit(value.values)
    },
    [submit, value.values]
  )

  return (
    <FormContext.Provider value={value}>
      <form onSubmit={_submit} className={styles.form}>
        {React.Children.map(children, child => {
          console.log(child)
          // @ts-ignore
          if (child.type.button) {
            return child
          }
          return factory(child.props, child.type)
        })}
      </form>
    </FormContext.Provider>
  )
}

export default Form
