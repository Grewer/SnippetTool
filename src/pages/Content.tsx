import React, { useCallback, useRef, useState } from 'react'
import { PlainTextEdit, Text, View } from '@nodegui/react-nodegui'
import showdown from 'showdown'
import markDownCSS from '~/style/MarkDownCSS'
import throttle from '~/utils/throttle'

function Content() {
  const TextEditRef: React.MutableRefObject<any> = useRef()
  const [preView, setPreView] = useState('')

  const textChangeHandle = useCallback(() => {
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
  }, [TextEditRef])

  console.log('render Content component')
  return (<View id="content" styleSheet={styleSheet}>
    <PlainTextEdit ref={TextEditRef}
                   on={{
                     textChanged: () => {
                       throttle(textChangeHandle)
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

const styleSheet = `
  #content {
    flex: 8;
  }
`


export default Content
