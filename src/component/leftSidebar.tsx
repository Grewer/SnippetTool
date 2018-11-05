import * as React from 'react';
import Radium from 'radium';

const styles = {
  main: {
    background: 'white',
    borderRight:'1px solid #999',
    borderLeft: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    padding: '1em',
    flexBasis: "30%",
  }
};

@Radium
class LeftSidebar extends React.PureComponent {
  public render() {
    return (<div style={styles.main}>
      <div><input type="text" placeholder="请输入关键词"/><i>icon</i></div>
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
