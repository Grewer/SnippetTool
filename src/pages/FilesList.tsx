import { Button, ScrollArea, Text, View } from '@nodegui/react-nodegui'
import React, { useState } from 'react'
import { CursorShape } from '@nodegui/nodegui'

function FilesList(props) {
  const [active, setActive] = useState()
  // todo 带有图片的问题
  console.log('render FilesList component')
  return <ScrollArea styleSheet={fileListWrap} id="fileList">
    <View id="listWrap">
      {
        Array(50).fill('').map((item, index) => {
          return <Button on={{
            clicked: (checked) => {
              console.log(checked)
            }
          }} cursor={CursorShape.PointingHandCursor} id="item" text={'listsccxx2'} key={index}>
            listsccxx2 //
            <Text id="itemText">{`listsccxx2`}</Text>
          </Button>
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
    background-color: '#C9C8C6';
  }
  
  #item{
    padding: 10;
    background-color: '#F8F7F4';
    border: 0;
  }
  
  #itemText {
    color: '#72706B';
  }
`

export default React.memo(FilesList)
