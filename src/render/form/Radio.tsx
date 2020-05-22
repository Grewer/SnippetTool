import React, { useCallback } from 'react'

interface IRadio {
  data: { id: number | string; name: string }[]
}

function Radio(props: IRadio) {
  const { data } = props
  console.log(props)
  const _onchange = useCallback(ev => {
    console.log(ev, ev.target, ev.target.value)
  }, [])

  return (
    <fieldset>
      <legend>Title</legend>
      {data.map(item => {
        return (
          <label>
            <input name="FileOrFolder" checked onChange={_onchange} type="radio" value="1" />
            文件{' '}
          </label>
        )
      })}
    </fieldset>
  )
}

export default Radio
