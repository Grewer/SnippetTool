import * as React from 'react';
import CodeMirrorEditor from "./codeMirrorEditor";
import * as ReactMarkdown from "react-markdown";

// const input = '# This is a header\n\nAnd this is a paragraph'
class Content extends React.PureComponent {
  state = {
    title: '这是标题',
    status: 1, // 修改模式
    value: 'qwerty'
  }
  // 1 观看模式
  // 2 修改模式

  changeValue = (value) => {
    this.setState({value})
  }

  public render() {
    const {value} = this.state
    return (<div className="wrapContent">
      <div className="header">
        <input className="title" type="text" value={this.state.title}/>
        <span>修改模式</span>
      </div>
      <div className="content">
        <CodeMirrorEditor changeValue={this.changeValue} value={value}/>
        <ReactMarkdown className="showMD" source={value}/>
        {/*此处为观看*/}
      </div>
    </div>);
  }
}

export default Content
