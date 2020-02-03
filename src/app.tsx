import { Button, hot, LineEdit, PlainTextEdit, Text, View, Window } from '@nodegui/react-nodegui'
import React, { useState } from 'react'
import { QIcon } from '@nodegui/nodegui'
import path from 'path'
import nodeguiIcon from '../assets/nodegui.jpg'

const minSize = { width: 800, height: 520 }
const winIcon = new QIcon(path.resolve(__dirname, nodeguiIcon))


const MyCus = () => {
  const [text, setText] = useState('')

  return (
    <Window minSize={{ width: 500, height: 200 }}>
      <View>
        <LineEdit text={text} on={{
          textChanged: (text) => {
            console.log(text)
          }
        }}/>
        <Button on={{ clicked: () => setText('') }}/>
      </View>
    </Window>
  )
}

class App extends React.Component<any, { text: string }> {
  constructor(props: any) {
    super(props)
    console.log('rrun!')
    this.state = {
      text: '<p>123</p>',
    }
  }


  setText = (text: string) => {
    console.log('setText', text)
  }

  render() {
    return (
      <Window
        windowIcon={winIcon}
        windowTitle="Hello 👋🏽"
        minSize={minSize}
        styleSheet={styleSheet}
      >
        <View style={containerStyle}>
          <Text id="welcome-text">123</Text>
          <PlainTextEdit text={this.state.text}
                         on={{
                           textChanged: (text?) => {
                             console.log(text)
                             console.log('textChanged', this.state.text)
                           },
                         }} style={`border:1px solid #ddd;margin:20px;flex:1;`} placeholderText="默认输入"/>
          <Button on={{
            clicked: () => {
              console.log('run22')
            }
          }} text="click it"/>
        </View>
      </Window>
    )
  }
}

const containerStyle = `
  flex: 1; 
`

const styleSheet = `
  #welcome-text {
    font-size: 30px;
    padding-top: 50px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }
`

export default hot(App)
