import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./MarketsTable.scss";
import TabMenu from "./TabMenu";
import Search from "./Search";
import Table from "./Table";

const markets = [
  { name: "ETH", price: 4.00000001, change: -39.56 },
  { name: "ETH", price: 4.00000001, change: -39.56 },
  { name: "ETH", price: 4.00000001, change: -39.56 },
  { name: "ETH", price: 4.00000001, change: -39.56 },
  { name: "ETH", price: 4.00000001, change: -39.56 },
  { name: "ETH", price: 4.00000001, change: -39.56 },
  { name: "ETH", price: 4.00000001, change: -39.56 },
  { name: "ETH", price: 4.00000001, change: -39.56 },
  { name: "ETH", price: 4.00000001, change: -39.56 },
  { name: "ETH", price: 4.00000001, change: -39.56 }
];

class MarketsTable extends Component {
  state = {
    tabs: ["all markets", "favourites"],
    currentTab: "all markets"
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  render() {
    return (
      <div className={`MarketsTable card ${this.props.theme}`}>
        <TabMenu
          items={this.state.tabs}
          currentItem={this.state.currentTab}
          theme={this.props.theme}
          onChange={this.handleTabChange}
        />
        <Search
          searchInputPlaceholder="Search a market..."
          theme={this.props.theme}
        />
        <div className="body">
          <Table
            theme={this.props.theme}
            dataName="markets"
            data={markets}
            defaultOrderBy="change"
          />
        </div>
      </div>
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getChartData
// };

MarketsTable.propTypes = {
  theme: PropTypes.string.isRequired
};

export default MarketsTable;
