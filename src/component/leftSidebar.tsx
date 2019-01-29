import * as React from 'react';
import {ipcRenderer} from "electron";


interface IProps {
  getFile: (id: string, title: string) => void

}

interface IList {
  fileId: string;
  title: string
  $loki: number
}

interface IState {
  selectedId: number | null
  list: IList[]
}

class LeftSidebar extends React.PureComponent<IProps, IState> {
  state = {
    selectedId: null,
    list: [] as IList[]
  }

  private select = (ev) => {
    const {id, title} = ev.target.dataset
    if (id) {
      this.setState({selectedId: Number(id)})
      this.props.getFile(id, title)
    }
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
                                       data-id={v.fileId} data-title={v.title}>{v.title}</li>)
        }
      </ul>
    </div>);
  }
}


export default LeftSidebar;
