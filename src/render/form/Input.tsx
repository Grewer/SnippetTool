import React, { useCallback, useMemo } from 'react'
import styles from './Form.less'
import { IFormItem } from '~/form/interface'
import classNames from '~/utils/classNames'

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

  const { input } = useMemo(() => {
    return {
      input: classNames({
        [styles.input]: true,
        [styles.inputError]: checkMsg,
      }),
    }
  }, [checkMsg])

  return (
    <fieldset name={name}>
      <input className={input} value={value} onChange={_onChange} type="text" {...rest} />
    </fieldset>
  )
}

export default Input
