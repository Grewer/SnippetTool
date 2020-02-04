import { Button, hot, LineEdit, PlainTextEdit, Text, View, Window } from '@nodegui/react-nodegui'
import React, { useState } from 'react'
import { QIcon } from '@nodegui/nodegui'
import path from 'path'
import nodeguiIcon from '../assets/nodegui.jpg'
import showdown from 'showdown'


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

class App extends React.Component<any, { text: string; preView: string }> {
  constructor(props: any) {
    super(props)
    console.log('rrun!')

  }

  state = {
    text: '',
    preView: ''
  }

  private textRef: React.RefObject<any> = React.createRef()


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
        <View styleSheet={containerStyle}>
          <Text id="welcome-text">123</Text>
          <PlainTextEdit ref={this.textRef}
                         on={{
                           textChanged: (text?) => {
                             const text2 = this.textRef.current.toPlainText()
                             const converter = new showdown.Converter()
                             const html = converter.makeHtml(text2)
                             this.setState({
                               preView: html
                             })
                             console.log('textChanged', text2)
                           },
                         }} style={`border:1px solid #ddd;margin:20px;flex:1;`} placeholderText="默认输入"/>
          <Button on={{
            clicked: () => {
              console.log('run22')
            }
          }} text="click it"/>
          <Text html="" id="text">{this.state.preView}</Text>
        </View>
      </Window>
    )
  }
}

const containerStyle = `
  #text{
    margin:10px;
    font-size:18px
  }
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
