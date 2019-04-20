import React from "react";
import ReactDOM from "react-dom";
import store from "../store";
import { Provider } from "react-redux";
import Boilerplate from "./Boilerplate";
import { render, cleanup } from "react-testing-library";

afterEach(cleanup);

it("renders without crashing", () => {
  render(
    <Provider store={store}>
      <Boilerplate />
    </Provider>
  );
});
