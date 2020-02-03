"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_nodegui_1 = require("@nodegui/react-nodegui");
const react_1 = __importDefault(require("react"));
const app_1 = __importDefault(require("./app"));
process.title = "My NodeGui App";
react_nodegui_1.Renderer.render(react_1.default.createElement(app_1.default, null));
// This is for hot reloading (this will be stripped off in production by webpack)
if (module.hot) {
    module.hot.accept(["./app"], function () {
        react_nodegui_1.Renderer.forceUpdate();
    });
}
