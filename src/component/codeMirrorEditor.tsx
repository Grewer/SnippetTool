import * as React from 'react';
import * as CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/hint/xml-hint'
import 'codemirror/addon/selection/active-line'


interface IProps {
  value: string
  changeValue: (value: string) => void
}

interface IState extends React.ComponentClass {
  isControlled: boolean
}

let asyncGetHint: NodeJS.Timeout;

class CodeMirrorEditor extends React.PureComponent<IProps, IState> {
  private editorRef: React.RefObject<any>;
  private editor: any;

  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
  }

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.editorRef.current, {
      theme: "3024-day",
      mode: 'text/javascript',
      matchBrackets: true,
      extraKeys: {"Ctrl-Q": "autocomplete"},
      option: {
        autofocus: true
      },
      scrollbarStyle: null, // 去除自带的滚动条 TODO 后面会让滚动条一直显示
      hintOptions: {
        completeSingle: false, // 打出 fu 时不会变成 function
      }
    });
    this.editor.setValue(this.props.value);
    this.editor.on('change', this.handleChange);
  }

  componentDidUpdate() {
    // if (!this.editor) {
    //   return
    // }
    // console.log(this.props, this.editor)
    // if (this.props.value) {
    //   if (this.editor.getValue() !== this.props.value) {
    //     this.editor.setValue(this.props.value);
    //   }
    // }
  }

  handleChange = (instance, change) => {
    // 将 change 传递给父组件的 markdown
    if (change.origin !== 'complete' && /\w|\./g.test(change.text[0])) {
      if (asyncGetHint) {
        clearTimeout(asyncGetHint)
      }
      asyncGetHint = setTimeout(() => {
        instance.showHint()
      }, 300)
    }

    if (!this.editor) {
      return
    }
    const value = this.editor.getValue()
    this.props.changeValue(value)


    // const value = this.editor.getValue()
    // if (value === this.props.value) {
    //   return
    // }
    //
    // // if (this.props.onChange) {
    // //   this.props.onChange({target: {value: value}})
    // // }
    //
    // if (this.editor.getValue() !== this.props.value) {
    //   if (this.state.isControlled) {
    //     this.editor.setValue(this.props.value)
    //   } else {
    //     // this.props.value = value
    //   }
    // }
  }

  render() {
    console.log('edit render')
    return <textarea ref={this.editorRef} name="editor">
    </textarea>
  }
}

export default CodeMirrorEditor
