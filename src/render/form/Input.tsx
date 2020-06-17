import React, { useCallback } from 'react'
import styles from './Form.less'
import { IFormItem } from '~/form/interface'

type IK = IFormItem & JSX.IntrinsicElements['input']

interface IProps extends IK {
  placeholder?: string
  name?: string
  check?: {
    required?: string
  }
  checkMsg?: string
}

function Input(props: IProps) {
  const { value, onChange, name, checkMsg, ...rest } = props
  console.log('[Input]', props)

  const _onChange = useCallback(
    ev => {
      onChange!(ev.target.value)
    },
    [onChange]
  )

  return (
    <fieldset name={name}>
      <input className={`${styles.input} ${checkMsg ? styles.inputError : ''}`} value={value} onChange={_onChange} type="text" {...rest} />
      {checkMsg && <div className={styles.error}>{checkMsg}</div>}
    </fieldset>
  )
}

export default Input
