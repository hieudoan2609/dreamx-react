import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Ticker.scss";
import Search from "./Search";

class Ticker extends Component {
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
            onClick={() => this.props.changeMarket(t.marketSymbol)}
          >
            <div className="name">{t.tickerSymbol}</div>
            <div className="price">{t.last ? t.last : "N/A"}</div>
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
  changeMarket: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  handleSearchInput: PropTypes.func.isRequired
};

export default Ticker;
