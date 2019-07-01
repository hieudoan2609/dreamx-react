import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Chart.scss";
import Ticker from "./Ticker";
import Loading from './Loading'
import TradingView from './tradingview'

class Chart extends Component {
  renderChart = () => {
    if (!this.props.apiHttpRoot || !this.props.cable || !this.props.currentMarket) {
      return
    }

    const exchangeName = "DreamX"
    const apiHttpRoot = this.props.apiHttpRoot
    const cable = this.props.cable
    const symbol = `${exchangeName}:${this.props.currentMarket.replace('_', '/')}`
    return (
      <TradingView
        apiHttpRoot={apiHttpRoot}
        cable={cable}
        symbol={symbol}
        theme={this.props.theme}
        onLoading={this.props.onTradingviewLoading}
        onLoaded={this.props.onTradingviewLoaded}
      />
    )
  }

  render() {
    return (
      <div className={`Chart card 
        ${this.props.theme}
      }`}>
        <Loading
          active={this.props.loading}
          type="absolute"
          theme={this.props.theme}
        />
        <div className="ticker">
          <Ticker
            theme={this.props.theme}
            tickers={this.props.tickers}
            currentMarket={this.props.currentMarket}
            searchValue={this.props.searchValue}
            handleSearchInput={this.props.handleSearchInput}
          />
        </div>
        <div className="chart">
          {this.renderChart()}
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

Chart.propTypes = {
  theme: PropTypes.string.isRequired,
  tickers: PropTypes.array.isRequired,
  currentMarket: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  handleSearchInput: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  apiHttpRoot: PropTypes.string, // only becomes available once loading is done
  cable: PropTypes.object, // only becomes available once loading is done
  onTradingviewLoading: PropTypes.func.isRequired,
  onTradingviewLoaded: PropTypes.func.isRequired
};

export default Chart;
