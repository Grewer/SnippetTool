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
      autofocus: true,
      extraKeys: {
        "Ctrl-Q": "autocomplete",
      },
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
    // this.editor.on('changes', this.handleChange); // TODO 与 change 的异同
    this.editor.setOption("extraKeys", {
      "Cmd-S": this.save
    });
  }

  componentWillUnmount(): void {
    this.editor.toTextArea()
    // TODO  后续查看 绑定的方法是否有内存泄漏
  }

  save = (instance: CodeMirror) => {
    // cmd+s 时触发
    console.log(instance)
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
  }

  render() {
    console.log('edit render')
    return <textarea ref={this.editorRef} name="editor">
    </textarea>
  }
}

export default CodeMirrorEditor
