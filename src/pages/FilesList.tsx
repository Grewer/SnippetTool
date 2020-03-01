import { ScrollArea, Text, View } from '@nodegui/react-nodegui'
import React from 'react'

function FilesList(props) {
  console.log('render FilesList component')
  return <ScrollArea styleSheet={fileListWrap} id="fileList">
    <View id="listWrap">
      {
        Array(50).fill('').map((item, index) => {
          return <View id="item" key={index}>
            <Text id="itemText">{`listsccxx2`}</Text>
          </View>
        })
      }
    </View>
  </ScrollArea>
}


const fileListWrap = `
  #fileList{
    flex: 1;
    max-width: 200;
    min-width: 200;
    width: 200;
  }
  
  #listWrap {
    flex-direction: 'column';
  }
  
  #item:hover{
    background-color:#C9C8C6;
  }
  
  #item{
    padding: 10;
    background-color: '#fff';
  }
  
  #itemText: {
    color: '#888';
  }
`

export default React.memo(FilesList)
