import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import "./Paginator.scss";

class Paginator extends Component {
  onPageLinkClick = e => {
    const target = e.currentTarget;

    let pageNumber;
    if (target.id === "prev") {
      pageNumber = this.props.currentPage - 1;
    } else if (target.id === "next") {
      pageNumber = this.props.currentPage + 1;
    } else {
      pageNumber = target.id;
    }

    this.props.handlePageChange(pageNumber);
  };

  renderPageLinks = () => {
    return _.times(5, i => {
      const currentPage = i + 1;
      return (
        <li
          className={`page-item ${
            this.props.currentPage === currentPage ? "active" : ""
          }`}
          key={currentPage}
          onClick={this.onPageLinkClick}
          id={currentPage}
        >
          <div className="page-link">{currentPage}</div>
        </li>
      );
    });
  };

  render() {
    return (
      <div className={`Paginator ${this.props.theme}`}>
        <nav aria-label="navigation">
          <ul className="pagination">
            <li
              className="page-item"
              id={"prev"}
              onClick={this.onPageLinkClick}
            >
              <div className="page-link">
                <ion-icon name="arrow-dropleft" />
              </div>
            </li>

            {this.renderPageLinks()}

            <li
              className="page-item"
              id={"next"}
              onClick={this.onPageLinkClick}
            >
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
  currentPage: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired
};

export default Paginator;
