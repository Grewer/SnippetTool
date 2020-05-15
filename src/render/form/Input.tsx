import React, { useContext } from 'react'
import styles from './Form.less'
import FormContext from '~/context/FormContext'

interface IProps {
  placeholder?: string
  name: string
  onChange?: (ev) => void
  value?: any
}

export function WrapFormContext(Component) {
  return function Middle(props) {
    console.log(props)
    const { values, checkMsg, onChange } = useContext(FormContext)
    return <Component value={values[name]} checkMsg={checkMsg[name]} onChange={onChange} />
  }
}

function Input(props: IProps) {
  const { value, onChange, ...rest } = props
  return <input className={styles.input} value={value} onChange={onChange} type="text" {...rest} />
}

export default WrapFormContext(Input)
