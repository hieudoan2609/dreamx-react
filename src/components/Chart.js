import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Chart.scss";
import Ticker from "./Ticker";
import Loading from './Loading'
import TradingView from './tradingview'

class Chart extends Component {
  getPricescale = () => {
    return 10 ** this.props.market.pricePrecision
  }

  renderChart = () => {
    if (!this.props.apiHttpRoot || !this.props.cable || !this.props.marketSymbol) {
      return
    }

    const exchangeName = "DreamX"
    const apiHttpRoot = this.props.apiHttpRoot
    const cable = this.props.cable
    const symbol = `${exchangeName}:${this.props.marketSymbol.replace('_', '/')}`

    return (
      <TradingView
        apiHttpRoot={apiHttpRoot}
        cable={cable}
        symbol={symbol}
        theme={this.props.theme}
        onLoading={this.props.onTradingviewLoading}
        onLoaded={this.props.onTradingviewLoaded}
        getPricescale={this.getPricescale}
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
            tickers={this.props.tickers.filtered}
            marketSymbol={this.props.marketSymbol}
            searchValue={this.props.searchValue}
            handleSearchInput={this.props.handleSearchInput}
            market={this.props.market}
          />
        </div>
        <div className="chart">
          {this.renderChart()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
 return state;
};

// const mapActionsToProps = {
//  getChartData
// };

Chart.propTypes = {
  theme: PropTypes.string.isRequired,
  marketSymbol: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  handleSearchInput: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  apiHttpRoot: PropTypes.string, // only becomes available once loading is done
  cable: PropTypes.object, // only becomes available once loading is done
  onTradingviewLoading: PropTypes.func.isRequired,
  onTradingviewLoaded: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Chart);
