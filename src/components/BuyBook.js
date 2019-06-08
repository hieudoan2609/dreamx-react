import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./BuyBook.scss";

class BuyBook extends Component {
  render() {
    return <div className={`BuyBook card ${this.props.theme}`}>BuyBook</div>;
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getBuyBookData
// };

BuyBook.propTypes = {
  theme: PropTypes.string.isRequired
};

export default BuyBook;
