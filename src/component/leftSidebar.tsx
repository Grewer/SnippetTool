import * as React from 'react';


class LeftSidebar extends React.PureComponent {
  public render() {
    return (<div className="leftBar">
      <div><input className="search" type="text" placeholder="请输入关键词"/><i>i</i></div>
      <div>
        <ul>
          <li>test1</li>
          <li>test1</li>
          <li>test1</li>
          <li>test1</li>
        </ul>
      </div>
    </div>);
  }
}


export default LeftSidebar;
