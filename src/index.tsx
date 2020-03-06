import { Renderer } from "@nodegui/react-nodegui";
import React from "react";
import App from "./app";

process.title = "snippet";
Renderer.render(<App />, {
  onInit: (reconciler: any) => {
    if (process.env.NODE_ENV === "development") {
      require("@nodegui/devtools").connectReactDevtools(reconciler);
    }
  }
});

if (module.hot) {
  module.hot.accept(["./app"], function() {
    Renderer.forceUpdate();
  });
}
