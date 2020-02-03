"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_nodegui_1 = require("@nodegui/react-nodegui");
const react_1 = __importDefault(require("react"));
const dogImg = require("./dog");
function StepOne() {
    return (react_1.default.createElement(react_nodegui_1.View, { style: containerStyle },
        react_1.default.createElement(react_nodegui_1.Text, { wordWrap: true }, "Edit App.tsx to make changes to this screen. Then come back to see your changes. Changes should reflect live thanks to Hot Reloading. \uD83D\uDD25"),
        react_1.default.createElement(react_nodegui_1.Text, null, `
          <p style="color: rgb(255,72,38);"> 
            <center>
              <img src="${dogImg}" alt="doggy" />  
            </center>
            <center>You can even use <i><strong>Rich Html</strong></i> text like this if you want 😎.</center>
          </p>
          <hr />
        `)));
}
exports.StepOne = StepOne;
const containerStyle = `
    margin-horizontal: 20px;
    padding-horizontal: 10px;
`;
