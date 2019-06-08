import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Trade.scss";

class Trade extends Component {
  render() {
    return <div className={`Trade card ${this.props.theme}`}>Trade</div>;
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getTradeData
// };

Trade.propTypes = {
  theme: PropTypes.string.isRequired
};

export default Trade;
