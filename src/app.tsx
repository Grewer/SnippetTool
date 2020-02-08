import { hot, PlainTextEdit, Text, View, Window } from '@nodegui/react-nodegui'
import React from 'react'
import showdown from 'showdown'
import mdCss from '~/style/mdCss'
import FilesList from '~/pages/FilesList'

const minSize = { width: 800, height: 520 }


class App extends React.Component<any, { text: string; preView: string }> {
  constructor(props: any) {
    super(props)
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
        windowTitle="Hello 👋🏽"
        minSize={minSize}
        styleSheet={winStyleSheet}
      >
        <View id="wrap">
          <FilesList/>
          <View id="content">
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
                           }} style={`border:1px solid #ddd;width:500px;height:200px;`}
                           placeholderText="默认输入"/>
            <View style={`padding: 10px;`}>
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
      background-color:#fff;
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
