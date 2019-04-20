import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import { render, cleanup } from "react-testing-library";

afterEach(cleanup);

it("renders without crashing", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
