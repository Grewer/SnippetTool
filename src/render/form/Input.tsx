import React from 'react'
import styles from './Form.less'

interface IProps {
  placeholder?: string
  name: string
}

function Input(props: IProps) {
  return <input className={styles.input} type="text" {...props} />
}

export default Input
