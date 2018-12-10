import * as React from 'react';


class LeftSidebar extends React.PureComponent {
  public render() {
    return (<div className="leftBar">
      <div><input className="search" type="text" placeholder="请输入关键词"/></div>
      <ul className="list">
        <li> 测试长度XXXXXXXXXXXXXX</li>
        <li className="active">test1</li>
        <li>test1</li>
        <li>test1</li>
      </ul>
    </div>);
  }
}


export default LeftSidebar;
