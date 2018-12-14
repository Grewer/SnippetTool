import * as React from 'react';
import LeftSideBar from './component/leftSidebar'
import Content from "./component/content";

class App extends React.PureComponent {
  public render() {
    return (<React.Fragment><LeftSideBar/><Content/></React.Fragment>);
  }
}

export default App;
