import React, { useCallback } from 'react'
import { IFormItem } from '~/form/interface'
import styles from './Form.less'

interface IRadio extends IFormItem {
  /* eslint-disable react/no-unused-prop-types */
  options: { id: string; name: string }[]
  name?: string
  check?: {
    required?: string
  }
  checkMsg?: string
  defaultValue?: any
}

function Radio(props: IRadio) {
  const { options, name, value, onChange } = props
  console.log('[Radio]', props)

  const _onchange = useCallback(
    ev => {
      console.log(ev, ev.target, ev.target.checked, ev.target.value)
      onChange!(ev.target.value)
    },
    [onChange]
  )

  return (
    <fieldset name={name}>
      {options.map(item => {
        // console.log('checked', item.id === value)
        return (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label className={styles.radioLabel} key={item.id}>
            <input name="FileOrFolder" checked={item.id === value} onChange={_onchange} type="radio" value={item.id} />
            {item.name}
          </label>
        )
      })}
    </fieldset>
  )
}

export default Radio
