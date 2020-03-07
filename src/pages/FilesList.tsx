import { Button, ScrollArea, View } from '@nodegui/react-nodegui'
import React, { useState } from 'react'
import { CursorShape } from '@nodegui/nodegui'

function FilesList(props) {
  const [active, setActive]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0)
  // todo 带有图片的问题
  console.log('render FilesList component')
  return <ScrollArea styleSheet={fileListWrap} id="fileList">
    <View id="listWrap">
      {
        Array(50).fill('').map((item, index) => {
          return <Button on={{
            clicked: (checked) => {
              console.log(checked)
              setActive(index)
            }
          }} cursor={CursorShape.PointingHandCursor} style={index === active ? `background-color: '#D8D6D4'` : ``}
                         id="item" text={'listsccxx2'} key={index}/>
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
    background-color: '#D8D6D4';
  }
  
  #item:pressed {
    background-color: '#C9C8C6';
  }
  
  #item{
    margin: 0px;
    padding: 0px;
    height: 32px;
    line-height: 32px;
    background-color: '#F8F7F4';
    color: '#72706B';
    border: 0;
  }
`

export default React.memo(FilesList)
