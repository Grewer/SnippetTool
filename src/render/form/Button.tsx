import React from 'react'
import styles from './Form.less'

function Button(props) {
  console.log('[Button] run')
  return (
    <button type="submit" className={styles.button}>
      {props.children}
    </button>
  )
}

Button.button = 'submit'

export default Button
