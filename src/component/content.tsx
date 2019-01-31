import * as React from 'react';
import CodeMirrorEditor from "./codeMirrorEditor";
import * as ReactMarkdown from "react-markdown";

interface IProps {
  changeValue: (val: string) => void
  changeTitle: (ev: any) => void
  saveFile: (val: string) => void
  title: string
  value: string
  loading: boolean
  selectId: string
}

interface IState {
  status: number,
}

// const input = '# This is a header\n\nAnd this is a paragraph'
class Content extends React.PureComponent<IProps, IState> {
  state = {
    status: 1, // 修改模式
  }
  // 0 观看模式
  // 1 修改模式

  changeStatus = () => {
    const {status} = this.state
    this.setState({status: Number(!status)})
  }

  componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
    if (nextProps.selectId !== this.props.selectId) {
      this.setState({status: 0})
    }
  }

  public render() {
    const {value, title, saveFile, changeValue, loading, changeTitle} = this.props
    const {status} = this.state
    console.log('render content ')
    return (<div className="wrapContent">
      <div className="header">
        <input className="title" type="text" onChange={changeTitle} value={title}/>
        <span onClick={this.changeStatus}>{status ? '观看' : '修改'}</span>
      </div>
      <div className="content">
        {loading ? 'loading...' : status ? <React.Fragment>
            <CodeMirrorEditor saveFile={saveFile} changeValue={changeValue} input={value}/>
            <ReactMarkdown className="showMD" source={value}/></React.Fragment>
          : <ReactMarkdown className="showMD" source={value}/>}
      </div>
    </div>);
  }
}

export default Content
