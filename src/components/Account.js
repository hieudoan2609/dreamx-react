import React, { Component } from "react";
import { connect } from "react-redux";

import Login from "./Login";
import TabMenu from "./TabMenu";
import SearchTable from "./SearchTable";
import "./Account.scss";

class Account extends Component {
  state = {
    tabs: ["assets", "orders", "transfers", "trades"],
    currentTab: "assets"
  };

  addActionsColumn = data => {
    for (let row of data) {
      row["actions"] = (
        <div className="actions">
          <div className="action">deposit</div>
          <div className="action">withdraw</div>
        </div>
      );
    }
    return data;
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  renderAssetSearchTable = () => {
    return (
      <SearchTable
        theme={this.props.app.theme}
        data={this.addActionsColumn(this.props.account.assets)}
        searchInputPlaceholder="Search by asset name or symbol..."
        defaultOrderBy="totalBalance"
        excludeFromSorting={["actions"]}
      />
    );
  };

  renderOrderSearchTable = () => {
    return <div>ORDERS</div>;
  };

  renderTransferSearchTable = () => {
    return <div>TRANSFERS</div>;
  };

  renderTradeSearchTable = () => {
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

          {this.state.currentTab === "assets" && this.renderAssetSearchTable()}
          {this.state.currentTab === "orders" && this.renderOrderSearchTable()}
          {this.state.currentTab === "transfers" &&
            this.renderTransferSearchTable()}
          {this.state.currentTab === "trades" && this.renderTradeSearchTable()}
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
