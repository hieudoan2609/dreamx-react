import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Market from "./components/Market";
import Account from "./components/Account";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Menu from "./components/Menu";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App bg-light">
          <Menu />

          <div className="container">
            <div className="row">
              <div className="col-12">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/market/:symbol" component={Market} />
                  <Route path="/account" component={Account} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
