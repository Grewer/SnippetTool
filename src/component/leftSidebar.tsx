import * as React from 'react';
import {ipcRenderer} from "electron";

interface IList {
  title: string
  $loki: number
}

interface IState {
  selectedId: number
  list: IList[]
}

class LeftSidebar extends React.PureComponent<{}, IState> {
  state = {
    selectedId: 112,
    list: [] as IList[]
  }

  private select = (ev) => {
    const {id} = ev.target.dataset
    id && this.setState({selectedId: Number(id)})
  }

  componentDidMount(): void {
    const result: IList[] = ipcRenderer.sendSync('getAllTitle')
    this.setState({list: result})
  }

  public render() {
    return (<div className="leftBar">
      <div><input className="search" type="text" placeholder="请输入关键词"/></div>
      <ul className="list" onClick={this.select}>
        {
          this.state.list.map(v => <li className={this.state.selectedId === v.$loki ? 'active' : ''} key={v.$loki}
                                       data-id={v.$loki}>{v.title}</li>)
        }
      </ul>
    </div>);
  }
}


export default LeftSidebar;
