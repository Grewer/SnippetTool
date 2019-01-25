import * as React from 'react';
import LeftSideBar from './component/leftSidebar'
import Content from "./component/content";
import {ipcRenderer} from "electron";

interface IState {
  title: string
  value: string
  loading: boolean
  selectId: string
}

class App extends React.PureComponent<{}, IState> {
  state = {
    title: '这是标题',
    value: '',
    loading: false,
    selectId: '0'
  }

  changeValue = (value) => {
    this.setState({value})
  }

  saveFile = (content) => {
    const {title} = this.state
    ipcRenderer.sendSync('saveFile', {
      title,
      content
    })
  } // TODO 有新建的文件 则在左侧显示

  getFile = (id, title) => {
    console.log(id)
    if (id === this.state.selectId) {
      return;
    }
    this.setState({loading: true, title})
    const file = ipcRenderer.sendSync('getFile', {id})
    this.setState({loading: false, value: file.content, selectId: id})
  }

  changeTitle = ev => {
    this.setState({title: ev.target.value})
  }

  public render() {
    return (<React.Fragment>
      <LeftSideBar getFile={this.getFile}/>
      <Content changeTitle={this.changeTitle} changeValue={this.changeValue} saveFile={this.saveFile} {...this.state}/>
    </React.Fragment>);
  }
}

export default App;
