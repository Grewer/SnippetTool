import { hot, View, Window,Text } from '@nodegui/react-nodegui'
import React from 'react'
import FilesList from '~/pages/FilesList'
import Content from '~/pages/Content'

const minSize = { width: 800, height: 520 }

/**
 * 只有 APP 为 class 时 hot reload 才会生效
 */
class App extends React.Component<any, { text: string; preView: string }> {
  render() {
    console.log('render app component!')
    return (
      <Window
        windowTitle="snippet"
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
