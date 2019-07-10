import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  truncateNumberOutput
} from "../helpers";

import "./Ticker.scss";
import Search from "./Search";

class Ticker extends Component {
  changeMarket = marketSymbol => {
    this.props.history.push(`/market/${marketSymbol}`);
  };

  renderTickers = () => {
    if (this.props.tickers.length === 0) {
      return <div className="not-found">No tickers could be found.</div>;
    }

    return this.props.tickers.map(t => {
      const active = t.marketSymbol === this.props.currentMarket;

      return (
        <div
          className={`ticker ${active ? "active" : ""} ${
            t.percentChange > 0 ? "up" : t.percentChange < 0 ? "down" : ""
          }`}
          key={t.tickerSymbol}
        >
          <div
            className="body"
            onClick={() => this.changeMarket(t.marketSymbol)}
          >
            <div className="name">{t.tickerSymbol}</div>
            <div className="price">{t.last ? truncateNumberOutput(t.last, 8, 10) : "N/A"}</div>
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className={`Ticker ${this.props.theme}`}>
        <div className="search">
          <Search
            searchInputPlaceholder="Search..."
            theme={this.props.theme}
            searchValue={this.props.searchValue}
            handleSearchInput={this.props.handleSearchInput}
          />
        </div>
        <div className="tickers">{this.renderTickers()}</div>
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

Ticker.propTypes = {
  theme: PropTypes.string.isRequired,
  tickers: PropTypes.array.isRequired,
  currentMarket: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  handleSearchInput: PropTypes.func.isRequired
};

export default withRouter(Ticker);
