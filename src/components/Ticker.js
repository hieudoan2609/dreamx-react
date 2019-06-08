import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Ticker.scss";
import Search from "./Search";

class Ticker extends Component {
  render() {
    return (
      <div className={`Ticker ${this.props.theme}`}>
        <div className="search">
          <Search searchInputPlaceholder="Search..." theme={this.props.theme} />
        </div>
        <div className="tickers">Tickers</div>
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
  theme: PropTypes.string.isRequired
};

export default Ticker;
