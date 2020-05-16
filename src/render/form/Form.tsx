import React, { useContext } from 'react'
import styles from './Form.less'
import FormContext from '~/context/FormContext'

const cancelSubmit = ev => {
  ev.preventDefault()
}

function WrapFormContext(props, b) {
  console.log('WrapFormContext', props, b)
  const { children, ...rest } = props
  const context = useContext(FormContext)
  return React.createElement(children, { ...rest, ...context })
}

const factory = React.createFactory(WrapFormContext)

function Form(props) {
  const { children } = props
  const value = {
    values: {},
    checkMsg: {},
    onChange: () => {
      console.log('run onChange')
    },
  }

  // useReducer
  return (
    <FormContext.Provider value={value}>
      <form onSubmit={cancelSubmit} className={styles.form}>
        {React.Children.map(children, child => {
          console.log(child)
          return factory(child.props, child.type)
        })}
      </form>
    </FormContext.Provider>
  )
}

export default Form
