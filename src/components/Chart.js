import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Chart.scss";
import Ticker from "./Ticker";
import Loading from './Loading'

class Chart extends Component {
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
          CHART
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
  handleSearchInput: PropTypes.func.isRequired
};

export default Chart;
