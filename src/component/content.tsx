import * as React from 'react';
import CodeMirrorEditor from "./codeMirrorEditor";
import * as ReactMarkdown from "react-markdown";

interface IProps {
  changeValue: (val: string) => void
  saveFile: (val: string) => void
  title: string
  value: string
  loading: boolean
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
  } // todo 默认为 观看模式


  public render() {
    const {value, title, saveFile, changeValue, loading} = this.props
    const {status} = this.state
    console.log('render content ')
    return (<div className="wrapContent">
      <div className="header">
        <input className="title" type="text" defaultValue={title}/>
        <span onClick={this.changeStatus}>{status ? '修改' : '观看'}</span>
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
