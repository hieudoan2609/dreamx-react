import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import "./Paginator.scss";

class Paginator extends Component {
  state = {
    totalLinks: this.props.totalPages > 5 ? 5 : this.props.totalPages
  };

  onPageLinkClick = e => {
    const target = e.currentTarget;
    const firstPage = 1;
    const lastPage = this.props.totalPages;

    let pageNumber;
    if (target.id === "prev") {
      if (this.props.currentPage === firstPage) {
        return;
      }
      pageNumber = this.props.currentPage - 1;
    } else if (target.id === "next") {
      if (this.props.currentPage === lastPage) {
        return;
      }
      pageNumber = this.props.currentPage + 1;
    } else {
      pageNumber = target.id;
    }

    this.props.handlePageChange(pageNumber);
  };

  renderPageLinks = () => {
    if (this.props.currentPage < 3 || this.props.totalPages < 5) {
      return this.renderPageLinksFromPage(1);
    } else if (this.props.currentPage > this.props.totalPages - 2) {
      return this.renderPageLinksFromPage(this.props.totalPages - 4);
    } else {
      return this.renderPageLinksFromPage(this.props.currentPage - 2);
    }
  };

  renderPageLinksFromPage = pageNumber => {
    return _.times(this.state.totalLinks, i => {
      const currentPage = i + pageNumber;
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
    const firstPage = 1;
    const lastPage = this.props.totalPages;

    return (
      <div className={`Paginator ${this.props.theme}`}>
        <nav aria-label="navigation">
          <ul className="pagination">
            <li
              className={`page-item ${
                this.props.currentPage === firstPage ? "disabled" : ""
              }`}
              id={"prev"}
              onClick={this.onPageLinkClick}
            >
              <div className="page-link">
                <ion-icon name="arrow-dropleft" />
              </div>
            </li>

            {this.renderPageLinks()}

            <li
              className={`page-item ${
                this.props.currentPage === lastPage ? "disabled" : ""
              }`}
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
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired
};

export default Paginator;
