import { hot, View, Window } from '@nodegui/react-nodegui'
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
      >
        <View>
          <FilesList/>
          <Content/>
        </View>
      </Window>
    )
  }
}

//QPushButton:enabled { color: red }
// QPushButton:hover { color: white }

export default hot(App)
