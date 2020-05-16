import React from 'react'
import styles from './Form.less'

interface IProps {
  placeholder?: string
  name?: string
  onChange?: (ev) => void
  value?: any
}

function Input(props: IProps) {
  const { value, onChange, ...rest } = props
  console.log('run Input', props)
  return <input className={styles.input} value={value} onChange={onChange} type="text" {...rest} />
}

export default Input
