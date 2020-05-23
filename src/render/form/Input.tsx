import React, { useCallback } from 'react'
import styles from './Form.less'
import { IFormItem } from '~/form/interface'

interface IProps extends IFormItem {
  placeholder?: string
  name?: string
}

function Input(props: IProps) {
  const { value, onChange, name, ...rest } = props
  console.log('[Input]', props)

  const _onChange = useCallback(
    ev => {
      onChange!(ev.target.value)
    },
    [onChange]
  )

  return (
    <fieldset name={name}>
      <input className={styles.input} value={value} onChange={_onChange} type="text" {...rest} />
    </fieldset>
  )
}

export default Input
