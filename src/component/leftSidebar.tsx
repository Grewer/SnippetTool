import * as React from 'react';
// import {mainUl} from "./leftSidebar.css";
import Radium from 'radium';


const styles = {
  main: {
    background: 'blue',
    border: 0,
    borderRadius: 4,
    color: 'white',
    padding: '1.5em',
    width: '30%'
  }
};

@Radium
class LeftSidebar extends React.PureComponent {
  public render() {
    return (<div style={styles.main}>LeftSidebar</div>);
  }
}


export default LeftSidebar;
