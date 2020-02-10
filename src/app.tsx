import { hot, View, Window } from '@nodegui/react-nodegui'
import React from 'react'
import FilesList from '~/pages/FilesList'
import Content from '~/pages/Content'

const minSize = { width: 800, height: 520 }


function App() {
  console.log('render app component')
  return (
    <Window
      windowTitle="Hello 👋🏽"
      minSize={minSize}
      styleSheet={winStyleSheet}
    >
      <View id="wrap">
        <FilesList/>
        <Content/>
      </View>
    </Window>
  )
}

const winStyleSheet = `
   #wrap{
      width: '100%';
      height: '100%';
      flex-direction: row;
   }
   
  #fileList{
    flex: 1 1 200px;
    max-width:200px;
    min-width:200px;
    width:200px;
  }
  
  #content{
     flex:8;
  }
`
export default hot(App)
