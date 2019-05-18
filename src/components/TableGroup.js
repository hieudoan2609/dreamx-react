import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

// import "./TableGroup.scss";

class TableGroup extends Component {
  state = {
    height: this.props.height || 0,
    perPage: this.props.perPage || 0
  };

  render() {
    const { height, perPage } = this.state;
    const children = React.cloneElement(this.props.children, {
      height,
      perPage
    });

    return <div>{children}</div>;
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getChartData
// };

TableGroup.propTypes = {
  height: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired
};

export default TableGroup;
