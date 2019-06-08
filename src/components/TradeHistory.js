import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./TradeHistory.scss";

class TradeHistory extends Component {
  render() {
    return (
      <div className={`TradeHistory card ${this.props.theme}`}>
        TradeHistory
      </div>
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getTradeHistoryData
// };

TradeHistory.propTypes = {
  theme: PropTypes.string.isRequired
};

export default TradeHistory;
