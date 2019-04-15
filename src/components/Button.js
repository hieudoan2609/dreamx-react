import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Button.scss";

class Button extends Component {
  render() {
    return (
      <div
        onClick={this.props.onClick}
        className={`Button ${this.props.theme}`}
      >
        {this.props.children}
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

Button.propTypes = {
  theme: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Button;
