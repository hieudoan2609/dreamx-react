import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./MarketOrders.scss";

class MarketOrders extends Component {
  render() {
    return (
      <div className={`MarketOrders card ${this.props.theme}`}>
        MarketOrders
      </div>
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getMarketOrdersData
// };

MarketOrders.propTypes = {
  theme: PropTypes.string.isRequired
};

export default MarketOrders;
