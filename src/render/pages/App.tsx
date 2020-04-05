import React, { Component } from 'react'
import FileLists from '~/pages/FileLists'
import Editor from '~/pages/Editor'

class App extends Component {
  render() {
    return (
      <>
        <FileLists />
        <Editor />
      </>
    )
  }
}

export default App
