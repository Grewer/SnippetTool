import React, { useCallback } from 'react'
import { IFormItem } from '~/form/interface'
import styles from './Radio.less'

interface IRadio extends IFormItem {
  data: { id: string; name: string }[]
  name?: string
}

function Radio(props: IRadio) {
  const { data, name, value, onChange } = props
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
      {data.map(item => {
        // console.log('checked', item.id === value)
        return (
          <label className={styles.label} key={item.id}>
            <input name="FileOrFolder" checked={item.id === value} onChange={_onchange} type="radio" value={item.id} />
            {item.name}
          </label>
        )
      })}
    </fieldset>
  )
}

export default Radio
