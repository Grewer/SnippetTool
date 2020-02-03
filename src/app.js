"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_nodegui_1 = require("@nodegui/react-nodegui");
const react_1 = __importDefault(require("react"));
const nodegui_1 = require("@nodegui/nodegui");
const path_1 = __importDefault(require("path"));
const nodegui_jpg_1 = __importDefault(require("../assets/nodegui.jpg"));
const minSize = { width: 800, height: 520 };
const winIcon = new nodegui_1.QIcon(path_1.default.resolve(__dirname, nodegui_jpg_1.default));
class App extends react_1.default.Component {
    render() {
        return (react_1.default.createElement(react_nodegui_1.Window, { windowIcon: winIcon, windowTitle: "Hello \uD83D\uDC4B\uD83C\uDFFD", minSize: minSize, styleSheet: styleSheet },
            react_1.default.createElement(react_nodegui_1.View, { style: containerStyle },
                react_1.default.createElement(react_nodegui_1.Text, { id: "welcome-text" }, "123"),
                react_1.default.createElement(react_nodegui_1.PlainTextEdit, { placeholderText: "\u9ED8\u8BA4\u8F93\u5165" }))));
    }
}
const containerStyle = `
  flex: 1; 
`;
const styleSheet = `
  #welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }

  #step-1, #step-2 {
    font-size: 18px;
    padding-top: 10px;
    padding-horizontal: 20px;
  }
`;
exports.default = react_nodegui_1.hot(App);
