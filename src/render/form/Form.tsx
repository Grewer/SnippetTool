import React, { useContext } from 'react'
import styles from './Form.less'
import FormContext from '~/context/FormContext'

const cancelSubmit = ev => {
  ev.preventDefault()
}
function WrapFormContext(Component) {
  return function Middle(props) {
    console.log(props)
    const { values, checkMsg, onChange } = useContext(FormContext)
    return <Component value={values[name]} checkMsg={checkMsg[name]} onChange={onChange} />
  }
}

function Form(props) {
  const { children } = props
  const value = {
    values: {},
    checkMsg: {},
    onChange: () => {},
  }
  // useReducer
  return (
    <FormContext.Provider value={value}>
      <form onSubmit={cancelSubmit} className={styles.form}>
        {React.Children.map(children, child => {
          return child
        })}
      </form>
    </FormContext.Provider>
  )
}

export default Form
