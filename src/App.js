import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Market from "./components/Market";
import Account from "./components/Account";
import Menu from "./components/Menu";
import AlertModal from "./components/AlertModal";
import ModalWrapper from "./components/ModalWrapper";
import {
  toggleTheme,
  loadTheme,
  initializeAppAsync,
  accountLoginAsync,
  appLoaded,
  marketLoadAsync,
  alertModalHide
} from "./actions";
import { ReactComponent as Logo } from './images/dream.svg'

const logo = {
  dark: '/dream-dark.png',
  light: '/dream-light.png'
}

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
    await this.props.marketLoadAsync()
    this.props.appLoaded()
  };

  renderAlertModal = () => {
    return (
      <AlertModal 
        theme={this.props.app.theme}
        type={this.props.alertModal.type}
      />
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className={`App ${this.props.app.theme}`}>
          <Menu
            logo={logo}
            navItems={this.state.navItems}
            toggleTheme={this.props.toggleTheme}
            theme={this.props.app.theme}
            rootPath={`/market/${this.props.market.currentMarket}`}
          />

          <ModalWrapper
            theme={this.props.app.theme}
            show={this.props.alertModal.show}
            onHide={this.props.alertModalHide}
            renderFrontModal={this.renderAlertModal}
          />

          <div className="container">
            <div className="row">
              <div className="col-12">
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
  appLoaded,
  marketLoadAsync,
  alertModalHide
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
