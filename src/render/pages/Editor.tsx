import React, { useEffect } from 'react'
import * as HyperMD from 'hypermd'

// Load these modes if you want highlighting ...
require('codemirror/mode/htmlmixed/htmlmixed') // for embedded HTML
require('codemirror/mode/yaml/yaml') // for Front Matters

// Load PowerPacks if you want to utilize 3rd-party libs
require('hypermd/powerpack/hover-with-marked') // implicitly requires "marked"
// and other power packs...
// Power packs need 3rd-party libraries. Don't forget to install them!

function Editor() {
  useEffect(() => {
    const myTextarea = document.getElementById('myTextarea') as HTMLTextAreaElement
    const cm = HyperMD.fromTextArea(myTextarea, {
      /* optional editor options here */
      hmdModeLoader: false, // see NOTEs below
    })
  }, [])
  return <textarea defaultValue="# Hello World" id="myTextarea" />
}

export default Editor
