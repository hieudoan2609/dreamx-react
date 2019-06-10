import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Button.scss";
import Loading from "./Loading";

class Button extends Component {
  render() {
    return (
      <div
        className={`Button ${this.props.theme} ${
          this.props.pending ? "pending" : ""
        } ${this.props.fullWidth ? "fullWidth" : ""}`}
      >
        <Loading
          type="button"
          active={this.props.pending ? true : false}
          theme={this.props.theme}
        />
        <div className="body" onClick={this.props.onClick}>
          {this.props.children}
        </div>
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
  children: PropTypes.node.isRequired,
  pending: PropTypes.bool,
  fullWidth: PropTypes.bool
};

export default Button;
