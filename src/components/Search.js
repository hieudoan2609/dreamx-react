import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Search.scss";

class Search extends Component {
  handleSearchInput = e => {
    this.props.handleSearch(e.target.value);
  };

  render() {
    return (
      <div className={`Search ${this.props.theme}`}>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroupPrepend3">
              <ion-icon name="search" />
            </span>
          </div>
          <input
            className="form-control search"
            placeholder={this.props.searchInputPlaceholder}
            spellCheck="false"
            value={this.props.searchValue}
            onChange={this.handleSearchInput}
          />
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

Search.propTypes = {
  theme: PropTypes.string.isRequired,
  searchInputPlaceholder: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired
};

export default Search;
