import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Chart.scss";
import Ticker from "./Ticker.js";

class Chart extends Component {
  render() {
    return (
      <div className={`Chart card ${this.props.theme}`}>
        <Ticker theme={this.props.theme} />
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
  theme: PropTypes.string.isRequired
};

export default Chart;
