"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_nodegui_1 = require("@nodegui/react-nodegui");
const react_1 = __importStar(require("react"));
const nodegui_1 = require("@nodegui/nodegui");
const path_1 = __importDefault(require("path"));
const nodegui_jpg_1 = __importDefault(require("../assets/nodegui.jpg"));
const showdown_1 = __importDefault(require("showdown"));
const minSize = { width: 800, height: 520 };
const winIcon = new nodegui_1.QIcon(path_1.default.resolve(__dirname, nodegui_jpg_1.default));
const MyCus = () => {
    const [text, setText] = react_1.useState('');
    return (react_1.default.createElement(react_nodegui_1.Window, { minSize: { width: 500, height: 200 } },
        react_1.default.createElement(react_nodegui_1.View, null,
            react_1.default.createElement(react_nodegui_1.LineEdit, { text: text, on: {
                    textChanged: (text) => {
                        console.log(text);
                    }
                } }),
            react_1.default.createElement(react_nodegui_1.Button, { on: { clicked: () => setText('') } }))));
};
class App extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            preView: ''
        };
        this.textRef = react_1.default.createRef();
        this.setText = (text) => {
            console.log('setText', text);
        };
        console.log('rrun!');
    }
    render() {
        return (react_1.default.createElement(react_nodegui_1.Window, { windowIcon: winIcon, windowTitle: "Hello \uD83D\uDC4B\uD83C\uDFFD", minSize: minSize, styleSheet: styleSheet },
            react_1.default.createElement(react_nodegui_1.View, { styleSheet: containerStyle },
                react_1.default.createElement(react_nodegui_1.Text, { id: "welcome-text" }, "123"),
                react_1.default.createElement(react_nodegui_1.PlainTextEdit, { ref: this.textRef, on: {
                        textChanged: (text) => {
                            const text2 = this.textRef.current.toPlainText();
                            const converter = new showdown_1.default.Converter();
                            const html = converter.makeHtml(text2);
                            this.setState({
                                preView: html
                            });
                            console.log('textChanged', text2);
                        },
                    }, style: `border:1px solid #ddd;margin:20px;flex:1;`, placeholderText: "\u9ED8\u8BA4\u8F93\u5165" }),
                react_1.default.createElement(react_nodegui_1.Button, { on: {
                        clicked: () => {
                            console.log('run22');
                        }
                    }, text: "click it" }),
                react_1.default.createElement(react_nodegui_1.Text, { html: "", id: "text" }, this.state.preView))));
    }
}
const containerStyle = `
  #text{
    margin:10px;
    font-size:18px
  }
`;
const styleSheet = `
  #welcome-text {
    font-size: 30px;
    padding-top: 50px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }
 
`;
exports.default = react_nodegui_1.hot(App);
