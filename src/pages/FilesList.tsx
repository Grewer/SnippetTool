import { ScrollArea, Text, View } from '@nodegui/react-nodegui'
import React from 'react'
import { create } from 'nodegui-stylesheet'

function FilesList(props) {
  console.log('render FilesList component')
  return <ScrollArea id="fileList">
    <View styleSheet={fileListWrap} id="listWrap">
      {
        Array(50).fill('').map((item, index) => {
          return <View id="item" key={index}>
            <Text style={styles.item}>{`listsccxx2`}</Text>
          </View>
        })
      }
    </View>
  </ScrollArea>
}

const styles = create({
  item: {
    color: '#fff',
    margin: 2,
  }
})

console.log(styles)

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
