import React, { Component } from "react";
import { connect } from "react-redux";

import Login from "./Login";
import TabMenu from "./TabMenu";
import Table from "./Table";
import "./Account.scss";

class Account extends Component {
  state = {
    tabs: ["assets", "orders", "transfers", "trades"],
    currentTab: "assets"
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  renderAssetTable = () => {
    return (
      <Table theme={this.props.app.theme} data={this.props.account.assets} />
    );
  };

  renderOrderTable = () => {
    return <div>ORDERS</div>;
  };

  renderTransferTable = () => {
    return <div>TRANSFERS</div>;
  };

  renderTradeTable = () => {
    return <div>TRADES</div>;
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

          {this.state.currentTab === "assets" && this.renderAssetTable()}
          {this.state.currentTab === "orders" && this.renderOrderTable()}
          {this.state.currentTab === "transfers" && this.renderTransferTable()}
          {this.state.currentTab === "trades" && this.renderTradeTable()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ app, account }) => {
  return { app, account };
};

// const mapDispatchToProps = {
//  getChartData
// };

export default connect(mapStateToProps)(Account);
