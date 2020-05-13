import React from 'react'
import styles from './Form.less'

function Button() {
  const submitHandle = () => {
    alert('run')
    // submit: ƒ submit()
    // requestSubmit: ƒ requestSubmit()
    // reset: ƒ reset()
    // checkValidity: ƒ checkValidity()
    // reportValidity: ƒ reportValidity()
    // @ts-ignore
    // console.dir(document.querySelector('form').reportValidity())
    // alert(123)
  }
  return (
    <button onClick={submitHandle} type="submit" className={styles.button}>
      Button
    </button>
  )
}

export default Button
