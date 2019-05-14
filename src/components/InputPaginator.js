import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./InputPaginator.scss";

class InputPaginator extends Component {
  render() {
    return (
      <div className={`InputPaginator ${this.props.theme}`}>
        <ul>
          <li className="prev">
            <ion-icon name="arrow-dropleft" />
          </li>
          <li className="page">
            page <input spellCheck="false" defaultValue={1} /> of 30
          </li>
          <li className="next">
            <ion-icon name="arrow-dropright" />
          </li>
        </ul>
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

InputPaginator.propTypes = {
  theme: PropTypes.string.isRequired
};

export default InputPaginator;
