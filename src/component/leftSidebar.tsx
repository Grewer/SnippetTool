import * as React from 'react';
import Radium from 'radium';

const styles = {
  main: {
    background: 'white',
    borderRight: '1px solid #999',
    borderLeft: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    padding: '1em',
    flexBasis: "30%",
  },
  input: {
    backgroundColor: "white",
    cursor: 'text',
    padding: '2px',
    border: '1px solid #ddd',
    textIndent: '5px',
    outline: 0,
    ':hover': {
      borderColor: '#a3af2a'
    },
    ':focus': {
      borderColor: 'rgba(20,105,144,0.5)'
    }
  }
};

@Radium
class LeftSidebar extends React.PureComponent {
  public render() {
    return (<div style={styles.main}>
      <div><input type="text" style={styles.input} placeholder="请输入关键词"/><i>i</i></div>
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
