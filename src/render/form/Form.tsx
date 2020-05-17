import React, { useContext, useReducer } from 'react'
import styles from './Form.less'
import FormContext from '~/context/FormContext'

const cancelSubmit = ev => {
  ev.preventDefault()
}

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
  const { type, payload } = state
  switch (type) {
    case 'setValue':
      state.values[payload.name] = payload.val
      return { ...state }
    default:
      return state
  }
}

function Form(props) {
  const { children } = props

  // const value = {
  //   values: {},
  //   checkMsg: {},
  //   onChange: (val, name) => {
  //     console.log('run onChange', value)
  //     value.values[name] = val
  //   },
  // }

  const [value, dispatch] = useReducer(Reducers, {
    values: {},
    checkMsg: {},
    onChange: (val, name) => {
      dispatch({
        type: 'setValue',
        payload: {
          name,
          value,
        },
      })
      console.log('run onChange', val, name)
    },
  })

  // const onChange = (val, name) => {
  //   dispatch({
  //     type: 'setValue',
  //     payload: {
  //       name,
  //       value,
  //     },
  //   })
  //   console.log('run onChange', val, name)
  // }

  // useReducer
  return (
    <FormContext.Provider value={value}>
      <form onSubmit={cancelSubmit} className={styles.form}>
        {React.Children.map(children, child => {
          console.log(child)
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
