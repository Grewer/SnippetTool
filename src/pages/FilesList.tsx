import { ScrollArea, Text, View } from '@nodegui/react-nodegui'
import React, { useEffect } from 'react'
import loadImage from '~/utils/loadImage'
import { Info } from '@nodegui/os-utils'

const imagePng = loadImage(require('~/static/text.png'))

function FilesList(props) {
  return <ScrollArea id="fileList">
    <View styleSheet={fileListWrap} id="listWrap">
      {
        Array(50).fill('').map((item, index) => {
          return <View id="item">
            {/*<Image style={`width:20px;height:20px;margin-left:${10*index}px`} src={imagePng}/>*/}
            <Text>{`<p style="color: #ddd">listsccxx</p>`}
            </Text>
          </View>
        })
      }
    </View>
  </ScrollArea>
}

const fileListWrap = `
  #listWrap{
    flex-direction: column;
    padding:10px;
  } 
  
  #item {
    border-top: 1px solid #dadfe6;
  }
`

export default React.memo(FilesList)
