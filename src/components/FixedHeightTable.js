import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

// import "./FixedHeightTable.scss";

class FixedHeightTable extends Component {
  render() {
    return <p>FixedHeightTable</p>;
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getChartData
// };

FixedHeightTable.propTypes = {
  height: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired
};

export default FixedHeightTable;
