import * as React from 'react';
import CodeMirrorEditor from "./codeMirrorEditor";

function Editor(props) {
  const {value = ''} = props
  return (
    <div className="editor pure-form">
      <CodeMirrorEditor value={value}/>
    </div>
  )
}


export default Editor
