import { Button, hot, LineEdit, PlainTextEdit, Text, View, Window } from '@nodegui/react-nodegui'
import React, { useState } from 'react'
import { QIcon } from '@nodegui/nodegui'
import path from 'path'
import nodeguiIcon from '../assets/nodegui.jpg'
import showdown from 'showdown'
import mdCss from './mdCss'

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
  private previewRef: React.RefObject<any> = React.createRef()


  setText = (text: string) => {
    console.log('setText', text)
  }

  render() {
    return (
      <Window
        windowIcon={winIcon}
        windowTitle="Hello 👋🏽"
        minSize={minSize}
        style={`background:#fff`}
      >
        <View styleSheet={containerStyle}>
          <PlainTextEdit ref={this.textRef}
                         on={{
                           textChanged: (text?) => {
                             const text2 = this.textRef.current.toPlainText()
                             const converter = new showdown.Converter({
                               strikethrough: true,
                               tables: true,
                               tasklists: true,
                               requireSpaceBeforeHeadingText: true,
                               emoji: true,
                               omitExtraWLInCodeBlocks: true,
                             })
                             const html = converter.makeHtml(text2)
                             console.log(html)
                             this.setState({
                               preView: `${html}`
                             }, () => {
                               console.log(this.previewRef && this.previewRef.current.text())
                             })
                             // todo 添加防抖
                             // console.log('textChanged', text2)
                           },
                         }} style={`border:1px solid #ddd;margin:20px;width:500px;height:200px;`}
                         placeholderText="默认输入"/>
          <View style={`
    background-color: #fff;padding: 10px;`}>

            <Text ref={this.previewRef} id="text">
              {
                `<style>
                    ${mdCss}
                </style>
                ${this.state.preView}`
              }
            </Text>

          </View>
        </View>
      </Window>
    )
  }
}

const containerStyle = `
  #text h1{
    color:'red';
   }
 
   QLabel#text h1{
    color:red;
   }
   
   LI{
     color:red;
   }
   
   UL{
     color:red;
   }
`
export default hot(App)
