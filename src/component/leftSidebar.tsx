import * as React from 'react';

interface IList {
  name: string
  id: number
}

interface IState {
  selectedId: number
}

const list: IList[] = [{
  name: '测试长度XXXXXXXXXXXXXX',
  id: 111
}, {
  name: 'test1',
  id: 112
}, {
  name: 'test2',
  id: 113
}, {
  name: 'test3',
  id: 114
}]

class LeftSidebar extends React.PureComponent<{}, IState> {
  state = {
    selectedId: 112
  }

  private select = (ev) => {
    const {id} = ev.target.dataset
    id && this.setState({selectedId: Number(id)})
    // todo 显示右侧文件
  }

  public render() {
    return (<div className="leftBar">
      <div><input className="search" type="text" placeholder="请输入关键词"/></div>
      <ul className="list" onClick={this.select}>
        {
          list.map(v => <li className={this.state.selectedId === v.id ? 'active' : ''} key={v.id}
                            data-id={v.id}>{v.name}</li>)
        }
      </ul>
    </div>);
  }
}


export default LeftSidebar;
