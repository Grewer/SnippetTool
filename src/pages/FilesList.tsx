import { ScrollArea, Text, View } from '@nodegui/react-nodegui'
import React from 'react'
import { create } from 'nodegui-stylesheet'

function FilesList(props) {
  console.log('render FilesList component')
  return <ScrollArea style={styles.fileList}>
    <View style={styles.listWrap} styleSheet={fileListWrap}>
      {
        Array(50).fill('').map((item, index) => {
          return <View id="item" style={styles.item} key={index}>
            <Text style={styles.itemText}>{`listsccxx2`}</Text>
          </View>
        })
      }
    </View>
  </ScrollArea>
}

const styles = create({
  itemText: {
    color: '#888',
  },
  fileList: {
    flex: 1,
    maxWidth: 200,
    minWidth: 200,
    width: 200
  },
  listWrap: {
    flexDirection: 'column',
    padding: 10,
  },
  item: {
    margin: 5,
    padding: 10
  }
})


const fileListWrap = `
  #item:hover{
    background-color:#000;
  }
`

export default React.memo(FilesList)
