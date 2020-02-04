import { Renderer } from "@nodegui/react-nodegui";
import React from "react";
import App from "./app";

process.title = "My NodeGui App";
Renderer.render(<App />);

if (module.hot) {
  module.hot.accept(["./app"], function() {
    Renderer.forceUpdate();
  });
}
