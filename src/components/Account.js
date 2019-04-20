import React, { Component } from "react";
import { connect } from "react-redux";

import Login from "./Login";
import TabMenu from "./TabMenu";
import "./Account.scss";

class Account extends Component {
  state = {
    tabs: ["assets", "orders", "transfers", "trades"],
    currentTab: "assets"
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  render() {
    return (
      <div className="Account">
        <Login />

        <div className={`card ${this.props.app.theme}`}>
          <TabMenu
            items={this.state.tabs}
            currentItem={this.state.currentTab}
            theme={this.props.app.theme}
            onChange={this.handleTabChange}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ app }) => {
  return { app };
};

// const mapDispatchToProps = {
//  getChartData
// };

export default connect(mapStateToProps)(Account);
