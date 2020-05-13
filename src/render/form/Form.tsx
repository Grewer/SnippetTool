import React from 'react'
import styles from './Form.less'

const cancelSubmit = ev => {
  ev.preventDefault()
}

// const Bind = (Component, props) => {
//
//   return <Component {...props} />
// }

function Form(props) {
  const { children } = props
  return (
    <form onSubmit={cancelSubmit} className={styles.form}>
      {React.Children.map(children, value => {
        console.log(value)
        return value
      })}
    </form>
  )
}

export default Form
