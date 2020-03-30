import React, { Component } from 'react'
import FileLists from '~/pages/FileLists'

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello,Electron!</h1>
        <FileLists/>
        <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
      </div>
    )
  }
}

export default App
