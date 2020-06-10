import React from 'react'
import Loading from '~/components/Loading'

interface IProps {
  text?: string
  loading: boolean
  children: any
}

function GlobalLoading(props: IProps) {
  const { text = '加载中...', loading, children } = props
  console.log('run loading')
  return (
    <>
      {loading && <Loading text={text}/>}
      {children}
    </>
  )
}

export default GlobalLoading
