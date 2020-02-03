"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_nodegui_1 = require("@nodegui/react-nodegui");
const react_1 = __importDefault(require("react"));
const open_1 = __importDefault(require("open"));
function StepTwo() {
    const btnHandler = react_nodegui_1.useEventHandler({
        clicked: () => open_1.default("https://react.nodegui.org").catch(console.log)
    }, []);
    return (react_1.default.createElement(react_nodegui_1.View, { style: containerStyle },
        react_1.default.createElement(react_nodegui_1.Text, { style: textStyle, wordWrap: true }, `
          <ol>
            <li>
                Open chrome and navigate to chrome://inspect. You should see a target below with your app.
            </li>
            <br/>
              <li>
                  Next click on  "Open dedicated DevTools for Node"
              </li>
              <br/>
            <li>
                On the dedicated devtools. Click on Source > Node > "Your node process"
            </li>
          </ol>
        `),
        react_1.default.createElement(react_nodegui_1.Button, { style: btnStyle, on: btnHandler, text: `Open React NodeGui docs` })));
}
exports.StepTwo = StepTwo;
const containerStyle = `
  flex: 1;
  justify-content: 'space-around';
`;
const textStyle = `
  padding-right: 20px;
`;
const btnStyle = `
  margin-horizontal: 20px;
  height: 40px;
`;
