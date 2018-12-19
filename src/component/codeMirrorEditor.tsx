import * as React from 'react';
import * as CodeMirror from 'codemirror/lib/codemirror'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/3024-day.css'
// import 'codemirror/theme/neat.css'
// import 'codemirror/mode/xml/xml.js'
// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/addon/hint/javascript-hint'
// import 'codemirror/addon/hint/sql-hint'
// import 'codemirror/addon/hint/html-hint'
// import 'codemirror/addon/hint/xml-hint'
// import 'codemirror/addon/hint/anyword-hint'
// import 'codemirror/addon/hint/css-hint'
// import 'codemirror/addon/hint/show-hint.css'
// import 'codemirror/addon/selection/active-line'


interface IProps {
  value: string
}

interface IState {
  isControlled: boolean
}

class CodeMirrorEditor extends React.Component<IProps, IState> {
  private editorRef: React.RefObject<any>;
  private editor: any;

  constructor(props) {
    super(props)
    this.state = {isControlled: Boolean(this.props.value)}
    this.handleChange = this.handleChange.bind(this)
    this.editorRef = React.createRef()
  }

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(this.editorRef.current, this.props);
    this.editor.on('change', this.handleChange);
  }

  componentDidUpdate() {
    if (!this.editor) {
      return
    }

    if (this.props.value) {
      if (this.editor.getValue() !== this.props.value) {
        this.editor.setValue(this.props.value);
      }
    }
  }

  handleChange() {
    if (!this.editor) {
      return
    }

    const value = this.editor.getValue()
    if (value === this.props.value) {
      return
    }

    // if (this.props.onChange) {
    //   this.props.onChange({target: {value: value}})
    // }

    if (this.editor.getValue() !== this.props.value) {
      if (this.state.isControlled) {
        this.editor.setValue(this.props.value)
      } else {
        // this.props.value = value
      }
    }
  }

  render() {
    return  <textarea ref={this.editorRef} name="editor">
    </textarea>
  }
}

export default CodeMirrorEditor
