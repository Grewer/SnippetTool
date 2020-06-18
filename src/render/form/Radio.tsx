import React, { useCallback, useMemo } from 'react'
import { IFormItem } from '~/form/interface'
import styles from './Form.less'
import classNames from '~/utils/classNames'

interface IRadio extends IFormItem {
  options: { id: string; name: string }[]
  name?: string
  check?: {
    required?: string
  }
  checkMsg?: string
}

function Radio(props: IRadio) {
  const { options, name, value, checkMsg, onChange } = props
  console.log('[Radio]', props)

  const _onchange = useCallback(
    ev => {
      console.log(ev, ev.target, ev.target.checked, ev.target.value)
      onChange!(ev.target.value)
    },
    [onChange]
  )

  const { error } = useMemo(() => {
    return {
      error: classNames({
        [styles.error]: true,
        [styles.errorAnimation]: checkMsg,
      }),
    }
  }, [checkMsg])

  return (
    <fieldset name={name}>
      {options.map(item => {
        // console.log('checked', item.id === value)
        return (
          <label className={styles.radioLabel} key={item.id}>
            <input name="FileOrFolder" checked={item.id === value} onChange={_onchange} type="radio" value={item.id} />
            {item.name}
          </label>
        )
      })}
      <div className={error}>{checkMsg}</div>
    </fieldset>
  )
}

export default Radio
