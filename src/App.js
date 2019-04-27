import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Market from "./components/Market";
import Account from "./components/Account";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Menu from "./components/Menu";
import Loading from "./components/Loading";
import {
  toggleTheme,
  loadTheme,
  initializeAppAsync,
  accountLoginAsync,
  modalHide
} from "./actions";
import Modal from "./components/Modal";

const logo = require("./images/logo.svg");

const navItems = [
  {
    label: "home",
    pathname: "/"
  },
  {
    label: "market",
    pathname: "/market/ETH_NJA"
  },
  {
    label: "account",
    pathname: "/account"
  }
];

class App extends Component {
  componentWillMount = async () => {
    this.props.loadTheme();
    await this.props.initializeAppAsync();
    await this.props.accountLoginAsync();
  };

  render() {
    return (
      <BrowserRouter>
        <div className={`App ${this.props.app.theme}`}>
          <Modal
            show={this.props.modal.show}
            theme={this.props.app.theme}
            onHide={this.props.modalHide}
            type={this.props.modal.type}
            name={this.props.modal.name}
            symbol={this.props.modal.symbol}
          />

          <Menu
            brandName="Odin Trade"
            logo={logo}
            navItems={navItems}
            toggleTheme={this.props.toggleTheme}
            theme={this.props.app.theme}
          />

          <div className="container">
            <div className="row">
              <div className="col-12">
                <Loading
                  active={this.props.app.loading}
                  type="fixed"
                  theme={this.props.app.theme}
                />

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

const mapStateToProps = ({ app, modal }) => {
  return { app, modal };
};

const mapActionsToProps = {
  toggleTheme,
  loadTheme,
  initializeAppAsync,
  accountLoginAsync,
  modalHide
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
