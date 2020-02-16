import { ScrollArea, Text, View } from '@nodegui/react-nodegui'
import React from 'react'
import loadImage from '~/utils/loadImage'

const imagePng = loadImage(require('~/static/text.png'))


function FilesList(props) {
  console.log('render FilesList component')
  return <ScrollArea id="fileList">
    <View styleSheet={fileListWrap} id="listWrap">
      {
        Array(50).fill('').map((item, index) => {
          return <View id="item" key={index}>
            {/*<Image style={`width:20px;height:20px;margin-left:${10*index}px`} src={imagePng}/>*/}
            <Text id="itemText">{`listsccxx`}
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
    margin: 5px 0;
    padding: 10px 20px;
  }
  
  #itemText{
    color: #000;
  }
  
  #item:hover{
    background-color:#000;
  }
`

export default React.memo(FilesList)
