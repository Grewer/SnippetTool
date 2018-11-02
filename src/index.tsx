import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import {AppContainer} from 'react-hot-loader';

console.log('render  run')
// jsx 问题
const render = () => {
  ReactDOM.render(<div>{"test app index"}</div>, document.getElementById('app'));
}

render();
// if (module.hot) {
//   module.hot.accept(render);
// }