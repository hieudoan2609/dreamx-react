import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Market from "./components/Market";
import Account from "./components/Account";
import Menu from "./components/Menu";
import Loading from "./components/Loading";
import {
  toggleTheme,
  loadTheme,
  initializeAppAsync,
  accountLoginAsync,
  appLoaded
} from "./actions";

const logo = require("./images/logo.svg");

class App extends Component {
  state = {
    navItems: [
      {
        label: "market",
        root: true
      },
      {
        label: "account",
        pathname: "/account"
      }
    ]
  };

  componentDidMount = async () => {
    this.props.loadTheme();
    await this.props.initializeAppAsync();
    await this.props.accountLoginAsync();
    this.props.appLoaded()
  };

  render() {
    const isLoading = this.props.app.loading || this.props.market.loading

    return (
      <BrowserRouter>
        <div className={`App ${this.props.app.theme}`}>
          <Menu
            brandName="Odin Trade"
            logo={logo}
            navItems={this.state.navItems}
            toggleTheme={this.props.toggleTheme}
            theme={this.props.app.theme}
            rootPath={`/market/${this.props.market.currentMarket}`}
          />

          <div className="container">
            <div className="row">
              <div className="col-12">
                <Loading
                  active={isLoading}
                  type="fixed"
                  theme={this.props.app.theme}
                />

                <Switch>
                  <Route exact path="/" component={Market} />
                  <Route path="/market/:marketSymbol?" component={Market} />
                  <Route path="/account" component={Account} />
                  <Route component={Market} />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

const mapActionsToProps = {
  toggleTheme,
  loadTheme,
  initializeAppAsync,
  accountLoginAsync,
  appLoaded
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
