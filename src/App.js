import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Market from "./components/Market";
import Account from "./components/Account";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <div className="container">
              <Switch>
                <Route exact path="/" component={Market} />
                <Route path="/market/:symbol" component={Market} />
                <Route path="/account" component={Account} />
                <Route component={Market} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
