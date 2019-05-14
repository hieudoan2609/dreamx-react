import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Paginator.scss";

class Paginator extends Component {
  render() {
    return (
      <div className={`Paginator ${this.props.theme}`}>
        <nav aria-label="navigation">
          <ul className="pagination">
            <li className="page-item">
              <div className="page-link">
                <ion-icon name="arrow-dropleft" />
              </div>
            </li>
            <li className="page-item active">
              <div className="page-link">1</div>
            </li>
            <li className="page-item">
              <div className="page-link">2</div>
            </li>
            <li className="page-item">
              <div className="page-link">3</div>
            </li>
            <li className="page-item">
              <div className="page-link">4</div>
            </li>
            <li className="page-item">
              <div className="page-link">5</div>
            </li>
            <li className="page-item">
              <div className="page-link">
                <ion-icon name="arrow-dropright" />
              </div>
            </li>
          </ul>
        </nav>
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

Paginator.propTypes = {
  theme: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired
};

export default Paginator;
