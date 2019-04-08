import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import store from "./store";
import { Provider } from "react-redux";

import Login from "./components/Login";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <Login />
          </header>
        </div>
      </Provider>
    );
  }
}

export default App;
