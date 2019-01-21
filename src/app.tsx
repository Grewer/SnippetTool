import * as React from 'react';
import LeftSideBar from './component/leftSidebar'
import Content from "./component/content";
import {ipcRenderer} from "electron";

interface IState {
  title: string
  value: string
}

class App extends React.PureComponent<{}, IState> {
  state = {
    title: '这是标题',
    value: ''
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

  }


  public render() {
    return (<React.Fragment><LeftSideBar/><Content changeValue={this.changeValue}
                                                   saveFile={this.saveFile} {...this.state}/></React.Fragment>);
  }
}

export default App;
