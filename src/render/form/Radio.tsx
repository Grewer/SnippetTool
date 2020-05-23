import React, { useCallback } from 'react'
import { IFormItem } from '~/form/interface'

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
        console.log('checked', item.id === value)
        return (
          <label>
            <input name="FileOrFolder" checked={item.id === value} onChange={_onchange} type="radio" value={item.id} />
            文件{' '}
          </label>
        )
      })}
    </fieldset>
  )
}

export default Radio
