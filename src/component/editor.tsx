import * as React from 'react';
import CodeMirrorEditor from "./codeMirrorEditor";

function Editor(props) {
  const {value = ''} = props
  return (
    <form className="editor pure-form">
      <CodeMirrorEditor value={value}/>
    </form>
  )
}


export default Editor
