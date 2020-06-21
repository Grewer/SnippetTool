import React, { useMemo } from 'react'
import classNames from '~/utils/classNames'
import styles from '~/form/Form.less'

interface IProps {
  checkMsg: string
  children: React.FC<any>
  [key: string]: any
}

const ErrorTip = React.memo((props: IProps) => {
  const { children, ...rest } = props
  const { checkMsg } = rest
  const { error } = useMemo(() => {
    return {
      error: classNames({
        [styles.error]: true,
        [styles.errorAnimation]: checkMsg,
      }),
    }
  }, [checkMsg])

  return (
    <>
      {React.createElement(children, rest)}
      <div className={error}>{checkMsg}</div>
    </>
  )
})
export default ErrorTip
