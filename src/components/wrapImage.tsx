import path from 'path'
import { Image } from '@nodegui/react-nodegui'
import { ImageProps } from '@nodegui/react-nodegui/dist/components/Image/RNImage'
import React from 'react'

function WrapImage(props: ImageProps) {
  const { src = '', ...rest } = props
  const _src = path.resolve(__dirname, '../', src)
  return <Image src={_src} {...rest}/>
}

export default WrapImage
