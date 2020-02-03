import { Text, Window, hot, View, LineEdit, PlainTextEdit } from '@nodegui/react-nodegui'
import React from "react";
import { QIcon } from "@nodegui/nodegui";
import path from "path";
import { StepOne } from "./components/stepone";
import { StepTwo } from "./components/steptwo";
import nodeguiIcon from "../assets/nodegui.jpg";

const minSize = { width: 800, height: 520 };
const winIcon = new QIcon(path.resolve(__dirname, nodeguiIcon));
class App extends React.Component {
  render() {
    return (
      <Window
        windowIcon={winIcon}
        windowTitle="Hello 👋🏽"
        minSize={minSize}
        styleSheet={styleSheet}
      >
        <View style={containerStyle}>
          <Text id="welcome-text">123</Text>
          <PlainTextEdit placeholderText="默认输入"/>
        </View>
      </Window>
    );
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

export default hot(App);
