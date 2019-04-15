import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./Loading.scss";

class Loading extends Component {
  render() {
    return (
      <div
        className={`Loading 
          ${this.props.type} 
          ${this.props.theme} 
          ${this.props.active ? "active" : ""}`}
      >
        <ion-icon name="hourglass" />
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

Loading.propTypes = {
  active: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired
};

export default Loading;
