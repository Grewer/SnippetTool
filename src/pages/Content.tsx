import React, { useRef, useState } from 'react'
import { PlainTextEdit, Text, View } from '@nodegui/react-nodegui'
import showdown from 'showdown'
import markDownCSS from '~/style/MarkDownCSS'

function Content() {
  const TextEditRef: React.MutableRefObject<any> = useRef()
  const [preView,setPreView] = useState('')

  console.log('render Content component')
  return (<View id="content">
    <PlainTextEdit ref={TextEditRef}
                   on={{
                     textChanged: (text?) => {
                       const text2 = TextEditRef.current.toPlainText()
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
                       setPreView(html)
                       // todo 添加防抖
                       // console.log('textChanged', text2)
                     },
                   }} style={`border:1px solid #888888;width:500px;height:200px;`}
                   placeholderText="默认输入"/>
    <View style={`padding: 10px;`}>
      <Text id="text">
        {
          `<style>
                    ${markDownCSS}
                </style>
                ${preView}`
        }
      </Text>
    </View>
  </View>)
}


export default Content
