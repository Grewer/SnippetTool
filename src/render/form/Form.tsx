import React, { ReactElement, useCallback, useContext, useReducer } from 'react'
import styles from './Form.less'
import FormContext from '~/context/FormContext'

const WrapFormContext = props => {
  const { children, name, ...rest } = props
  const { values, onChange } = useContext(FormContext)
  console.log('[WrapFormContext]', props, values)

  const _onChange = useCallback(
    value => {
      // console.log('run _onChange', ev, ev.target, ev.target.value)
      onChange(value, name)
    },
    [name, onChange]
  )

  const value = {
    ...rest,

    name,
    value: values[name],
    onChange: _onChange,
  }

  return <WrapRender {...value}>{children}</WrapRender>
  // return React.createElement(children, Object.assign(rest, { name, value: values[name], onChange: _onChange }))
}

const WrapRender = React.memo(props => {
  const { children, ...rest } = props
  console.log('[WrapRender]', props)
  // @ts-ignore
  return React.createElement(children, rest)
})

const factory = React.createFactory(
  WrapFormContext
  // React.memo(WrapFormContext, (prevProps, nextProps) => {
  //   console.log(prevProps, nextProps, shallowEqual(prevProps, nextProps))
  //   return shallowEqual(prevProps, nextProps)
  // })
)

// todo 进行深层次的比较

function Reducers(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setValue':
      console.log('run setValue', action, state)
      state.values = Object.assign(state.values, payload)
      return { ...state }
    case 'forceSetValue':
      console.log('run forceSetValue', action, state)
      state.values = Object.assign(state.values, payload)
      return { ...state }
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
