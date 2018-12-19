import * as React from 'react';
// import * as ReactMarkdown from "react-markdown";
import Editor from "./editor";


// const input = '# This is a header\n\nAnd this is a paragraph'
class Content extends React.PureComponent {
  state = {
    title: '这是标题',
    status: 1
  }
  // 1 观看模式
  // 2 修改模式

  public render() {
    return (<div className="wrapContent">
      <div className="header">
        <input className="title" type="text" value={this.state.title}/>
        <span>修改模式</span>
      </div>
      <div className="content">
        <Editor/>
        {/*<ReactMarkdown source={input}/>*/}
        {/*此处为观看*/}
      </div>
    </div>);
  }
}

export default Content
