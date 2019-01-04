import * as React from 'react';
import CodeMirrorEditor from "./codeMirrorEditor";
import * as ReactMarkdown from "react-markdown";

// import * as path from 'path'

interface IState {
  title: string
  status: number,
  value: string
}

// console.log(path.join(__dirname, '..')) // src
// console.log(path.join(__dirname)) // src/component

// const input = '# This is a header\n\nAnd this is a paragraph'
class Content extends React.PureComponent<{}, IState> {
  state = {
    title: '这是标题',
    status: 1, // 修改模式
    value: ''
  }
  // 0 观看模式
  // 1 修改模式

  changeValue = (value) => {
    this.setState({value})
  }

  changeStatus = () => {
    const {status} = this.state
    this.setState({status: Number(!status)})
  }

  public render() {
    const {value, status} = this.state
    return (<div className="wrapContent">
      <div className="header">
        <input className="title" type="text" defaultValue={this.state.title}/>
        <span onClick={this.changeStatus}>{status ? '修改' : '观看'}</span>
      </div>
      <div className="content">
        {status ? <React.Fragment>
            <CodeMirrorEditor changeValue={this.changeValue} input={value}/>
            <ReactMarkdown className="showMD" source={value}/></React.Fragment>
          : <ReactMarkdown className="showMD" source={value}/>}
      </div>
    </div>);
  }
}

export default Content
