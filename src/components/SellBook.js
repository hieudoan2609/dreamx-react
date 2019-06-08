import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./SellBook.scss";

class SellBook extends Component {
  render() {
    return <div className={`SellBook card ${this.props.theme}`}>SellBook</div>;
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getSellBookData
// };

SellBook.propTypes = {
  theme: PropTypes.string.isRequired
};

export default SellBook;
