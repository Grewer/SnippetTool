import * as React from 'react';


class Content extends React.PureComponent {
  state = {
    title: '这是标题'
  }

  public render() {
    return (<div className="wrapContent">
      <div className="header">
        <input className="title" type="text" value={this.state.title}/>
        <span>修改模式</span>
      </div>
    </div>);
  }
}

export default Content
